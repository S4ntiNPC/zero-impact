// src/models/Activity.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { // Nombre personalizado de la actividad (ej: "Mi viaje a la oficina")
    type: String,
    required: false,
  },
  type: { // ID del factor de emisión (ej: 'trans_car_gas')
    type: String,
    required: true,
  },
  category: { // Categoría principal (ej: 'Transporte', 'Alimentación')
    type: String,
    required: true,
  },
  value: { // Cantidad registrada por el usuario (ej: 10 km)
    type: Number,
    required: true,
  },
  carbonAmount: { // Huella calculada (kg CO2eq)
    type: Number,
    required: true,
  },
  date: { // Fecha que el usuario seleccionó (pasada o futura)
    type: Date,
    default: Date.now,
  }
}, { timestamps: true }); // <-- CRUCIAL: Añade 'createdAt' y 'updatedAt' para el ordenamiento estable

const Activity = models.Activity || model('Activity', ActivitySchema);
export default Activity;