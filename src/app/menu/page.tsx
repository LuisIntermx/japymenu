"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { useOrder } from "@/app/context/OrderContext";
import { formatearDinero } from "@/utils/func";
import { Menu } from "@/types/menu";
import { defaultColor } from "@/utils/constants";
import { useMenu } from "@/hooks/useMenu";

const Home = () => {
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const router = useRouter();
  const { order } = useOrder();
  const { data: originalMenu, isLoading: loading } = useMenu();

  const [menu, setMenu] = useState<Menu[]>([]);
  const [text, setText] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    false
  );

  useEffect(() => {
    if (originalMenu) {
      setMenu(originalMenu);
    }
  }, [originalMenu]);

  useEffect(() => {
    if (!order.id) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (originalMenu) {
      if (text.trim() !== "") {
        const filtered = originalMenu.filter((m) =>
          m.name.toLowerCase().includes(text.toLowerCase())
        );
        setMenu(filtered);
      } else {
        setMenu(originalMenu);
      }
    }
  }, [text, originalMenu]);

  const groupedByCategory = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menu>);

  const handleAccordionToggle = (category: string) => {
    const isExpanding = expandedCategory !== category;
    setExpandedCategory(isExpanding ? category : false);

    if (isExpanding) {
      setTimeout(() => {
        const el = accordionRefs.current[category];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200); // da tiempo a que el DOM actualice el acordeón
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
      }}
    >
      <Box sx={{ px: 2, mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar elemento en el menú"
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          mt: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress style={{ color: defaultColor }} />
          </Box>
        ) : menu.length === 0 ? (
          <Typography textAlign="center" mt={4}>
            No hay coincidencias.
          </Typography>
        ) : (
          Object.entries(groupedByCategory).map(([category, items]) => (
            <Accordion
              key={category}
              expanded={expandedCategory === category}
              onChange={() => handleAccordionToggle(category)}
              ref={(el: HTMLDivElement | null) => {
                accordionRefs.current[category] = el;
              }}
              sx={{
                mb: 2,
                border: "none",
                boxShadow: "none",
                "&::before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  {category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {items.map((item) => (
                    <Grid size={{ xs: 6 }} key={item._id}>
                      <Card
                        onClick={() => router.push(`/menu/add/${item._id}`)}
                        sx={{
                          borderRadius: 2,
                          boxShadow: 3,
                          height: "100%",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            transform: "scale(0.98)",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography fontWeight="500">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cantidad: {item.quantity}
                          </Typography>
                          <Typography variant="h6" color="error" mt={1}>
                            {formatearDinero(Number(item.price.toFixed(2)))}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
          px: 4,
          pt: 2,
          pb: 2,
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
          disabled={!order?.elements?.length}
          onClick={() => router.push("/summary")}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
