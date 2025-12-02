import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"; // Ajusta la ruta según tengas configurado tu cliente
const { DEFAULT_DB } = process.env;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("payments");

    const payments = await collection
      .find({ order: new ObjectId(id) })
      .toArray();

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
