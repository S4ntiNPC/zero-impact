// src/models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  totalCarbonFootprint: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },

  // --- NUEVOS CAMPOS PARA CACHÉ (MEMORIA IA) ---
  
  // 1. Memoria para Consejos
  cachedTips: { type: [Schema.Types.Mixed], default: [] }, // Guardamos los consejos aquí
  tipsVersion: { type: Number, default: -1 }, // Guardamos cuántas actividades tenías la última vez

  // 2. Memoria para Educación
  cachedResources: { type: [Schema.Types.Mixed], default: [] }, // Guardamos los recursos aquí
  cachedResCategory: { type: String, default: '' }, // Guardamos la categoría detectada
  learningVersion: { type: Number, default: -1 }, // Guardamos cuántas actividades tenías
});

const User = models.User || model('User', UserSchema);
export default User;