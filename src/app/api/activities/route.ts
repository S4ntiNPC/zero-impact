// src/app/api/activities/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import { calculateFootprint } from '@/utils/carbonCalculator';
import { checkNewBadges } from '@/utils/badgeSystem';
import { getAuthenticatedUser } from '@/lib/checkUser'; // Helper para autenticación con Clerk

export async function GET(request: Request) {
  // Declaramos user afuera para que esté disponible en el bloque catch (para debugging)
  let user = null;

  try {
    await connectDB();
    user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Contar actividades actuales (para la lógica de caché/UI)
    const currentCount = await Activity.countDocuments({ userId: user._id });

    // 2. BUSQUEDA Y ORDENAMIENTO ESTABLE (Solución final para Vercel)
    // Ordena primero por fecha (date: -1), luego desempata por el ID de creación (_id: -1).
    const activities = await Activity.find({ userId: user._id })
      .sort({ date: -1, _id: -1 }) 
      .limit(50);

    // 3. Calcular desglose por categoría para la gráfica
    const breakdown: Record<string, number> = {};
    
    activities.forEach((act) => {
      if (!breakdown[act.category]) {
        breakdown[act.category] = 0;
      }
      breakdown[act.category] += act.carbonAmount;
    });

    return NextResponse.json({
      success: true,
      total: user.totalCarbonFootprint, // Huella total del usuario
      badges: user.badges,             // Insignias desbloqueadas
      activities,                      // Historial
      breakdown,                       // Datos para la gráfica de dona
      currentCount
    });

  } catch (error: any) {
    console.error("GET Error:", error);
    // Fallback de datos si la base de datos o conexión fallan
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // 1. AUTENTICACIÓN
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    // 2. OBTENER DATOS (Incluye nombre personalizado y fecha)
    const body = await request.json();
    const { type, value, customName, date } = body;

    if (!type || !value) {
      return NextResponse.json({ success: false, error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // 3. CÁLCULO
    const footprint = calculateFootprint(type, parseFloat(value));

    // 4. GUARDAR NUEVA ACTIVIDAD
    const newActivity = await Activity.create({
      userId: user._id,
      name: customName || footprint.category, // Nombre visible
      type: type, 
      category: footprint.category,
      value: parseFloat(value),
      carbonAmount: footprint.totalCo2,
      date: date ? new Date(date) : new Date() // Fecha de registro (pasada o futura)
    });

    // 5. ACTUALIZAR TOTAL DEL USUARIO
    user.totalCarbonFootprint += footprint.totalCo2;

    // 6. GAMIFICACIÓN
    const activityCount = await Activity.countDocuments({ userId: user._id });
    const newBadges = checkNewBadges(user.badges, type, activityCount);

    if (newBadges.length > 0) {
      user.badges = [...user.badges, ...newBadges];
    }
    
    await user.save();

    return NextResponse.json({ success: true, data: newActivity, newBadges });

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}