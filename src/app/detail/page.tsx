"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import sumBy from "lodash/sumBy";
import dayjs from "dayjs";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Stack,
  Box,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Pencil } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { reActivateOrder } from "../features/order/api/re-activate";
import { send } from "../features/order/api/send";
import { Order } from "@/types/order";
import { formatearDinero } from "@/utils/func";
import { useOrder } from "../context/OrderContext";
import { enqueueSnackbar } from "notistack";
import { defaultColor } from "@/utils/constants";
import OrderFowmDrawer from "../components/forms/Order";
import { useActiveOrders } from "../../hooks/useOrders";

const Home = () => {
  const router = useRouter();
  const [orderOpen, setOrderOpen] = useState(false);
  const [order, setSelectedOrder] = useState<Order | null>(null);
  const { setOrder } = useOrder();

  const { data, fetchNextPage, hasNextPage, isLoading } = useActiveOrders();

  const { ref: sentinelRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const handleToggleOrder = () => setOrderOpen((prev) => !prev);

  const handleEditOrder = async (updateData: {
    _id: string;
    waiter: string;
    table: string;
    notes: string;
    guests: number;
  }) => {
    await send(updateData._id, {
      name: updateData.waiter,
      table: updateData.table,
      notes: updateData.notes,
      guests: updateData.guests,
    });
  };

  const handleReactivate = async (orderId: string) => {
    const response = await reActivateOrder(orderId);
    if (response) {
      enqueueSnackbar(
        response.success ? "Orden Reactivada" : response.message,
        {
          variant: response.success ? "success" : "warning",
        }
      );
    }
  };

  const OrderCard = ({ item }: { item: Order }) => (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 3,
        width: "90%",
        textAlign: "start",
        maxHeight: "50vh",
        overflowY: "auto",
      }}
    >
      <Stack spacing={0.5}>
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Chip
            label={item.active ? "Abierta" : "Cerrada"}
            size="small"
            sx={{
              fontWeight: "bold",
              borderRadius: "12px",
              backgroundColor: item.active
                ? "rgb(61,162,44)"
                : "rgb(209,15,23)",
              color: "#fff",
              minWidth: 100,
            }}
            onClick={() => !item.active && handleReactivate(item._id || "")}
          />
          <IconButton
            sx={{ ml: 2, mt: -1 }}
            onClick={() => {
              setSelectedOrder(item);
              setOrderOpen(true);
            }}
          >
            <Pencil style={{ color: "#242424" }} />
          </IconButton>
        </Box>

        <Typography fontWeight="bold" fontSize={16}>
          {`No. M${item.table}-${(item._id || "").slice(-4).toUpperCase()}`}
        </Typography>
        <Typography fontWeight="bold" fontSize={16}>
          Mesa: {item?.table}
        </Typography>
        <Typography variant="body2">
          Atiende: <strong>{item?.name}</strong>
        </Typography>
        <Typography variant="body2">
          Fecha:{" "}
          {(item?.createdAt &&
            dayjs(item.createdAt).format("DD - MMM - YYYY")) ||
            ""}
        </Typography>
        <Typography variant="body2">
          Hora:{" "}
          {(item?.createdAt && dayjs(item.createdAt).format("hh:mm A")) || ""}
        </Typography>
        <Typography variant="body2">Notas: {item?.notes || ""}</Typography>
        <Typography variant="body2">
          Número de Personas: {item?.guests || "1"}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">
            Total artículos: {item.elements?.length}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Total: {formatearDinero(sumBy(item.elements, "price"))}
          </Typography>
        </Box>

        <Stack spacing={1.2} mt={2}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 999,
              fontWeight: "bold",
              borderColor: "rgb(209,15,23)",
              color: "rgb(209,15,23)",
            }}
            onClick={() => {
              setOrder({ id: item._id, ...item });
              router.push("/summary");
            }}
          >
            Ver detalle
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 999,
              fontWeight: "bold",
              backgroundColor: "rgb(209,15,23)",
            }}
            disabled={!item.active}
            onClick={() => {
              setOrder({ id: item._id, ...item });
              router.push("/menu");
            }}
          >
            Agregar artículos
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <>
      <Grid
        container
        spacing={5}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "70vh", position: "relative" }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress style={{ color: defaultColor }} />
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ minHeight: "60vh", maxHeight: "70vh", overflowY: "auto" }}
          >
            {data?.pages
              .flatMap((page) => page.result)
              .sort((a, b) => {
                if (a.active !== b.active) return a.active ? -1 : 1;
                return (
                  new Date(b.createdAt || "").getTime() -
                  new Date(a.createdAt || "").getTime()
                );
              })
              .map((order) => (
                <OrderCard key={order._id} item={order} />
              ))}

            {hasNextPage && (
              <Grid size={{ xs: 12 }} ref={sentinelRef}>
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress style={{ color: defaultColor }} />
                </Box>
              </Grid>
            )}
          </Grid>
        )}

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
            onClick={() => router.push("/")}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>

      <OrderFowmDrawer
        open={orderOpen}
        onClose={handleToggleOrder}
        onSubmit={handleEditOrder}
        initialData={order}
      />
    </>
  );
};

export default Home;
