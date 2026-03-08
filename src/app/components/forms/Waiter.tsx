import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Waiter } from "@/types/waiter";

const schema = yup.object().shape({
  name: yup.string().required("Nombre requerido"),
  password: yup.string().min(4, "La contraseña debe tener al menos 4 caracteres").required("Contraseña requerida"),
});

type FormData = yup.InferType<typeof schema>;

interface WaiterFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<Waiter> | null;
  onRemove: (id: string) => void;
}

const WaiterFormDrawer: React.FC<WaiterFormDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  onRemove,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    onClose();
    reset({
      name: "",
      password: "",
    });
  };

  const submitHandler = (data: FormData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 350, padding: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {!!initialData ? "Editar Mesero" : "Agregar Mesero"}
        </Typography>

        <form onSubmit={handleSubmit(submitHandler)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contraseña"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
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
              Guardar
            </Button>
            {(!!initialData && (
              <Button
                color="primary"
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: "rgb(209,15,23)",
                  color: "rgb(209,15,23)",
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 2,
                  fontWeight: "bold",
                  fontSize: "18px",
                  textTransform: "none",
                  mt: 2,
                }}
                onClick={() => {
                  onRemove(initialData._id || "");
                  handleClose();
                }}
              >
                Eliminar
              </Button>
            )) ||
              null}
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default WaiterFormDrawer;
