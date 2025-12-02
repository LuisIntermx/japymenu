"use client";

import { useState, useEffect } from "react";
import { Grid, Typography, Card, CardContent, TextField } from "@mui/material";
import { Menu } from "@/types/menu";
import { getMenu } from "@/app/features/menu/api/get";
import { formatearDinero } from "@/utils/func";
import AddProductDrawer from "@/app/components/forms/AddProduct";
import { create } from "@/app/features/menu/api/create";
import { update } from "@/app/features/menu/api/update";
import { deleteMenu } from "@/app/features/menu/api/delete";
import { enqueueSnackbar } from "notistack";
import { omit } from "lodash";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [selected, setSelected] = useState<Menu | null>(null);
  const [originalMenu, setOriginalMenu] = useState<Menu[]>([]);
  const [text, setText] = useState("");

  const handleGetMenu = async () => {
    const response = await getMenu().catch(() => null);
    if (response) {
      setMenu(response);
      setOriginalMenu(response);
    }
  };

  useEffect(() => {
    if (!menu.length) {
      handleGetMenu();
    }
  }, []);

  useEffect(() => {
    if (text.trim() !== "") {
      const filtrado = originalMenu.filter((m) =>
        m.name.toLowerCase().includes(text.toLowerCase())
      );
      setMenu(filtrado);
    } else {
      setMenu(originalMenu);
    }
  }, [text, originalMenu]);

  const handleCreateOrUpdate = async (values: Partial<Menu>) => {
    if (!selected) {
      await create(values);
      enqueueSnackbar("Elemento creado", { variant: "success" });
    } else {
      await update(values._id || "", omit(values, ["_id"]));
      enqueueSnackbar("Elemento actualizado", { variant: "success" });
    }
    handleGetMenu();
  };

  const handleRemove = async (id: string) => {
    await deleteMenu(id);
    enqueueSnackbar("Elemento eliminado", { variant: "success" });
    handleGetMenu();
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
      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar elemento en el menú"
        />
      </Grid>
      <Grid
        container
        spacing={2}
        size={{ xs: 12 }}
        direction="row"
        sx={{
          maxHeight: "70vh",
          minHeight: "70vh",
          overflowY: "auto",
          p: 1,
        }}
      >
        <Grid size={{ xs: 6 }} key="add" sx={{ maxHeight: 170 }}>
          <Card
            sx={{
              backgroundColor: "rgb(209,15,23)",
              color: "white",
              borderRadius: 2,
              boxShadow: 3,
              height: "100%",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(0.98)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
              },
              fontSize: 30,
            }}
            onClick={() => setOpen(true)}
          >
            <CardContent
              sx={{ justifyContent: "center", alignContent: "center" }}
            >
              <Typography fontWeight="500" sx={{ fontSize: 20, mt: 4 }}>
                Agregar Producto
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {menu.map((item) => (
          <Grid size={{ xs: 6 }} key={item._id} sx={{ maxHeight: 170 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(0.98)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                setOpen(true);
                setSelected(item);
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
      <AddProductDrawer
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
