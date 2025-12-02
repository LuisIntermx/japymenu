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
    const { menuItem } = await request.json();

    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("orders");

    const order = await collection.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { elements: menuItem },
      }
    );

    // if (updatedOrder.modifiedCount === 0) {
    //   return NextResponse.json(
    //     { success: false, message: "Failed to update order" },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      message: "Menu item added to order",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
