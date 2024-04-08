import { NextResponse } from "next/server";
import Usrs from "@/models/usrs";
import { connectDB } from "@/utils/mongoose";
import bcrypt from "bcryptjs";

// Obtener un usuario
export async function GET(request, { params }) {
  try {
    connectDB();
    const usrFound = await Usrs.findById(params.idU); // Busca por id
    //const usrFound = await Usrs.findOne({ eNombre: params.idU }); // Busca por nombre

    if (!usrFound) {
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(usrFound);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}

// Actualizar usuario
export async function PUT(request, { params }) {
  try {
    connectDB();
    const data = await request.json();

    const passData = await bcrypt.hash(data.pwd, 12);

    data.pwd = passData;
    
    const usrsUpdated = await Usrs.findByIdAndUpdate(params.idU, data, {
      new: true,
    });

    return NextResponse.json(usrsUpdated);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}

// Eliminar usuario
export async function DELETE(request, { params }) {
  try {
    connectDB();
    const usrsDeleted = await Usrs.findByIdAndDelete(params.idU);
    if (!usrsDeleted) {
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(usrsDeleted);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
