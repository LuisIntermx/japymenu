'use client';

import { Grid, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh", position: "relative" }}
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
          onClick={() => router.push("/settings/menu")}
        >
          Menu
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
          onClick={() => router.push("/settings/waiters")}
        >
          Meseros
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
          onClick={() => router.push("/settings/reports")}
        >
          Reportes
        </Button>
      </Grid>
    </Grid>
  );
}
