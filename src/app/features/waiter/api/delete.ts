import axios from "axios";

export const deleteWaiter = (
  id: string
): Promise<{ success: boolean; result: string }> => {
  return axios({
    url: `/api/waiters/${id}`,
    method: "DELETE",
  }).then((r) => r.data);
};
