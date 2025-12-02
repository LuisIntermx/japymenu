import { sumBy } from "lodash";

import { Grid, Typography, Paper, Box, CircularProgress } from "@mui/material";
import { defaultColor } from "@/utils/constants";
import { useOrder } from "@/app/context/OrderContext";
import { formatearDinero } from "@/utils/func";
import { Payment } from "@/types/payments";

type Props = {
  payments: Payment[];
  loading: boolean;
};

export default function Summary({ payments, loading }: Props) {
  const { order } = useOrder();

  const partialPayment = sumBy(payments, "amount");

  return (
    <Grid size={{ xs: 12 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 5 }} sx={{ textAlign: "start" }}>
            <Typography
              sx={{ color: defaultColor, fontWeight: "bold", fontSize: 20 }}
            >
              Total:
            </Typography>
            <Typography sx={{ color: "#000", fontSize: 12 }}>
              Comida:{" "}
              {order.elements?.filter((o) => o.type === "Comida").length}{" "}
              artículo(s)
            </Typography>
            <Typography sx={{ color: "#000", fontSize: 12 }}>
              Bebidas:{" "}
              {order.elements?.filter((o) => o.type === "Bebida").length}{" "}
              bebída(s)
            </Typography>
          </Grid>
          <Grid size={{ xs: 7 }} sx={{ textAlign: "end" }}>
            {loading ? (
              <Box display="end">
                <CircularProgress
                  style={{ color: defaultColor, justifyContent: "center" }}
                />
              </Box>
            ) : (
              <>
                <Typography sx={{ color: "#000", fontSize: 16 }}>
                  Total: {formatearDinero(sumBy(order.elements, "price"))}
                </Typography>
                <Typography sx={{ color: "#000", fontSize: 16 }}>
                  Pago parcial: {formatearDinero(partialPayment)}
                </Typography>
                <Typography
                  sx={{ color: defaultColor, fontWeight: "bold", fontSize: 16 }}
                >
                  Pago pendiente:{" "}
                  {formatearDinero(
                    sumBy(order.elements, "price") - partialPayment
                  )}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
