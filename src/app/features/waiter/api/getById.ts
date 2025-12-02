import axios from "axios";
import { Waiter } from "@/types/waiter";

export const getWaiter = (
  id: string
): Promise<{ success: boolean; result: Waiter }> => {
  return axios({
    url: `/api/waiters/${id}`,
    method: "GET",
  }).then((r) => r.data);
};
