import axios from "axios";
import { CreationData } from "@/types/order";

export const createOrder = (
  data: CreationData
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: "/api/orders",
    method: "POST",
    data: data,
  }).then((r) => r.data);
};
