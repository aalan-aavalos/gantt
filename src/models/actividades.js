const { Schema, model, models } = require("mongoose");

const actividadesSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true, // Lo que hace es que borra los espacios del final e inicio
    },
    fechaI: {
      type: Date,
      trim: true, // Lo que hace es que borra los espacios del final e inicio
    },
    fechaF: {
      type: Date,
      trim: true,
    },
    motivo: {
      type: String,
      trim: true,
    },
    Administradores: {
      type: [String],
      trim: true,
    },
    Empleados: {
      type: [String],
      trim: true,
    },
    estado: {
      type: String,
      trim: true,
    },
    eCorreo: {
      type: [String],
      trim: true,
    },
    tipo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export default models.Actividades || model("Actividades", actividadesSchema);
