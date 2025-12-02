/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import dayjs from "dayjs";

const { DEFAULT_DB } = process.env;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DEFAULT_DB || "dev-japymenu");
    const orderCollection = db.collection("orders");
    const paymentCollection = db.collection("payments");

    const orders = await orderCollection.find({}).toArray();
    const payments = await paymentCollection
      .find({
        order: {
          $in: orders.map((o) => o._id),
        },
      })
      .toArray();

    const reportData = orders.map((order) => {
      const orderPayments = payments.filter(
        (p) => String(p.order) === String(order._id)
      );

      let subtotalEfectivo = 0;
      let subtotalTarjeta = 0;
      let tipEfectivo = 0;
      let tipTarjeta = 0;
      let totalEfectivo = 0;
      let totalTarjeta = 0;

      for (const payment of orderPayments) {
        const subtotal = payment.total - payment.tip;

        if (payment.type === "efectivo") {
          subtotalEfectivo += subtotal;
          tipEfectivo += payment.tip;
          totalEfectivo += payment.total;
        } else if (payment.type === "tarjeta") {
          subtotalTarjeta += subtotal;
          tipTarjeta += payment.tip;
          totalTarjeta += payment.total;
        }
      }

      return {
        number: `M${order.table}-${String(order._id || "")
          .slice(-4)
          .toUpperCase()}`,
        waiter: order.name,
        table: order.table,
        startedAt: dayjs(order.createdAt).format("DD MMMM, YYYY hh:mm A"),
        finishedAt: dayjs(order.finishedAt).format("DD MMMM, YYYY hh:mm A"),
        payments: orderPayments.length,
        elements: order.elements?.length || 0,
        cashSubtotal: subtotalEfectivo,
        cardSubtotal: subtotalTarjeta,
        tipCash: tipEfectivo,
        tipCard: tipTarjeta,
        cashTotal: totalEfectivo,
        cardTotal: totalTarjeta,
      };
    });

    const headers = [
      { key: "startedAt", title: "Fecha y hora inicio" },
      { key: "finishedAt", title: "Fecha y hora fin" },
      { key: "number", title: "Orden" },
      { key: "waiter", title: "Mesero" },
      { key: "table", title: "Mesa" },
      { key: "payments", title: "Total cuentas" },
      { key: "elements", title: "Total artículos" },
      { key: "cashSubtotal", title: "Subtotal efectivo" },
      { key: "cardSubtotal", title: "Subtotal tarjeta" },
      { key: "tipCash", title: "Propinas efectivo" },
      { key: "tipCard", title: "Propinas tarjeta" },
      { key: "cashTotal", title: "Total efectivo" },
      { key: "cardTotal", title: "Total tarjeta" },
    ];

    const csvRows = [
      headers.map((h) => h.title).join(","),
      ...reportData.map((row) =>
        headers.map((h) => `"${(row as any)[h.key] ?? ""}"`).join(",")
      ),
    ];

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="reporte.csv"`,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
