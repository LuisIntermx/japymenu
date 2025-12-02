"use client";

import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const OrderForm = () => {
  const [cliente, setCliente] = useState("");
  const [pedido, setPedido] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente,
        pedido,
        fecha: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      setCliente("");
      setPedido("");
      alert("Comanda guardada!");
    } else {
      alert("Error al guardar");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Nombre del cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        required
      />
      <TextField
        label="Pedido"
        value={pedido}
        onChange={(e) => setPedido(e.target.value)}
        required
        multiline
      />
      <Button type="submit" variant="contained">
        Guardar Comanda
      </Button>
    </Box>
  );
};

export default OrderForm;
