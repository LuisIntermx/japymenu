import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import last from "lodash/last";
const { DEFAULT_DB } = process.env;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const serverCollection = db.collection("printer-server");
    const documentServer = await serverCollection.find({}).toArray();

    return NextResponse.json({
      success: true,
      url: last(documentServer)?.url,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
