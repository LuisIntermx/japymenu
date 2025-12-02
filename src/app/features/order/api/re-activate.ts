import axios from "axios";

export const reActivateOrder = (
  id: string
): Promise<{ success: boolean; message: string }> => {
  return axios({
    url: `/api/orders/${id}/activate`,
    method: "PUT",
  })
    .then((r) => r.data)
    .catch((e) => e.response.data);
};
