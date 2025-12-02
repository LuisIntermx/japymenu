"use client";

import { useState, useEffect } from "react";
import { sumBy } from "lodash";
import { useRouter, useParams } from "next/navigation";
import Summary from "@/app/features/payment/components/Summary";
import { defaultColor } from "@/utils/constants";
import { PaymentMethod } from "@/types/payments";
import { Add, KeyboardReturn, Print } from "@mui/icons-material";

import {
  Grid,
  Button,
  Paper,
  Typography,
  Stack,
  Box,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { formatearDinero } from "@/utils/func";
import { useOrder } from "@/app/context/OrderContext";
import { Payment } from "@/types/payments";
import { getPaymentsByOrder } from "@/app/features/payment/api/getByOrder";
import { printByOrder } from "@/app/features/payment/api/printByOrder";
import { orderPayment } from "@/app/features/payment/api/pay";
import { enqueueSnackbar } from "notistack";
import { finishOrder } from "@/app/features/order/api/finish";

export default function Page() {
  const { id } = useParams();
  const [paying, setPaying] = useState(false);
  const router = useRouter();

  const { order } = useOrder();
  const [tip, setTip] = useState<number>(0);
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [tipSelected, setTipSelected] = useState("0");
  const [paymentType, setPaymentType] = useState("total");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [splitQuantity, setSplitQuantity] = useState(0);
  const [currentPayment, setCurrentPayment] = useState(0);

  const total = sumBy(order.elements, "price") - sumBy(payments, "amount");

  const handleGetPayments = async () => {
    const response = await getPaymentsByOrder(String(id)).catch(() => ({
      payments: [],
    }));
    setLoading(false);
    setPayments(response.payments);
    setPaying(false);
  };

  useEffect(() => {
    if (id) {
      handleGetPayments();
    }
  }, [id]);

  const reset = () => {
    setTip(0);
    setPartialAmount(0);
    setTipSelected("0");
  };

  const handleFinish = async () => {
    await finishOrder(String(id), order);
    setPaying(false);
    router.push("/");
  };

  const handlePayOrder = async () => {
    setPaying(true);
    await orderPayment({
      order,
      tip,
      paymentMethod,
      total: sumBy(order.elements, "price"),
      paymentType,
      amount: partialAmount || total,
      paid: total,
    });
    if (splitQuantity) {
      setCurrentPayment((p) => (p += 1));
    } else {
      reset();
    }
    enqueueSnackbar("Pago Registrado", { variant: "success" });
    if (paymentType === "total") {
      handleFinish();
    } else {
      handleGetPayments();
    }
  };

  useEffect(() => {
    if (total === 0) {
      handleFinish();
    }
  }, [total]);

  useEffect(() => {
    if (splitQuantity) {
      setPartialAmount(total / splitQuantity);
    }
  }, [splitQuantity]);

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid size={{ xs: 12 }}>
        <Summary payments={payments} loading={loading} />
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{ maxHeight: "45vh", minHeight: "45vh", overflowY: "auto" }}
      >
        <Grid container size={{ xs: 12 }} spacing={2} sx={{ padding: 2 }}>
          <Grid size={{ xs: 6 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 10,
                backgroundColor:
                  paymentType === "split" ? defaultColor : "rgb(244,244,245)",
                color: paymentType === "split" ? "#fff" : "#000",
                textTransform: "none",
              }}
              onClick={() =>
                setPaymentType(paymentType === "split" ? "total" : "split")
              }
            >
              Dividir Cuenta
            </Button>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 10,
                backgroundColor:
                  paymentType === "partial" ? defaultColor : "rgb(244,244,245)",
                color: paymentType === "partial" ? "#fff" : "#000",
                textTransform: "none",
              }}
              onClick={() => {
                setPaymentType(paymentType === "partial" ? "total" : "partial");
              }}
            >
              Pagar Parcialidad
            </Button>
          </Grid>
        </Grid>
        {(paymentType === "partial" && (
          <Grid size={{ xs: 12 }} sx={{ textAlign: "left", mt: 2, mb: 2 }}>
            <Paper elevation={2}>
              <Grid container direction="row">
                <Grid size={{ xs: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: defaultColor, fontWeight: "bold", padding: 2 }}
                  >
                    Parcialidad:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Coloca el monto"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        fontSize: "18px",
                        color: "black",
                      },
                    }}
                    size="small"
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                        border: "none",
                        boxShadow: 0,
                      },
                    }}
                    type="number"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= total) {
                        setPartialAmount(value);
                      }
                    }}
                    value={partialAmount}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )) ||
          null}
        {(paymentType === "split" && (
          <Grid size={{ xs: 12 }} sx={{ textAlign: "left", mt: 2, mb: 2 }}>
            <Paper elevation={2}>
              <Grid container direction="row">
                <Grid size={{ xs: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: defaultColor, fontWeight: "bold", padding: 2 }}
                  >
                    Dividir cuentas:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Coloca el número de personas"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        fontSize: "18px",
                        color: "black",
                      },
                    }}
                    size="small"
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                        border: "none",
                        boxShadow: 0,
                      },
                    }}
                    type="number"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setSplitQuantity(value);
                    }}
                    value={splitQuantity}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )) ||
          null}

        {(paymentType === "split" && splitQuantity && (
          <Grid size={{ xs: 12 }} sx={{ textAlign: "left", mt: 2, mb: 2 }}>
            <Paper elevation={2}>
              <Grid container direction="row">
                <Grid size={{ xs: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: defaultColor, fontWeight: "bold", padding: 2 }}
                  >
                    {`Persona ${
                      currentPayment + 1 > splitQuantity
                        ? splitQuantity
                        : currentPayment + 1
                    } de ${splitQuantity}:`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", padding: 2 }}
                  >
                    {formatearDinero(
                      sumBy(order.elements, "price") / splitQuantity
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )) ||
          null}

        <Grid size={{ xs: 12 }} sx={{ textAlign: "left" }}>
          <Paper elevation={2}>
            <Typography
              variant="h6"
              sx={{ color: defaultColor, fontWeight: "bold", padding: 2 }}
            >
              Forma de Pago:
            </Typography>
            <Grid container size={{ xs: 12 }} spacing={2} sx={{ padding: 2 }}>
              <Grid size={{ xs: 6 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 10,
                    backgroundColor:
                      paymentMethod === "tarjeta"
                        ? defaultColor
                        : "rgb(244,244,245)",
                    color: paymentMethod === "tarjeta" ? "#fff" : "#000",
                    textTransform: "none",
                  }}
                  onClick={() => setPaymentMethod("tarjeta")}
                >
                  Tarjeta
                </Button>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 10,
                    backgroundColor:
                      paymentMethod === "efectivo"
                        ? defaultColor
                        : "rgb(244,244,245)",
                    color: paymentMethod === "efectivo" ? "#fff" : "#000",
                    textTransform: "none",
                  }}
                  onClick={() => setPaymentMethod("efectivo")}
                >
                  Efectivo
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ mt: 2, textAlign: "start" }}>
          <Paper elevation={2}>
            <Typography
              variant="h6"
              sx={{ color: defaultColor, fontWeight: "bold", p: 2 }}
            >
              Propina:
            </Typography>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid
                container
                spacing={2}
                justifyContent="flex-start"
                alignContent="space-around"
                size={{ xs: 8 }}
              >
                <Grid size={{ xs: 4 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: 50,
                      backgroundColor:
                        tipSelected === "5" ? defaultColor : "rgb(244,244,245)",
                      color: tipSelected === "5" ? "#fff" : "#000",
                    }}
                    onClick={() => {
                      const price = partialAmount || total;
                      setTip(price * 0.05);
                      setTipSelected("5");
                    }}
                  >
                    5%
                  </Button>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: 50,
                      backgroundColor:
                        tipSelected === "10"
                          ? defaultColor
                          : "rgb(244,244,245)",
                      color: tipSelected === "10" ? "#fff" : "#000",
                    }}
                    onClick={() => {
                      const price = partialAmount || total;
                      setTip(price * 0.1);
                      setTipSelected("10");
                    }}
                  >
                    10%
                  </Button>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: 50,
                      backgroundColor:
                        tipSelected === "15"
                          ? defaultColor
                          : "rgb(244,244,245)",
                      color: tipSelected === "15" ? "#fff" : "#000",
                    }}
                    onClick={() => {
                      const price = partialAmount || total;
                      setTip(price * 0.15);
                      setTipSelected("15");
                    }}
                  >
                    15%
                  </Button>
                </Grid>
              </Grid>

              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Otro"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 5,
                      boxShadow: 2,
                    },
                  }}
                  type="number"
                  onChange={(e) => {
                    setTipSelected("0");
                    setTip(Number(e.target.value));
                  }}
                  value={tip}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      endAdornment: (
                        <span style={{ fontSize: "10px" }}>
                          {(tip && `(${((tip * 100) / total).toFixed(2)}%)`) ||
                            ""}
                        </span>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight={500}>
                  Sub Total:
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {formatearDinero(partialAmount || total)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Propina</Typography>
                <Typography variant="h6">{formatearDinero(tip)}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <Typography variant="h6">
                  Total:{" "}
                  <span style={{ fontWeight: "bold " }}>
                    {formatearDinero((partialAmount || total) + tip)}
                  </span>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Grid
        size={{ xs: 12 }}
        spacing={2}
        sx={{
          mt: 4,
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
          width: "100%",
          pt: 2,
        }}
      >
        <Grid
          container
          size={{ xs: 12 }}
          direction="row"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Grid size={{ xs: 2 }} sx={{ textAlign: "start" }}>
            <IconButton
              size="large"
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                borderColor: defaultColor,
                backgroundColor: defaultColor,
                color: "white",
              }}
              onClick={() => {
                return router.push("/summary");
              }}
            >
              <KeyboardReturn />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 2 }} sx={{ textAlign: "start" }}>
            <IconButton
              color="error"
              size="large"
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                borderColor: defaultColor,
                backgroundColor: defaultColor,
                color: "white",
              }}
              onClick={() => router.push("/menu")}
              disabled
            >
              <Add />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 2 }} sx={{ textAlign: "start" }}>
            <IconButton
              size="large"
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                borderColor: defaultColor,
                backgroundColor: defaultColor,
                color: "white",
              }}
              onClick={() => printByOrder({ order, payments })}
              disabled={!payments.length}
            >
              <Print />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: "start" }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                borderColor: defaultColor,
                backgroundColor: defaultColor,
                color: "white",
                borderRadius: 10,
                padding: 1,
                minWidth: 100,
                fontWeight: "bold",
                fontSize: "18px",
                textTransform: "none",
              }}
              disabled={!order.active || paying}
              loading={paying}
              onClick={handlePayOrder}
            >
              Enviar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
