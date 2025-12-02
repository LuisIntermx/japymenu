import axios from "axios";
import { Menu } from "@/types/menu";

export const getMenu = (): Promise<Menu[]> => {
  return axios({
    url: "/api/menu",
    method: "GET",
  }).then((r) => r.data.result);
};
