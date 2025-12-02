/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import dayjs from "dayjs";
import { groupBy } from "lodash";

const { DEFAULT_DB } = process.env;

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const paymentCollection = db.collection("payments");
    const body = await request.json();
    const payments = await paymentCollection
      .find({
        paidAt: {
          $gte: dayjs(body.startDate).toDate(),
          $lte: dayjs(body.endDate).toDate(),
        },
      })
      .toArray();

    const groupedByPaymentType = groupBy(payments, "type");

    const response = {
      subtotal: {
        card: 0,
        cash: 0,
      },
      tips: {
        card: 0,
        cash: 0,
      },
      total: {
        card: 0,
        cash: 0,
      },
    };

    Object.keys(groupedByPaymentType).forEach((type) => {
      const rows = groupedByPaymentType[type];
      const key = type === "efectivo" ? "cash" : "card";
      rows.forEach((row) => {
        response.subtotal[key] += row.amount;
        response.tips[key] += row.tip;
        response.total[key] += row.tip + row.amount;
      });
    });

    return NextResponse.json(
      { success: true, payments: response, dates: body },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
