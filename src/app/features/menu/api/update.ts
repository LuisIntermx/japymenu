import axios from "axios";
import { Menu } from "@/types/menu";

export const update = (
  id: string,
  data: Partial<Menu>
): Promise<{ success: boolean; result: string }> => {
  return axios({
    url: `/api/menu/${id}`,
    method: "PUT",
    data,
  }).then((r) => r.data);
};
