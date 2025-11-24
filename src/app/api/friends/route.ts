// src/app/api/friends/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { getAuthenticatedUser } from '@/lib/checkUser';

// Función auxiliar para generar código aleatorio (Ej: SANTI-A23)
const generateCode = (name: string) => {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'USER');
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${random}`;
};

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Si el usuario no tiene código, se lo creamos ahora mismo
    if (!user.friendCode) {
      user.friendCode = generateCode(user.name || 'USER');
      await user.save();
    }

    // 2. Buscar a los amigos y calcular sus gráficas
    // (Solo traemos el ID, nombre y sus actividades)
    const friendsList = await User.find({ _id: { $in: user.friends } }).select('name _id');
    
    const friendsData = await Promise.all(friendsList.map(async (friend) => {
      // Buscamos las actividades de este amigo
      const activities = await Activity.find({ userId: friend._id });
      
      // Calculamos su array mensual [Ene, Feb...] igual que en tu dashboard
      const monthlyData = new Array(12).fill(0);
      activities.forEach((act) => {
        const date = new Date(act.date);
        const monthIndex = date.getMonth();
        monthlyData[monthIndex] += act.carbonAmount;
      });

      return {
        id: friend._id,
        name: friend.name,
        data: monthlyData // Array de 12 números listo para la gráfica
      };
    }));

    return NextResponse.json({ 
      myCode: user.friendCode,
      friends: friendsData 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code } = await request.json();

    // 1. Validaciones
    if (!code) return NextResponse.json({ error: 'Falta el código' }, { status: 400 });
    if (code === user.friendCode) return NextResponse.json({ error: 'No puedes agregarte a ti mismo' }, { status: 400 });

    // 2. Buscar al amigo
    const friend = await User.findOne({ friendCode: code });
    if (!friend) return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });

    // 3. Evitar duplicados
    if (user.friends.includes(friend._id)) {
      return NextResponse.json({ error: 'Ya tienes agregado a este amigo' }, { status: 400 });
    }

    // 4. Agregar
    user.friends.push(friend._id);
    await user.save();

    return NextResponse.json({ success: true, friendName: friend.name });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}