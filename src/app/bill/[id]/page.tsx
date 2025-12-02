"use client";

import { useEffect, useState } from "react";
import groupBy from "lodash/groupBy";
import first from "lodash/first";
import { useParams, useRouter } from "next/navigation";
import { Grid, Button, Typography, IconButton } from "@mui/material";
import { Add, KeyboardReturn, Print, Summarize } from "@mui/icons-material";
import { useOrder } from "@/app/context/OrderContext";
import { defaultColor } from "@/utils/constants";
import OrderItem from "@/app/components/OrderItem";
import { getOrder } from "@/app/features/order/api/get";
import { getPaymentsByOrder } from "@/app/features/payment/api/getByOrder";
import { Payment } from "@/types/payments";
import Summary from "@/app/features/payment/components/Summary";
import { printByOrder } from "@/app/features/payment/api/printByOrder";
import { updateItems } from "@/app/features/order/api/update-items";
import { bill } from "@/app/features/order/api/bill";

const Home = () => {
  const { id } = useParams();
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleGetOrder = async () => {
    const response = await getOrder(String(id)).catch(() => ({ result: {} }));
    setOrder({
      ...response.result,
      id: String(id),
    });
  };

  const handleGetPayments = async () => {
    const response = await getPaymentsByOrder(String(id)).catch(() => ({
      payments: [],
    }));
    setLoading(false);
    setPayments(response.payments);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      handleGetOrder();
      handleGetPayments();
    }
  }, [id]);

  const itemsGrouped = groupBy(
    order.elements?.sort((a, b) => a.name.localeCompare(b.name)),
    "_id"
  );

  const handleAddItem = (itemId: string) => {
    const orderItems = order?.elements || [];
    const item = orderItems?.find((i) => i._id === itemId);
    if (item) {
      orderItems?.push({
        ...item,
        recentlyAdded: true,
      });
      setOrder({
        ...order,
        elements: orderItems,
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const orderItems = order?.elements || [];
    const index = orderItems?.findLastIndex((item) => item._id === itemId);
    if (index !== undefined && index !== -1) {
      orderItems?.splice(index, 1);
      setOrder({
        ...order,
        elements: orderItems,
      });
    }
  };

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="left"
      alignItems="center"
      sx={{ minHeight: "70vh", textAlign: "center" }}
    >
      <Grid
        container
        spacing={1}
        size={{ xs: 12 }}
        justifyContent="left"
        direction="column"
        sx={{
          alignItems: "flex-start",
          textAlign: "left",
          mt: 5,
          minHeight: "50vh",
          maxHeight: "50vh",
          overflowY: "auto",
        }}
      >
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ color: defaultColor, fontWeight: "bold", mb: 2 }}>
            Confirmación de Cuenta:
          </Typography>
          {Object.keys(itemsGrouped).map((id) => {
            const itemsById = itemsGrouped[id];
            const item = first(itemsById);
            return (
              <Grid key={id} size={{ xs: 12 }}>
                <OrderItem
                  key={id}
                  name={item?.name || ""}
                  description={item?.quantity || ""}
                  quantity={
                    order.elements?.filter((i) => i._id === item?._id).length ||
                    0
                  }
                  amount={item?.price || 0}
                  onAdd={() => handleAddItem(id)}
                  onRemove={() => handleDeleteItem(id)}
                  isActive={order.active || false}
                  canEdit
                />
              </Grid>
            );
          })}
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
        <Summary payments={payments} loading={loading} />
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
              disabled={!order.active}
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
              disabled={!payments.length}
              onClick={() => printByOrder({ order, payments })}
            >
              <Print />
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
              onClick={() => bill(order)}
            >
              <Summarize />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 4 }} sx={{ textAlign: "start" }}>
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
              disabled={!order?.elements?.length || !order.active || loading}
              onClick={() => {
                updateItems(String(id), order?.elements || []);
                router.push(`/bill/${id}/pay`);
              }}
            >
              Confirmar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
