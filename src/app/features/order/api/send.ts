import axios from "axios";
import { Order } from "@/types/order";
import omit from "lodash/omit";

export const send = (
  id: string,
  order: Order
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/${id}`,
    method: "POST",
    data: {
      data: {
        ...order,
        elements: order.elements?.map((item) => omit(item, ["recentlyAdded"])),
      },
    },
  }).then((r) => r.data);
};
