import { Order } from "@/types/order";
import axios from "axios";

export const getOrder = (
  id: string
): Promise<{
  success: boolean;
  result: Order;
}> => {
  return axios({
    url: `/api/orders/${id}`,
    method: "GET",
  }).then((r) => r.data);
};
