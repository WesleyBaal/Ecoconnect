import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    const result = await registerUser(data);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              🌱 EcoConnect
            </Typography>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
              Criar nova conta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Junte-se à nossa comunidade de economia circular
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              {/* Nome */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres',
                    },
                  })}
                  fullWidth
                  label="Nome completo"
                  autoComplete="name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  fullWidth
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              </Grid>

              {/* Telefone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('phone', {
                    required: 'Telefone é obrigatório',
                    pattern: {
                      value: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
                      message: 'Telefone inválido',
                    },
                  })}
                  fullWidth
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={loading}
                />
              </Grid>

              {/* CEP */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('cep', {
                    required: 'CEP é obrigatório',
                    pattern: {
                      value: /^[0-9]{5}-?[0-9]{3}$/,
                      message: 'CEP inválido',
                    },
                  })}
                  fullWidth
                  label="CEP"
                  placeholder="12345-678"
                  error={!!errors.cep}
                  helperText={errors.cep?.message}
                  disabled={loading}
                />
              </Grid>

              {/* Endereço */}
              <Grid item xs={12}>
                <TextField
                  {...register('address', {
                    required: 'Endereço é obrigatório',
                  })}
                  fullWidth
                  label="Endereço completo"
                  placeholder="Rua, número, bairro, cidade - UF"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={loading}
                />
              </Grid>

              {/* Senha */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Senha deve conter letra maiúscula, minúscula e número',
                    },
                  })}
                  fullWidth
                  label="Senha"
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
                />
              </Grid>

              {/* Confirmar Senha */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value) =>
                      value === password || 'As senhas não coincidem',
                  })}
                  fullWidth
                  label="Confirmar senha"
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={loading}
                />
              </Grid>

              {/* Bio */}
              <Grid item xs={12}>
                <TextField
                  {...register('bio')}
                  fullWidth
                  label="Biografia (opcional)"
                  multiline
                  rows={3}
                  placeholder="Conte um pouco sobre você e seus interesses..."
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Criar conta'
              )}
            </Button>
          </Box>

          <Divider sx={{ width: '100%', my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ou
            </Typography>
          </Divider>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Já tem uma conta?
            </Typography>
            <Link
              component={RouterLink}
              to="/login"
              variant="body1"
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Faça login aqui
            </Link>
          </Box>

          {/* Terms */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Política de Privacidade
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;
