// src/lib/checkUser.ts
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import connectDB from "@/lib/db";

export const getAuthenticatedUser = async () => {
  // 1. Obtenemos el usuario desde Clerk (Google)
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  await connectDB();

  // 2. Buscamos si ya existe en nuestra base de datos
  let dbUser = await User.findOne({ clerkId: clerkUser.id });

  // 3. Si no existe, lo creamos automáticamente (Sincronización)
  if (!dbUser) {
    dbUser = await User.create({
      clerkId: clerkUser.id,
      name: `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim(),
      email: clerkUser.emailAddresses[0].emailAddress,
    });
  }

  return dbUser;
};