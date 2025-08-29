import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  CardMedia,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useItems } from '../hooks/useItems';
import { useAuth } from '../contexts/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const CreateItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useItems();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  
  // Scroll para o topo quando a página carregar
  useScrollToTop();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const categories = [
    { value: 'eletronicos', label: 'Eletrônicos' },
    { value: 'moveis', label: 'Móveis' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'livros', label: 'Livros' },
    { value: 'brinquedos', label: 'Brinquedos' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'casa', label: 'Casa' },
    { value: 'jardinagem', label: 'Jardinagem' },
    { value: 'automoveis', label: 'Automóveis' },
    { value: 'outros', label: 'Outros' },
  ];

  const conditions = [
    { value: 'novo', label: 'Novo' },
    { value: 'como-novo', label: 'Como Novo' },
    { value: 'bom', label: 'Bom' },
    { value: 'regular', label: 'Regular' },
    { value: 'precisa-reparo', label: 'Precisa de Reparo' },
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const itemData = {
        ...data,
        images: images.length > 0 ? images : null,
      };
      await addItem(itemData);
      setSuccess(true);
      reset();
      setImages([]);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            🌱 Doar Item
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compartilhe itens que não usa mais e ajude outras pessoas
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Item criado com sucesso! Redirecionando para o dashboard...
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    {...register('title', {
                      required: 'Título é obrigatório',
                      minLength: {
                        value: 3,
                        message: 'Título deve ter pelo menos 3 caracteres',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Título deve ter no máximo 100 caracteres',
                      },
                    })}
                    fullWidth
                    label="Título do Item"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('description', {
                      required: 'Descrição é obrigatória',
                      minLength: {
                        value: 10,
                        message: 'Descrição deve ter pelo menos 10 caracteres',
                      },
                      maxLength: {
                        value: 1000,
                        message: 'Descrição deve ter no máximo 1000 caracteres',
                      },
                    })}
                    fullWidth
                    multiline
                    rows={4}
                    label="Descrição"
                    placeholder="Descreva o item, suas características, estado de conservação..."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      {...register('category', {
                        required: 'Categoria é obrigatória',
                      })}
                      label="Categoria"
                      disabled={loading}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.category.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.condition}>
                    <InputLabel>Condição</InputLabel>
                    <Select
                      {...register('condition', {
                        required: 'Condição é obrigatória',
                      })}
                      label="Condição"
                      disabled={loading}
                    >
                      {conditions.map((condition) => (
                        <MenuItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.condition && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.condition.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('location')}
                    fullWidth
                    label="Localização (opcional)"
                    placeholder="Ex: Passo Fundo, RS"
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    📸 Imagens do Item (opcional)
                  </Typography>
                  
                  {/* Upload de arquivos */}
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      sx={{ mb: 2 }}
                    >
                      Selecionar Imagens do Computador
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </Box>
                  
                  {/* Preview das imagens */}
                  {images.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Imagens selecionadas ({images.length}):
                      </Typography>
                      <Grid container spacing={2}>
                        {images.map((image, index) => (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Card sx={{ position: 'relative' }}>
                              <CardMedia
                                component="img"
                                height="120"
                                image={image}
                                alt={`Imagem ${index + 1}`}
                                sx={{ 
                                  objectFit: 'contain',
                                  bgcolor: 'grey.100',
                                  p: 0.5
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  bgcolor: 'rgba(0,0,0,0.5)',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                }}
                                onClick={() => handleRemoveImage(index)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Selecione imagens do seu computador para mostrar o item. Formatos aceitos: JPG, PNG, GIF.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                      {loading ? 'Criando...' : 'Criar Item'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default CreateItem;
