import axios from "axios";
import { Waiter } from "@/types/waiter";

export const update = (
  id: string,
  data: Partial<Waiter>
): Promise<{ success: boolean; result: string }> => {
  return axios({
    url: `/api/waiters/${id}`,
    method: "PUT",
    data,
  }).then((r) => r.data);
};
