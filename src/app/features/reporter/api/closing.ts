import axios from "axios";
import { Dayjs } from "dayjs";

export const handleDownloadClosingReport = async ({
  startDate,
  endDate,
}: {
  startDate: Dayjs;
  endDate: Dayjs;
}) => {
  return axios
    .post("/api/reporter/closing", { startDate, endDate })
    .then((r) => r.data)
    .catch(() => null);
};
