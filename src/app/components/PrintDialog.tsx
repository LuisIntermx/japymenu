import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

type PrintDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const PrintDialog: React.FC<PrintDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>¿Deseas imprimir?</DialogTitle>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          sx={{
            borderColor: "rgb(209,15,23)",
            backgroundColor: "#fff",
            color: "rgb(209,15,23)",
            borderRadius: 10,
            padding: 1,
            minWidth: 100,
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "none",
          }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          autoFocus
          sx={{
            borderColor: "rgb(209,15,23)",
            backgroundColor: "rgb(209,15,23)",
            color: "white",
            borderRadius: 10,
            padding: 1,
            minWidth: 100,
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "none",
          }}
        >
          Si
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintDialog;
