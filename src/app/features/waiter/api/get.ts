import axios from "axios";
import { Waiter } from "@/types/waiter";

export const getWaiters = (): Promise<{
  success: boolean;
  result: Waiter[];
}> => {
  return axios({
    url: "/api/waiters",
    method: "GET",
  }).then((r) => r.data);
};
