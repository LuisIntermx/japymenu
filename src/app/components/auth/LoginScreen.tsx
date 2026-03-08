"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Fade,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from "@mui/material";
import {
  Person,
  Lock,
  ArrowBack,
  Close,
  CheckCircle,
  Login as LoginIcon
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { SavedAccount } from "@/types/auth";

const LoginScreen: React.FC = () => {
  const { 
    savedAccounts, 
    login, 
    removeAccount,
    isLoading,
    error,
    isAuthenticated 
  } = useAuth();

  const [showAccountList, setShowAccountList] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  useEffect(() => {
    if (savedAccounts.length === 0) {
      setShowAccountList(false);
    }
  }, [savedAccounts]);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirección será manejada por el ProtectedRoute
    }
  }, [isAuthenticated]);

  const handleAccountSelect = (account: SavedAccount) => {
    setSelectedAccount(account);
    setShowAccountList(false);
    setCredentials({ username: account.username, password: "" });
  };

  const handleBackToAccounts = () => {
    setSelectedAccount(null);
    setShowAccountList(true);
    setCredentials({ username: "", password: "" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(credentials);
    if (success) {
      // La redirección será manejada por el ProtectedRoute
    }
  };

  const handleRemoveAccount = (accountId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeAccount(accountId);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Ahora";
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return new Date(date).toLocaleDateString("es-ES");
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
      "#2196F3", "#009688", "#4CAF50", "#FF9800",
      "#F44336", "#795548", "#607D8B"
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (showAccountList && savedAccounts.length > 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 480,
            width: "100%",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#1a1a1a",
                mb: 1
              }}
            >
              Bienvenido
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666", mb: 3 }}
            >
              Selecciona tu cuenta para continuar
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            {savedAccounts.map((account) => (
              <Box key={account.id} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Box
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      "& .account-card": {
                        transform: "translateY(-2px)",
                        boxShadow: 4
                      },
                      "& .remove-btn": {
                        opacity: 1
                      }
                    }
                  }}
                  onClick={() => handleAccountSelect(account)}
                >
                  <Paper
                    className="account-card"
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 3,
                      border: "2px solid transparent",
                      borderColor: selectedAccount?.id === account.id ? "rgb(209,15,23)" : "transparent",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <IconButton
                      className="remove-btn"
                      size="small"
                      onClick={(e) => handleRemoveAccount(account.id, e)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        color: "#f44336",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.2)"
                        }
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>

                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        margin: "0 auto 12px",
                        backgroundColor: getAvatarColor(account.username),
                        fontSize: "24px",
                        fontWeight: "bold"
                      }}
                    >
                      {account.avatar ? (
                        <Box
                          component="img"
                          src={account.avatar}
                          alt={account.name}
                          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        getInitials(account.name)
                      )}
                    </Avatar>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#1a1a1a",
                        mb: 0.5
                      }}
                    >
                      {account.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#666", mb: 2 }}
                    >
                      @{account.username}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Chip
                        label={formatDate(account.lastLogin)}
                        size="small"
                        sx={{
                          fontSize: "11px",
                          height: 20,
                          backgroundColor: "#f0f0f0",
                          color: "#666"
                        }}
                      />
                      {account.isActive && (
                        <CheckCircle
                          sx={{
                            fontSize: 16,
                            color: "#4caf50"
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => {
              setShowAccountList(false);
            }}
            sx={{
              borderRadius: 3,
              py: 1.5,
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              borderColor: "rgb(209,15,23)",
              color: "rgb(209,15,23)",
              "&:hover": {
                backgroundColor: "rgba(209,15,23,0.04)",
                borderColor: "rgb(180,10,20)"
              }
            }}
          >
            Usar otra cuenta
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Fade in timeout={500}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 400,
            width: "100%",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)"
          }}
        >
          {selectedAccount && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton onClick={handleBackToAccounts} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: getAvatarColor(selectedAccount.username),
                    fontSize: "16px",
                    fontWeight: "bold",
                    mr: 2
                  }}
                >
                  {selectedAccount.avatar ? (
                    <Box
                      component="img"
                      src={selectedAccount.avatar}
                      alt={selectedAccount.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    getInitials(selectedAccount.name)
                  )}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {selectedAccount.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    @{selectedAccount.username}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#1a1a1a",
                mb: 1
              }}
            >
              {selectedAccount ? "Ingresa tu contraseña" : "Iniciar Sesión"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666" }}
            >
              {selectedAccount 
                ? "Para continuar a JapyMenu"
                : "Ingresa tus credenciales para acceder"
              }
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                disabled={!!selectedAccount}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Person sx={{ color: "#666", mr: 1 }} />
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                variant="outlined"
                InputProps={{
                  startAdornment: <Lock sx={{ color: "#666", mr: 1 }} />
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !credentials.username || !credentials.password}
              sx={{
                borderRadius: 3,
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                backgroundColor: "rgb(209,15,23)",
                "&:hover": {
                  backgroundColor: "rgb(180,10,20)"
                },
                "&:disabled": {
                  backgroundColor: "#ccc"
                }
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>

          {!selectedAccount && savedAccounts.length > 0 && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="text"
                onClick={() => {
                  setShowAccountList(true);
                }}
                sx={{
                  textTransform: "none",
                  color: "rgb(209,15,23)",
                  fontWeight: 600
                }}
              >
                Ver cuentas guardadas
              </Button>
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};
export default LoginScreen;
