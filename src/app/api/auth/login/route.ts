import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
const { DEFAULT_DB } = process.env;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("waiters");

    const waiter = await collection.findOne({
      username,
      active: true
    });

    if (!waiter) {
      return NextResponse.json(
        { success: false, message: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    if (!waiter.password) {
      return NextResponse.json(
        { success: false, message: "Usuario sin contraseña configurada" },
        { status: 401 }
      );
    }

    console.log({
      password,
      waiter
    })

    const isPasswordValid = await compare(password, waiter.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const userResponse = {
      id: waiter._id.toString(),
      username: waiter.username,
      name: waiter.name,
      lastLogin: new Date()
    };

    return NextResponse.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
