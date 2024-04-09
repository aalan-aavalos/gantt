const { NextResponse } = require("next/server");
import Actividades from "@/models/actividades";
import { connectDB } from "@/utils/mongoose";

export async function GET() {
  connectDB();
  const actividad = await Actividades.aggregate([
    {
      $facet: {
        documentosConValores: [
          {
            $match: {
              $or: [
                { $expr: { $gt: [{ $size: "$Administradores" }, 0] } },
                { $expr: { $gt: [{ $size: "$Empleados" }, 0] } },
                { $expr: { $gt: [{ $size: "$eCorreo" }, 0] } },
              ],
            },
          },
          {
            $unwind: "$eCorreo",
          },
        ],
        documentosSinValores: [
          {
            $match: {
              $and: [
                { Administradores: { $size: 0 } },
                { Empleados: { $size: 0 } },
                { eCorreo: { $size: 0 } },
              ],
            },
          },
        ],
      },
    },
    {
      $project: {
        todosLosDocumentos: {
          $concatArrays: ["$documentosConValores", "$documentosSinValores"],
        },
      },
    },
    {
      $unwind: "$todosLosDocumentos",
    },
    {
      $replaceRoot: { newRoot: "$todosLosDocumentos" },
    },
  ]);

  return NextResponse.json(actividad);
}
