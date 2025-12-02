import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
const { DEFAULT_DB } = process.env;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("payments");
    const orderCollection = db.collection("orders");

    const pending = Number(body.total) - Number(body.amount);
    await collection.insertOne({
      order: new ObjectId(id),
      amount: Number(body.amount),
      tip: Number(body.tip),
      total: Number(body.total),
      pending,
      type: body.paymentMethod,
      paidAt: new Date(),
    });

    if (pending === 0) {
      await orderCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            active: false,
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
