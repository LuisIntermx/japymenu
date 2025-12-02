import axios from "axios";
import { Menu } from "@/types/menu";
import { omit } from "lodash";

export const updateItems = (
  id: string,
  elements: Menu[]
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/items/${id}`,
    method: "PUT",
    data: {
      menuItem: elements.map((e) => omit(e, ["recentlyAdded"])),
    },
  }).then((r) => r.data);
};
