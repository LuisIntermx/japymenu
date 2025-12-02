import axios from "axios";

export const deleteMenu = (
  id: string
): Promise<{ success: boolean; result: string }> => {
  return axios({
    url: `/api/menu/${id}`,
    method: "DELETE",
  }).then((r) => r.data);
};
