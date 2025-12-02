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
    const collection = db.collection("menu");

    const result = await collection.findOne({ _id: new ObjectId(id) });

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("menu");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    return NextResponse.json({ success: true, id: result?._id });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const collection = db.collection("menu");

    const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, id: result?._id });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
