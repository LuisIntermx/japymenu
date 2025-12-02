import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
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

    const result = await collection.findOne({ order: new ObjectId(id) });

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

