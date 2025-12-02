"use client";

import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { omit } from "lodash";
import { Grid, Box, Paper, Typography } from "@mui/material";
import { Waiter } from "@/types/waiter";
import { getWaiters } from "@/app/features/waiter/api/get";
import WaiterFormDrawer from "@/app/components/forms/Waiter";
import { create } from "@/app/features/waiter/api/create";
import { update } from "@/app/features/waiter/api/update";
import { deleteWaiter } from "@/app/features/waiter/api/delete";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Waiter | null>(null);

  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const handleGetWaiters = async () => {
    const response = await getWaiters().catch(() => null);
    if (response) {
      setWaiters(response.result);
    }
  };

  useEffect(() => {
    handleGetWaiters();
  }, []);

  const handleCreateOrUpdate = async (values: Partial<Waiter>) => {
    if (!selected) {
      await create(values);
      enqueueSnackbar("Mesero creado", { variant: "success" });
    } else {
      const response = await update(
        values._id || "",
        omit(values, ["_id"])
      ).catch(() => null);
      if (response) {
        enqueueSnackbar("Mesero actualizado", { variant: "success" });
      } else {
        return enqueueSnackbar(
          "No se ha actualizado el mesero, cuenta con ordenes activas",
          { variant: "error" }
        );
      }
    }
    handleGetWaiters();
  };

  const handleRemove = async (id: string) => {
    const response = await deleteWaiter(id).catch(() => null);
    if (response) {
      enqueueSnackbar("Mesero eliminado", { variant: "success" });
      handleGetWaiters();
    } else {
      enqueueSnackbar(
        "No se ha eliminado el mesero, cuenta con ordenes activas",
        { variant: "error" }
      );
    }
  };

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="start"
      alignItems="start"
      sx={{ minHeight: "70vh", position: "relative", mt: 4 }}
    >
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
        <Grid size={{ xs: 6 }} key="add">
          <Box width="100%" sx={{ minHeight: 40 }}>
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
              onClick={() => setOpen(true)}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: "#fff" }}
              >
                Agregar Nuevo Mesero
              </Typography>
            </Paper>
          </Box>
        </Grid>
        {waiters.map((waiter) => {
          return (
            <Grid size={{ xs: 6 }} key={waiter._id}>
              <Box width="100%" sx={{ minHeight: 40 }}>
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
                    setOpen(true);
                    setSelected(waiter);
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
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <WaiterFormDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selected}
        onRemove={handleRemove}
      />
    </Grid>
  );
}
