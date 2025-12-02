import axios from "axios";

export const countOrders = (): Promise<{
  success: boolean;
  result: number;
}> => {
  return axios({
    url: "/api/orders/count",
    method: "GET",
  }).then((r) => r.data);
};
