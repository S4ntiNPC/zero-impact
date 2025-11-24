// src/models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  totalCarbonFootprint: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  
  // --- NUEVOS CAMPOS PARA ECO-AMIGOS ---
  friendCode: { type: String, unique: true, sparse: true }, // El código para compartir (ej: "ANA-832")
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Lista de personas que sigo
  // -------------------------------------

  cachedTips: { type: [Schema.Types.Mixed], default: [] },
  tipsVersion: { type: Number, default: -1 },
  cachedResources: { type: [Schema.Types.Mixed], default: [] },
  cachedResCategory: { type: String, default: '' },
  learningVersion: { type: Number, default: -1 },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model('User', UserSchema);
export default User;