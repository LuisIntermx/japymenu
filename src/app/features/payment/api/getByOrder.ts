import axios from "axios";
import { Payment } from "@/types/payments";

export const getPaymentsByOrder = (
  id: string
): Promise<{ success: boolean; payments: Payment[] }> => {
  return axios({
    url: `/api/payment/order/${id}`,
    method: "GET",
  }).then((r) => r.data);
};
