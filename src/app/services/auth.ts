import axios from "axios";
import { LoginCredentials, User } from "@/types/auth";

const API_BASE = "/api/auth";

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE}/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            success: false,
            message: error.response.data?.message || "Error de autenticación",
          };
        } else if (error.request) {
          return {
            success: false,
            message: "No se pudo conectar al servidor",
          };
        }
      }
      
      return {
        success: false,
        message: "Error inesperado al iniciar sesión",
      };
    }
  },

  async validateSession(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await axios.get(`${API_BASE}/validate`, {
        timeout: 5000,
      });

      return response.data;
    } catch {
      return { valid: false };
    }
  },
};
