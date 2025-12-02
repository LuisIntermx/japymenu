import axios from "axios";
import { Menu } from "@/types/menu";

export const getMenuItem = (
  id: string
): Promise<Menu> => {
  return axios({
    url: `/api/menu/${id}`,
    method: "GET",
  }).then((r) => r.data.result);
};
