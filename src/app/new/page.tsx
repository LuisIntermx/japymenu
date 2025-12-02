"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  Badge,
  Box,
} from "@mui/material";
import { useOrder } from "@/app/context/OrderContext";
import { getTables } from "@/app/features/table/api/get";
import { Table } from "@/types/table";
import { createOrder } from "@/app/features/order/api/create";
import { Order } from "@/types/order";
import { getActiveOrders } from "../features/order/api/list";
import { getWaiters } from "../features/waiter/api/get";
import { Waiter } from "@/types/waiter";

const Home = () => {
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);

  const handleGetActiveOrders = async () => {
    const response = await getActiveOrders().catch(() => null);
    if (response) {
      setOrders(response.result);
    }
  };

  useEffect(() => {}, []);

  const handleGetTables = async () => {
    const response = await getTables().catch(() => null);
    if (response) {
      setTables(response.result);
    }
  };

  const handleGetWaiters = async () => {
    const response = await getWaiters().catch(() => null);
    if (response) {
      setWaiters(response.result);
    }
  };

  useEffect(() => {
    handleGetTables();
    handleGetActiveOrders();
    handleGetWaiters();
  }, []);

  const handleCreateOrder = async () => {
    if (!order.name || !order.table) {
      enqueueSnackbar("No se ha seleccionado una mesa", { variant: "error" });
    } else {
      const response = await createOrder({
        name: order.name,
        table: order.table,
        notes: order.notes,
        guests: order.guests || 1,
      });

      setOrder({ ...order, id: response.id, active: true });
      router.push("/menu");
    }
  };

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh", position: "relative" }}
    >
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {(!order.name && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" fontWeight="bold">
                ¿Quién levanta la orden?
              </Typography>
            </Grid>
            <Grid
              container
              sx={{
                maxHeight: "50vh",
                minHeight: "50vh",
                overflowY: "auto",
                p: 2,
              }}
              spacing={4}
              size={{ xs: 12 }}
              alignContent="center"
            >
              {waiters.map((waiter) => {
                const ownOrders = orders.filter(
                  (o) => o.name === waiter.name && o.active
                );
                return (
                  <Grid size={{ xs: 6 }} key={waiter._id}>
                    <Box width="100%" sx={{ minHeight: 40 }}>
                      <Badge
                        badgeContent={ownOrders.length}
                        sx={{
                          width: "100%",
                          "& .MuiBadge-badge": {
                            backgroundColor: "rgb(209,15,23)",
                            color: "white",
                            fontWeight: "bold",
                          },
                        }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            width: "100%",
                            minHeight: 100,
                            maxHeight: 100,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: "rgb(209,15,23)",
                            p: 1,
                            borderRadius: 2,
                          }}
                          onClick={() => {
                            setOrder({ ...order, name: waiter.name });
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: "#fff" }}
                          >
                            {waiter.name}
                          </Typography>
                        </Paper>
                      </Badge>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )) ||
          null}
        {(order.name && !order.table && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" fontWeight="bold">
                Selecciona la mesa
              </Typography>
            </Grid>
            <Grid
              container
              sx={{
                maxHeight: "50vh",
                minHeight: "50vh",
                overflowY: "auto",
                p: 2,
              }}
              spacing={4}
            >
              {tables
                .sort((a, b) => {
                  if (a.number.toLowerCase() === "barra") return -1;
                  if (b.number.toLowerCase() === "barra") return 1;
                  return Number(a.number) - Number(b.number);
                })
                .map((table) => (
                  <Grid
                    size={{
                      xs: table.number.toLowerCase() === "barra" ? 12 : 6,
                    }}
                    key={table.number}
                    sx={{ minHeight: 100 }}
                  >
                    <Box width="100%" sx={{ minHeight: 100 }}>
                      <Paper
                        elevation={2}
                        sx={{
                          width: "100%",
                          minHeight: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: "rgb(209,15,23)",
                        }}
                        onClick={() =>
                          setOrder({ ...order, table: table.number })
                        }
                      >
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          sx={{
                            color: "#fff",
                          }}
                        >
                          {table.number}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </>
        )) ||
          null}
      </Grid>
      <Grid size={{ xs: 12 }}>
        {(order.table && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" fontWeight="bold">
                ¿Comentarios?
              </Typography>
            </Grid>

            <Grid
              container
              sx={{
                p: 2,
              }}
              spacing={4}
            >
              <Grid size={{ xs: 12 }}>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    label="Notas"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: 5, boxShadow: 2 } }}
                    onChange={(e) =>
                      setOrder({ ...order, notes: e.target.value })
                    }
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                Número de Personas
              </Typography>
            </Grid>

            <Grid
              container
              sx={{
                maxHeight: "40vh",
                minHeight: "40vh",
                p: 2,
              }}
              spacing={4}
            >
              <Grid size={{ xs: 12 }}>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    type="number"
                    label="Número de Personas"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: 5, boxShadow: 2 } }}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        guests: e.target.value ? Number(e.target.value) : 1,
                      })
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </>
        )) ||
          null}
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
          width: "100%",
          px: 4,
          pt: 2,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderColor: "rgb(209,15,23)",
            backgroundColor: "rgb(209,15,23)",
            color: "white",
            borderRadius: 20,
            padding: 2,
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "none",
          }}
          onClick={handleCreateOrder}
          disabled={!order.name || !order.table}
        >
          Siguiente
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
