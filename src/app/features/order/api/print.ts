import { Menu } from "@/types/menu";
import axios from "axios";
import { Order } from "@/types/order";

export const printOrder = async (
  order: Order,
  elements: Menu[]
): Promise<{ success: boolean; id: string }> => {
  const response = await axios.get("/api/print").then((r) => r.data);

  // return axios({
  //   url: `/api/orders/print/${order.id}`,
  //   data: { elements },
  //   method: "POST",
  // }).then((r) => r.data);
  const url = order.active
    ? `${response?.url}/print`
    : `${response?.url}/print/bill`;
  return axios.post(
    url,
    {
      table: order?.table,
      number: `M${order.table}-${String(order.id || "")
        .slice(-4)
        .toUpperCase()}`,
      elements,
      id: order._id,
      mesero: order.name,
      notes: order.notes,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};
