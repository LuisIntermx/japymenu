import { Typography, Grid, Box, IconButton, Paper } from "@mui/material";
import { Add, Remove, DeleteOutline } from "@mui/icons-material";

type Props = {
  name: string;
  description: string;
  quantity: number;
  amount: number;
  onAdd: () => void;
  onRemove: () => void;
  isActive: boolean;
  canEdit: boolean;
};

export default function OrderItem({
  name,
  description,
  quantity,
  amount,
  onAdd,
  onRemove,
  isActive,
  canEdit,
}: Props) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        maxHeight: 130,
        minHeight: 130,
        textAlign: "start",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Grid container direction="row" size={{ xs: 12 }}>
        <Grid size={{ xs: 8 }}>
          <Typography variant="h6" fontWeight="bold" mt={1}>
            ${amount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 4 }} sx={{ mt: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
          >
            <IconButton
              onClick={onRemove}
              sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}
              disabled={!isActive || !canEdit}
              size="small"
            >
              {quantity > 1 ? <Remove /> : <DeleteOutline />}
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton
              onClick={onAdd}
              size="small"
              sx={{
                "&:hover": { bgcolor: "error.dark" },
                borderColor: "rgb(209,15,23)",
                backgroundColor: "rgb(209,15,23)",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
              }}
              disabled={!isActive || !canEdit}
            >
              <Add />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
