import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
const { DEFAULT_DB } = process.env;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("orders");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      active: true,
      sended: false,
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB);
    const collection = db.collection("orders");

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const result = await collection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
