import axios from "axios";
import { Menu } from "@/types/menu";

export const create = (
  data: Partial<Menu>
): Promise<{ success: boolean; result: string }> => {
  return axios({
    url: "/api/menu",
    method: "POST",
    data,
  }).then((r) => r.data);
};
