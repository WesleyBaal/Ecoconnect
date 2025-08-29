import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderizar o conteúdo protegido
  return children;
};

export default ProtectedRoute;
