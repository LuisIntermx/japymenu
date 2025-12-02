import axios from "axios";
import { Order } from "@/types/order";
import { Payment } from "@/types/payments";

type Params = {
  order: Order;
  payments: Payment[];
};

export const printByOrder = async ({ order, payments }: Params) => {
  const response = await axios.get("/api/print").then((r) => r.data);

  axios.post(
    `${response?.url}/print/payments`,
    {
      table: order?.table,
      number: `M${order.table}-${String(order._id || "")
        .slice(-4)
        .toUpperCase()}`,
      payments,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};
