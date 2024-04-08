const { Schema, model, models } = require("mongoose");

const usrsSchema = new Schema(
  {
    eNombre: {
      type: String,
      trim: true,
    },
    eApeP: {
      type: String,
      trim: true,
    },
    eApeM: {
      type: String,
      trim: true,
    },
    eRol: {
      type: String,
      trim: true,
    },

    eEdad: {
      type: Number,
      trim: true,
    },
    eNumero: {
      type: Number,
      trim: true,
    },
    eCorreo: {
      type: String,
      unique: true,
      trim: true,
    },

    auSede: {
      type: String,
      default: "N/A",
      trim: true,
    },
    uArea: {
      type: String,
      default: "N/A",
      trim: true,
    },
    uTurno: {
      type: String,
      default: "N/A",
      trim: true,
    },
    pwd: {
      type: String,
      default: "N/A",
      trim: true,
    },
  },
  {
    timestamps: true /* Lo que hace es que agrega el campo de fecha de creacion y actualizacion */,
    versionKey: false,
  }
);
export default models.Usrs || model("Usrs", usrsSchema);
