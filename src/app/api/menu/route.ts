import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
const { DEFAULT_DB } = process.env;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("menu");

    const query = type ? { type } : {};
    const result = await collection.find(query).toArray();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("menu");

    const result = await collection.insertOne(body);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
