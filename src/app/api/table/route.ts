import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
const { DEFAULT_DB } = process.env;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("table");

    const result = await collection
      .find({
        active: true,
      })
      .toArray();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
