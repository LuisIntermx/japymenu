"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  AuthContextType,
  AuthState,
  User,
  SavedAccount,
  LoginCredentials,
} from "@/types/auth";
import { authService } from "@/app/services/auth";

const STORAGE_KEYS = {
  CURRENT_USER: "japymenu_current_user",
  SAVED_ACCOUNTS: "japymenu_saved_accounts",
  ACTIVE_SESSION: "japymenu_active_session",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    savedAccounts: [],
    isLoading: true,
    error: null,
  });

  const loadSavedAccounts = (): SavedAccount[] => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_ACCOUNTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading saved accounts:", error);
      return [];
    }
  };

  const saveSavedAccounts = (accounts: SavedAccount[]) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.SAVED_ACCOUNTS,
        JSON.stringify(accounts),
      );
    } catch (error) {
      console.error("Error saving saved accounts:", error);
    }
  };

  const saveCurrentUser = (user: User | null) => {
    if (typeof window === "undefined") return;

    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, "true");
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch (error) {
      console.error("Error saving current user:", error);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);

      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          username: response.user.username,
          name: response.user.name,
          lastLogin: response.user.lastLogin || new Date(),
        };

        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          currentUser: user,
          isLoading: false,
          error: null,
        }));

        saveCurrentUser(user);
        saveAccount(user);
        return true;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.message || "Error al iniciar sesión",
      }));

      return false;
    } catch (error) {
      console.error("Error in login:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al iniciar sesión",
      }));
      return false;
    }
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null,
      error: null,
    }));

    saveCurrentUser(null);
  };

  const selectAccount = async (accountId: string): Promise<boolean> => {
    const account = state.savedAccounts.find((acc) => acc.id === accountId);

    if (!account) {
      setState((prev) => ({ ...prev, error: "Cuenta no encontrada" }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user: User = {
        id: account.id,
        username: account.username,
        name: account.name,
        avatar: account.avatar,
        lastLogin: new Date(),
      };

      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        currentUser: user,
        isLoading: false,
        error: null,
        savedAccounts: prev.savedAccounts.map((acc) =>
          acc.id === accountId
            ? { ...acc, lastLogin: new Date(), isActive: true }
            : acc,
        ),
      }));

      saveCurrentUser(user);
      saveSavedAccounts(
        state.savedAccounts.map((acc) =>
          acc.id === accountId
            ? { ...acc, lastLogin: new Date(), isActive: true }
            : acc,
        ),
      );

      return true;
    } catch (error) {
      console.error("Error selecting account:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al seleccionar cuenta",
      }));
      return false;
    }
  };

  const saveAccount = (user: User) => {
    const existingAccount = state.savedAccounts.find(
      (acc) => acc.id === user.id,
    );

    if (existingAccount) {
      const updatedAccounts = state.savedAccounts.map((acc) =>
        acc.id === user.id
          ? { ...acc, lastLogin: new Date(), isActive: true }
          : acc,
      );
      setState((prev) => ({ ...prev, savedAccounts: updatedAccounts }));
      saveSavedAccounts(updatedAccounts);
    } else {
      const newAccount: SavedAccount = {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        lastLogin: new Date(),
        isActive: true,
      };

      const updatedAccounts = [...state.savedAccounts, newAccount];
      setState((prev) => ({ ...prev, savedAccounts: updatedAccounts }));
      saveSavedAccounts(updatedAccounts);
    }
  };

  const removeAccount = (accountId: string) => {
    const updatedAccounts = state.savedAccounts.filter(
      (acc) => acc.id !== accountId,
    );
    setState((prev) => ({ ...prev, savedAccounts: updatedAccounts }));
    saveSavedAccounts(updatedAccounts);

    if (state.currentUser?.id === accountId) {
      logout();
    }
  };

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const hasActiveSession = localStorage.getItem(
        STORAGE_KEYS.ACTIVE_SESSION,
      );
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const savedAccounts = loadSavedAccounts();

      if (hasActiveSession && storedUser) {
        const user = JSON.parse(storedUser);
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          currentUser: user,
          savedAccounts,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          currentUser: null,
          savedAccounts,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        currentUser: null,
        savedAccounts: loadSavedAccounts(),
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    selectAccount,
    saveAccount,
    removeAccount,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
