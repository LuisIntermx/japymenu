"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { OrderProvider } from "../context/OrderContext";
import { AuthProvider } from "../context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isReload = e.key.toLowerCase() === "r";

      // Bloquea Cmd+R en Mac o Ctrl+R en Windows
      if (
        (isMac && e.metaKey && isReload) ||
        (!isMac && e.ctrlKey && isReload)
      ) {
        e.preventDefault();
        console.log("Recarga bloqueada");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <AuthProvider>
          <OrderProvider>{children}</OrderProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
