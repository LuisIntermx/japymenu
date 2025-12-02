import { CssBaseline, Container } from "@mui/material";
import { Inter } from "next/font/google";
import Providers from "./providers/Providers";
import LogoComponent from "./components/Logo";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";

export const metadata = {
  title: "JapyMenu",
  description: "App para registrar pedidos en línea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={inter.className}
        style={{ backgroundColor: "#fff", color: "#000" }}
      >
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
          <Providers>
            <LogoComponent />
            <CssBaseline />
            {children}
          </Providers>
        </Container>
      </body>
    </html>
  );
}
