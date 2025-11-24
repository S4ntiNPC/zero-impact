// src/app/api/ai-learning/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import { getAuthenticatedUser } from '@/lib/checkUser';

// Recursos de respaldo por si todo falla
const FALLBACK_RESOURCES = [
  { title: "Vivir sin huella: Guía de la ONU", description: "Las claves oficiales para reducir el impacto.", type: "article", query: "ONU Actúa Ahora guia" },
  { title: "Cowspiracy: El secreto de la sustentabilidad", description: "Documental sobre el impacto de la ganadería.", type: "video", query: "documental cowspiracy resumen" },
  { title: "Minimalismo: Menos es más", description: "Cómo el consumo afecta al planeta.", type: "video", query: "minimalismo documental netflix" }
];

export async function GET() {
  // 1. CORRECCIÓN: Declaramos la variable AFUERA para que exista en el catch
  let user = null;

  try {
    await connectDB();
    
    // 2. Asignamos el valor
    user = await getAuthenticatedUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentCount = await Activity.countDocuments({ userId: user._id });

    // --- LÓGICA DE CACHÉ ---
    const safeUserCheck = user as any; // Casting para evitar error de TS

    // Si tenemos recursos guardados Y no hay actividades nuevas...
    if (safeUserCheck.cachedResources && safeUserCheck.cachedResources.length > 0 && safeUserCheck.learningVersion === currentCount) {
      console.log("⚡ Usando educación de memoria (Sin llamar a IA)");
      return NextResponse.json({ 
        resources: safeUserCheck.cachedResources, 
        category: safeUserCheck.cachedResCategory || 'General' 
      });
    }

    // Si hay cambios, calculamos de nuevo...
    const activities = await Activity.find({ userId: user._id }).limit(50);
    const summary: Record<string, number> = {};
    
    activities.forEach((act) => {
      if (!summary[act.category]) summary[act.category] = 0;
      summary[act.category] += act.carbonAmount;
    });

    // Calcular categoría crítica
    let maxCategory = 'General';
    let maxValue = 0;
    Object.entries(summary).forEach(([cat, value]) => {
      if (value > maxValue) { maxValue = value; maxCategory = cat; }
    });

    if (activities.length === 0) {
      return NextResponse.json({ resources: FALLBACK_RESOURCES, category: "General" });
    }

    // 3. LLAMADA A LA IA (GEMINI FLASH 3.0)
    const prompt = `
      Actúa como un profesor de ecología. El usuario tiene una huella de carbono alta en: ${maxCategory}.
      Recomienda 3 recursos educativos ESPECÍFICOS (Documentales famosos, Libros, Artículos virales).
      
      Reglas:
      1. Respuesta SOLO en JSON válido: [{"title": "Título Exacto", "description": "Breve resumen", "type": "video/article/book"}]
      2. No inventes URLs.
      3. Idioma: Español.
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
    
    let resources = [];
    try {
      const parsed = JSON.parse(cleanJson);
      // Agregamos el campo query para el link
      resources = parsed.map((r: any) => ({
        ...r,
        query: `${r.title} ${r.type === 'video' ? 'documental' : 'articulo'} ${maxCategory}`
      }));

      // --- GUARDAR EN CACHÉ ---
      const userToSave = user as any;
      userToSave.cachedResources = resources;
      userToSave.cachedResCategory = maxCategory;
      userToSave.learningVersion = currentCount;
      await userToSave.save();

    } catch (e) {
      resources = FALLBACK_RESOURCES;
    }

    return NextResponse.json({ resources, category: maxCategory });

  } catch (error: any) {
    // 4. Ahora 'user' existe aquí. Usamos caché viejo si la IA falla.
    const safeUser = user as any;

    if (safeUser && safeUser.cachedResources && safeUser.cachedResources.length > 0) {
      return NextResponse.json({ 
        resources: safeUser.cachedResources, 
        category: safeUser.cachedResCategory 
      });
    }
    
    return NextResponse.json({ resources: FALLBACK_RESOURCES, category: "General" });
  }
}