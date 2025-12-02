"use client";

import { useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { handleDownload } from "@/app/features/reporter/api/order";
import { handleDownloadClosingReport } from "@/app/features/reporter/api/closing";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { formatearDinero } from "@/utils/func";

export default function Page() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [closingData, setClosingData] = useState<{
    subtotal: {
      card: number;
      cash: number;
    };
    total: {
      card: number;
      cash: number;
    };
    tips: {
      card: number;
      cash: number;
    };
  } | null>(null);

  const handleGetClosingReport = async () => {
    setLoading(true);
    setClosingData(null);
    const response = await handleDownloadClosingReport({
      startDate: startDate!,
      endDate: endDate!,
    });
    if (response && response.success) {
      setClosingData(response.payments);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="start"
      alignItems="start"
      sx={{
        minHeight: "70vh",
        maxHeight: "70vh",
        position: "relative",
        mt: 4,
        overflowY: "auto",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container size={{ xs: 12 }} sx={{ p: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography fontWeight="bold" fontSize={30} sx={{ mb: 2 }}>
                Control de cuentas
              </Typography>
              <Button
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  borderColor: "rgb(209,15,23)",
                  backgroundColor: "rgb(209,15,23)",
                  color: "white",
                  borderRadius: 10,
                  padding: 1,
                  minWidth: 100,
                  fontWeight: "bold",
                  fontSize: "18px",
                  textTransform: "none",
                }}
                onClick={handleDownload}
              >
                Descargar
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography fontWeight="bold" fontSize={30} sx={{ mb: 2 }}>
                Reporte de cierre
              </Typography>
              <Grid size={{ xs: 12 }} sx={{ mb: 2 }}>
                <DateTimePicker
                  label="Selecciona fecha inicio"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ mb: 2 }}>
                <DateTimePicker
                  label="Selecciona fecha fin"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              {closingData && (
                <Grid
                  container
                  size={{ xs: 12 }}
                  sx={{ p: 1, overflowX: "auto", whiteSpace: "nowrap" }}
                  spacing={2}
                >
                  <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: "start" }}>
                      <Grid
                        container
                        size={{ xs: 12 }}
                        spacing={2}
                        sx={{ maxWidth: "100%", overflowX: "auto" }}
                      >
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography
                            sx={{
                              color: "rgb(209,15,23)",
                              fontSize: "28px",
                              fontWeight: "bold",
                            }}
                          >
                            Subtotal
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              wordWrap: "break-word",
                            }}
                          >
                            Pago con tarjeta{" "}
                            {formatearDinero(closingData.subtotal.card)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              wordWrap: "break-word",
                            }}
                          >
                            Pago con efectivo{" "}
                            {formatearDinero(closingData.subtotal.cash)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }} sx={{ alignContent: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "40px",
                              fontWeight: "bold",
                              wordWrap: "break-word",
                            }}
                          >
                            {formatearDinero(
                              Number(
                                (
                                  closingData.subtotal.card +
                                  closingData.subtotal.cash
                                ).toFixed(2)
                              )
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: "start" }}>
                      <Grid
                        container
                        size={{ xs: 12 }}
                        spacing={2}
                        sx={{ maxWidth: "100%", overflowX: "auto" }}
                      >
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography
                            sx={{
                              color: "rgb(209,15,23)",
                              fontSize: "28px",
                              fontWeight: "bold",
                            }}
                          >
                            Propinas
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              wordWrap: "break-word",
                            }}
                          >
                            Pago con tarjeta{" "}
                            {formatearDinero(closingData.tips.card)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              wordWrap: "break-word",
                            }}
                          >
                            Pago con efectivo{" "}
                            {formatearDinero(closingData.tips.cash)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }} sx={{ alignContent: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "40px",
                              fontWeight: "bold",
                              wordWrap: "break-word",
                            }}
                          >
                            {formatearDinero(
                              Number(
                                (
                                  closingData.tips.card + closingData.tips.cash
                                ).toFixed(2)
                              )
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: "start" }}>
                      <Grid
                        container
                        size={{ xs: 12 }}
                        spacing={2}
                        sx={{ maxWidth: "100%", overflowX: "auto" }}
                      >
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography
                            sx={{
                              color: "rgb(209,15,23)",
                              fontSize: "28px",
                              fontWeight: "bold",
                            }}
                          >
                            Total
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              wordWrap: "break-word",
                            }}
                          >
                            Pago con tarjeta{" "}
                            {formatearDinero(closingData.total.card)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              wordWrap: "break-word",
                            }}
                          >
                            Pago con efectivo{" "}
                            {formatearDinero(closingData.total.cash)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }} sx={{ alignContent: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "40px",
                              fontWeight: "bold",
                              wordWrap: "break-word",
                            }}
                          >
                            {formatearDinero(
                              Number(
                                (
                                  closingData.total.card +
                                  closingData.total.cash
                                ).toFixed(2)
                              )
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              <Button
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  borderColor: "rgb(209,15,23)",
                  backgroundColor: "rgb(209,15,23)",
                  color: "white",
                  borderRadius: 10,
                  padding: 1,
                  minWidth: 100,
                  fontWeight: "bold",
                  fontSize: "18px",
                  textTransform: "none",
                }}
                onClick={handleGetClosingReport}
                disabled={loading || !startDate || !endDate}
                loading={loading}
              >
                Consultar Cierre
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
}
