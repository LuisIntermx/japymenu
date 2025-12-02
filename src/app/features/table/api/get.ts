import axios from "axios";
import { Table } from "@/types/table";

export const getTables = (): Promise<{ success: boolean; result: Table[] }> => {
  return axios({
    url: "/api/table",
    method: "GET",
  }).then((r) => r.data);
};
