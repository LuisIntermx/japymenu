import axios from "axios";
import { Menu } from "@/types/menu";

export const addItem = (
  id: string,
  element: Menu
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/${id}`,
    method: "PUT",
    data: {
      menuItem: element,
    },
  }).then((r) => r.data);
};
