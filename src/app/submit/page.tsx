"use client";

import { useRouter } from "next/navigation";
import { Grid, Button, Typography } from "@mui/material";
import { useOrder } from "@/app/context/OrderContext";

const Home = () => {
  const router = useRouter();
  const { order } = useOrder();

  if (!order.id) {
    router.push("/");
  }

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh", textAlign: "center" }}
    >
      <Grid
        container
        spacing={1}
        size={{ xs: 12 }}
        justifyContent="center"
        direction="column"
      >
        <Typography>Orden enviada con éxito</Typography>
        <Typography>Estamos trabajando el pedido</Typography>
        <Typography>No. de Orden</Typography>
        <Typography
          sx={{ color: "rgb(209,15,23)", fontWeight: "bold", fontSize: 18 }}
        >{`M${order.table}-${(order.id || "")
          .slice(-4)
          .toUpperCase()}`}</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
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
  );
};

export default Home;
