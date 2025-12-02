import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"; // Ajusta la ruta según tengas configurado tu cliente
const { DEFAULT_DB } = process.env;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("orders");

    const order = await collection.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    const orderInSameTable = await collection.findOne({
      table: order.table,
      active: true,
    });

    if (orderInSameTable) {
      return NextResponse.json(
        {
          success: false,
          message: "Mesa ocupada, favor de liberar la mesa primero",
        },
        { status: 504 }
      );
    }

    const updatedOrder = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $unset: {
          finishedAt: "",
        },
        $set: {
          active: true,
        },
      }
    );

    if (updatedOrder.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Ocurrio un error al actualizar la orden" },
        { status: 504 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Orden re-activada",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
