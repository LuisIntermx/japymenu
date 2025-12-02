"use client";

import { useRouter, useParams } from "next/navigation";
import {
  Grid,
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Menu } from "@/types/menu";
import { useOrder } from "@/app/context/OrderContext";
import { formatearDinero } from "@/utils/func";
import { defaultColor } from "@/utils/constants";
import { useMenuItem } from "@/hooks/useMenuElement";

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const { order, setOrder } = useOrder();

  if (!id) {
    router.push("/menu");
  }

  if (!order.id) {
    router.push("/");
  }

  const { data: element } = useMenuItem(String(id));

  const handleAddItem = async () => {
    const items: Menu[] = order?.elements || [];
    if (element) {
      setOrder({
        ...order,
        elements: [...items, { ...element, notes, recentlyAdded: true }],
      });
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
      {element ? (
        <Grid container size={{ xs: 12 }}>
          <Paper
            elevation={2}
            sx={{ p: 2, borderRadius: 3, minWidth: "100%", textAlign: "start" }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {element?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cantidad:{" "}
              <span style={{ fontWeight: 500 }}>{element?.quantity}</span>
            </Typography>
            <Typography variant="h6" color="error" sx={{ mt: 1 }}>
              {formatearDinero(element?.price)}
            </Typography>

            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Notas:
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Escribe tus notas..."
                variant="outlined"
                InputProps={{
                  sx: {
                    backgroundColor: "#fafafa",
                    borderRadius: 2,
                  },
                }}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
          </Paper>
        </Grid>
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress style={{ color: defaultColor }} />
        </Box>
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
          onClick={handleAddItem}
        >
          Agregar
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            borderColor: "1px solid rgb(209,15,23)",
            backgroundColor: "#fff",
            color: "rgb(209,15,23)",
            borderRadius: 20,
            padding: 2,
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "none",
          }}
          onClick={() => router.push("/menu")}
        >
          Cancelar
        </Button>
      </Grid>
    </Grid>
  );
};

export default Page;
