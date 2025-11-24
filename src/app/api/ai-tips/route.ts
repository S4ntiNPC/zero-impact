// src/app/api/ai-tips/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import { getAuthenticatedUser } from '@/lib/checkUser';

export async function GET() {
  // 1. CORRECCIÓN: Declaramos la variable AQUÍ afuera
  let user = null;

  try {
    await connectDB();
    
    // 2. Asignamos el valor aquí adentro
    user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Contar actividades actuales
    const currentCount = await Activity.countDocuments({ userId: user._id });

    // --- CACHÉ ---
    // TypeScript a veces se queja, así que usamos 'as any' para leer propiedades dinámicas
    const safeUserCheck = user as any;
    
    if (safeUserCheck.cachedTips && safeUserCheck.cachedTips.length > 0 && safeUserCheck.tipsVersion === currentCount) {
      console.log("⚡ Usando consejos de memoria (Sin llamar a IA)");
      return NextResponse.json({ tips: safeUserCheck.cachedTips });
    }

    // Proceso normal...
    const activities = await Activity.find({ userId: user._id }).limit(50);
    const summary: Record<string, number> = {};
    const detailedHabits: string[] = [];

    activities.forEach((act) => {
      if (!summary[act.category]) summary[act.category] = 0;
      summary[act.category] += act.carbonAmount;
      detailedHabits.push(`${act.name} (${act.value} ${act.unit || 'ud'})`);
    });

    if (activities.length === 0) {
      return NextResponse.json({ tips: [{ title: "Empieza hoy", description: "Registra una actividad.", category: "General" }] });
    }

    // Llamada a la IA (GEMINI FLASH 3.0)
    const prompt = `
      Eres experto ambiental. Analiza: ${JSON.stringify(summary)}. Hábitos: ${detailedHabits.slice(0, 20).join(', ')}.
      Genera 4 consejos breves JSON: [{"title": "...", "description": "...", "category": "..."}].
      Prioriza el mayor impacto.
    `;

    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    const cleanJson = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").replace(/```json|```/g, '').trim();
    
    let tips = [];
    try {
      tips = JSON.parse(cleanJson);

      // --- GUARDAR EN CACHÉ ---
      // Aquí usamos 'as any' para poder escribir en las propiedades nuevas sin que TS se queje
      const userToSave = user as any;
      userToSave.cachedTips = tips;
      userToSave.tipsVersion = currentCount;
      await userToSave.save();
      
    } catch (e) {
      tips = [{ title: "Error de formato", description: "Intenta de nuevo.", category: "General" }];
    }

    return NextResponse.json({ tips });

  } catch (error: any) {
    // 3. Ahora 'user' SÍ existe aquí porque lo declaramos afuera
    const safeUser = user as any;

    // Si la IA falla, pero tenemos caché viejo, lo usamos
    if (safeUser && safeUser.cachedTips && safeUser.cachedTips.length > 0) {
      return NextResponse.json({ tips: safeUser.cachedTips });
    }
    
    return NextResponse.json({ 
      tips: [{ title: "Modo Offline", description: "No pudimos conectar, intenta más tarde.", category: "Sistema" }] 
    });
  }
}