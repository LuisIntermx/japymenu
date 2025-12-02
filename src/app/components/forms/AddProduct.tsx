import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Menu } from "@/types/menu";

const categories = [
  "Entradas",
  "Platos Fuertes",
  "Postres",
  "Pizzas",
  "Copeo",
  "Alitas",
  "Botellas",
  "Cocteleria",
  "Bebidas sin alcohol",
  "Cervezas",
];
const types = ["Comida", "Bebida"];

const schema = yup.object().shape({
  category: yup.string().required("Categoría requerida"),
  name: yup.string().required("Nombre requerido"),
  description: yup.string().required("Descripción requerida"),
  quantity: yup.string().required("Cantidad requerida"),
  price: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser positivo")
    .required("Precio requerido"),
  type: yup.string().required("Tipo requerido"),
});

type FormData = yup.InferType<typeof schema>;

interface EditFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<Menu> | null;
  onRemove: (id: string) => void;
}

const EditFormDrawer: React.FC<EditFormDrawerProps> = ({
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
      category: "",
      name: "",
      description: "",
      quantity: "",
      price: 0,
      type: "",
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
      category: "",
      name: "",
      description: "",
      quantity: "",
      price: 0,
      type: "",
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
          {!!initialData ? "Editar Producto" : "Agregar Producto"}
        </Typography>

        <form onSubmit={handleSubmit(submitHandler)} noValidate>
          <FormControl fullWidth margin="normal">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={categories}
                  value={field.value || ""}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categoría"
                      error={!!errors.category}
                      helperText={errors.category?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>

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
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cantidad"
                fullWidth
                margin="normal"
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />

          <FormControl fullWidth margin="normal">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={types}
                  value={field.value || ""}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo"
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>

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

export default EditFormDrawer;
