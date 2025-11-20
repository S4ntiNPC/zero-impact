// src/app/api/activities/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { calculateFootprint } from '@/utils/carbonCalculator';

interface Params {
  params: Promise<{ id: string }>
}

// ----------------------------------------------------------------------
// DELETE: Eliminar una actividad y restar su impacto del usuario
// ----------------------------------------------------------------------
export async function DELETE(request: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    // 1. Buscar la actividad antes de borrarla para saber cuánto CO2 restar
    const activity = await Activity.findById(id);
    if (!activity) {
      return NextResponse.json({ success: false, error: 'Actividad no encontrada' }, { status: 404 });
    }

    // 2. Eliminar la actividad
    await Activity.findByIdAndDelete(id);

    // 3. Restar el impacto del usuario
    const user = await User.findById(activity.userId);
    if (user) {
      user.totalCarbonFootprint -= activity.carbonAmount;
      // Evitar números negativos por errores de redondeo
      if (user.totalCarbonFootprint < 0) user.totalCarbonFootprint = 0;
      await user.save();
    }

    return NextResponse.json({ success: true, message: 'Eliminado correctamente' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// PUT: Editar una actividad y ajustar la diferencia de impacto
// ----------------------------------------------------------------------
export async function PUT(request: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { type, value, customName, date } = body;

    // 1. Buscar la actividad original
    const oldActivity = await Activity.findById(id);
    if (!oldActivity) {
      return NextResponse.json({ success: false, error: 'Actividad no encontrada' }, { status: 404 });
    }

    // 2. Calcular el NUEVO impacto
    const newFootprint = calculateFootprint(type, parseFloat(value));
    
    // 3. Calcular la diferencia (Nuevo - Viejo) para ajustar al usuario
    const carbonDifference = newFootprint.totalCo2 - oldActivity.carbonAmount;

    // 4. Actualizar la actividad
    oldActivity.name = customName || newFootprint.category;
    oldActivity.type = type;
    oldActivity.category = newFootprint.category;
    oldActivity.value = parseFloat(value);
    oldActivity.carbonAmount = newFootprint.totalCo2;
    if (date) oldActivity.date = new Date(date);
    
    await oldActivity.save();

    // 5. Actualizar al usuario con la diferencia
    const user = await User.findById(oldActivity.userId);
    if (user) {
      user.totalCarbonFootprint += carbonDifference;
      // Evitar negativos
      if (user.totalCarbonFootprint < 0) user.totalCarbonFootprint = 0;
      await user.save();
    }

    return NextResponse.json({ success: true, data: oldActivity });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}