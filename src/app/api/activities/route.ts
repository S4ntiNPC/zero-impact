// src/app/api/activities/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import { calculateFootprint } from '@/utils/carbonCalculator';
import { checkNewBadges } from '@/utils/badgeSystem';
import { getAuthenticatedUser } from '@/lib/checkUser'; // <--- NUEVO HELPER

export async function GET(request: Request) {
  try {
    await connectDB();

    // 👇 REEMPLAZAMOS LA BÚSQUEDA DEL DEMO POR EL USUARIO REAL
    const user = await getAuthenticatedUser();

    if (!user) {
      // Si no está logueado, devolvemos error 401 o datos vacíos
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const activities = await Activity.find({ userId: user._id }).sort({ date: -1, _id: -1 }).limit(50);

    const breakdown: Record<string, number> = {};
    activities.forEach((act) => {
      if (!breakdown[act.category]) breakdown[act.category] = 0;
      breakdown[act.category] += act.carbonAmount;
    });

    return NextResponse.json({
      success: true,
      total: user.totalCarbonFootprint,
      badges: user.badges,
      activities,
      breakdown
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    // 👇 OBTENER USUARIO AUTENTICADO
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { type, value, customName, date } = body;

    if (!type || !value) {
      return NextResponse.json({ success: false, error: 'Faltan datos' }, { status: 400 });
    }

    const footprint = calculateFootprint(type, parseFloat(value));

    const newActivity = await Activity.create({
      userId: user._id, // Usamos el ID real de MongoDB del usuario logueado
      name: customName || footprint.category,
      type: type, 
      category: footprint.category,
      value: parseFloat(value),
      carbonAmount: footprint.totalCo2,
      date: date ? new Date(date) : new Date()
    });

    user.totalCarbonFootprint += footprint.totalCo2;

    const activityCount = await Activity.countDocuments({ userId: user._id });
    const newBadges = checkNewBadges(user.badges, type, activityCount);

    if (newBadges.length > 0) {
      user.badges = [...user.badges, ...newBadges];
    }

    await user.save();

    return NextResponse.json({ success: true, data: newActivity, newBadges });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}