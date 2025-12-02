import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import get from "lodash/get";
import { yupResolver } from "@hookform/resolvers/yup";
import { getWaiters } from "@/app/features/waiter/api/get";
import { Waiter } from "@/types/waiter";
import { getTables } from "@/app/features/table/api/get";
import { Table } from "@/types/table";
import { Order } from "@/types/order";

const schema = yup.object().shape({
  waiter: yup.string().required("Mesero Requerido"),
  table: yup.string().required("Mesa / Barra Requerido"),
  comments: yup.string().nullable().optional(),
  guests: yup
    .number()
    .typeError("Debe ser un número")
    .required("Número de Personas Requerido")
    .min(1, "Debe ser al menos 1 persona"),
});

type FormData = yup.InferType<typeof schema>;

interface OrderFowmDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    _id: string;
    waiter: string;
    table: string;
    notes: string;
    guests: number;
  }) => void;
  initialData: Partial<Order> | null;
}

const OrderFowmDrawer: React.FC<OrderFowmDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      waiter: "",
      table: "",
      comments: "",
      guests: 1,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      reset({
        ...initialData,
        waiter: get(initialData, "name"),
        guests: initialData?.guests || 1,
      });
    }
  }, [open, initialData, reset]);

  const handleGetTables = async () => {
    const response = await getTables().catch(() => null);
    if (response) {
      setTables(response.result);
    }
  };

  const handleGetWaiters = async () => {
    const response = await getWaiters().catch(() => null);
    if (response) {
      setWaiters(response.result);
    }
  };

  useEffect(() => {
    handleGetTables();
    handleGetWaiters();
  }, []);

  const handleClose = () => {
    onClose();
    reset({
      waiter: "",
      table: "",
      comments: "",
      guests: 1,
    });
  };

  const submitHandler = (data: FormData) => {
    onSubmit(
      data as {
        _id: string;
        waiter: string;
        table: string;
        notes: string;
        guests: number;
      }
    );
    handleClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 350, padding: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Editar Orden
        </Typography>

        <form onSubmit={handleSubmit(submitHandler)} noValidate>
          <Controller
            name="waiter"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={waiters.map((waiter) => ({
                  value: waiter.name,
                  label: waiter.name,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => {
                  return option.value === value.value;
                }}
                value={
                  waiters
                    .map((waiter) => ({
                      value: waiter.name,
                      label: waiter.name,
                    }))
                    .find((opt) => opt.value === field.value) || null
                }
                onChange={(_, value) => field.onChange(value?.value || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mesero"
                    margin="normal"
                    fullWidth
                    error={!!errors.waiter}
                    helperText={errors.waiter?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="table"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={tables.map((table) => ({
                  value: table.number,
                  label: table.number,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => {
                  console.log(option, value);
                  return option.value === value.value;
                }}
                value={
                  tables
                    .map((table) => ({
                      value: table.number,
                      label: table.number,
                    }))
                    .find((opt) => opt.value === field.value) || null
                }
                onChange={(_, value) => field.onChange(value?.value || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mesa / Barra"
                    margin="normal"
                    fullWidth
                    error={!!errors.table}
                    helperText={errors.table?.message}
                  />
                )}
              />
            )}
          />

          {/* Número de personas */}
          <Controller
            name="guests"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número de Personas"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.guests}
                helperText={errors.guests?.message}
              />
            )}
          />

          {/* Comentarios */}
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Comentarios"
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
            )}
          />

          <Box mt={2}>
            <Button
              type="submit"
              color="primary"
              fullWidth
              variant="contained"
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
            >
              Editar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default OrderFowmDrawer;
