import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// import axios from "axios";
const { DEFAULT_DB } = process.env;

export async function POST(
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
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          active: false,
          finishedAt: new Date(),
        },
      }
    );

    if (updatedOrder.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to update order" },
        { status: 400 }
      );
    }

    // if (order) {
    //   axios.post(`${PRINTER_SERVER}/print/bill`, {
    //     table: order?.table,
    //     number: `M${order.table}-${String(order._id || "")
    //       .slice(-4)
    //       .toUpperCase()}`,
    //     elements: order?.elements || [],
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: "Order Finished",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
