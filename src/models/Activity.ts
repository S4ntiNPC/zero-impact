// src/models/Activity.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // 👇 ¡ESTA ES LA LÍNEA QUE FALTABA! 👇
  // Sin esto, Mongoose ignora el nombre personalizado que envías
  name: {
    type: String,
    required: false, // No es obligatorio porque a veces usaremos el default
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  carbonAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

// Evita re-compilar el modelo si ya existe
const Activity = models.Activity || model('Activity', ActivitySchema);

export default Activity;