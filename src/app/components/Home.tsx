"use client";

import { useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { countOrders } from "@/app/features/order/api/count";
import { useOrder } from "../context/OrderContext";
import Logo from "../assets/japymenu-logo.png";

const Home = () => {
  const router = useRouter();
  const { setOrder } = useOrder();
  const [activeOrders, setActiveOrders] = useState(0);

  const handleGetActiveOrders = async () => {
    const response = await countOrders().catch(() => null);
    if (response) {
      setActiveOrders(response.result);
    }
  };

  useEffect(() => {
    handleGetActiveOrders();
    setOrder({});
  }, []);

  return (
    <Grid
      container
      spacing={4}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh" }}
    >
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
          onClick={() => router.push("/new")}
        >
          Nueva Orden
        </Button>
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
          onClick={() => router.push("/detail")}
        >
          {`Ver Ordenes ${activeOrders ? `(${activeOrders})` : ""}`}
        </Button>
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
          onClick={() => router.push("/settings")}
        >
          Configuración
        </Button>
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{ position: "absolute", bottom: 0, textAlign: "end", mr: 5 }}
      >
        <Image src={Logo} alt="logo" width={60} />
      </Grid>
    </Grid>
  );
};

export default Home;
