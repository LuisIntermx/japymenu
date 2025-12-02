import axios from "axios";
import { Order } from "@/types/order";

type Params = {
  order: Order;
  tip: number;
  total: number;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  paid: number;
};

export const orderPayment = async ({
  order,
  tip,
  total,
  amount,
  paymentMethod,
  paymentType,
  paid,
}: Params) => {
  const response = await axios.get("/api/print").then((r) => r.data);

  axios.post(
    `${response?.url}/print/partial`,
    {
      table: order?.table,
      number: `M${order.table}-${String(order._id || "")
        .slice(-4)
        .toUpperCase()}`,
      total,
      tip,
      amount,
      paid,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  return axios({
    url: `/api/payment/order/${order._id}/pay`,
    method: "POST",
    data: {
      tip,
      total,
      amount,
      paymentMethod,
      paymentType,
    },
  }).then((r) => r.data);
};
