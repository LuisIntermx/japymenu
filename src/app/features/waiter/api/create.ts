import axios from "axios";
import { Waiter } from "@/types/waiter";

export const create = (
  data: Partial<Waiter>
): Promise<{ success: boolean; result: string }> => {
  return axios({
    url: "/api/waiters",
    method: "POST",
    data,
  }).then((r) => r.data);
};
