import { Order } from "@/types/order";
import axios from "axios";

export const bill = async (order: Order) => {
  const response = await axios.get("/api/print").then((r) => r.data);
  return axios.post(
    `${response.url}/print/bill`,
    {
      id: order._id,
      table: order?.table,
      mesero: order.name,
      notes: order.notes,
      number: `M${order.table}-${String(order._id || "")
        .slice(-4)
        .toUpperCase()}`,
      elements: order?.elements || [],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};
