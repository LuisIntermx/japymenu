import { Order } from "@/types/order";
import axios from "axios";

export const getActiveOrders = (
  skip: number = 0,
  limit: number = 5
): Promise<{
  success: boolean;
  result: Order[];
}> => {
  return axios({
    url: "/api/orders",
    params: {
      skip,
      limit,
    },
    method: "GET",
  }).then((r) => r.data);
};
