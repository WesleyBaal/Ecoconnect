import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Stack,
  Paper,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore,
  NavigateNext,
  CheckCircle,
  Schedule,
  Cancel,
  WhatsApp as WhatsAppIcon,
  Chat as ChatIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockData } from '../contexts/MockDataContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDateTime, formatDate, formatFullDateTime } from '../utils/dateUtils';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, deleteItem, markAsDonated, markAsReserved, markAsAvailable, findUserById, sendMessage } = useMockData();
  const { user } = useAuth();
  
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const item = getItemById(id);
  const isOwner = user && item && item.user_id === user.id;
  const isUnavailable = item && (item.status === 'donated' || item.status === 'reserved');

  // Scroll para o topo quando a página carregar
  useScrollToTop();

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Item não encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            O item que você está procurando não existe ou foi removido.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/search')}
            sx={{ mt: 2 }}
          >
            Voltar para busca
          </Button>
        </Box>
      </Container>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      deleteItem(id, user.id);
      navigate('/dashboard');
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setImageDialogOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === (item.images?.length - 1) ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? (item.images?.length - 1) : prev - 1
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'donated': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'reserved': return 'Reservado';
      case 'donated': return 'Doado';
      default: return status;
    }
  };

  const handleWhatsApp = () => {
    if (isUnavailable) return;
    const itemOwner = findUserById(item.user_id);
    if (itemOwner?.phone) {
      const cleanPhone = itemOwner.phone.replace(/\D/g, '');
      const message = `Olá! Vi seu item "${item.title}" no EcoConnect e gostaria de saber mais sobre ele.`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleStartChat = () => {
    if (isUnavailable) return;
    if (user) {
      // Enviar mensagem inicial
      sendMessage(item.id, user.id, item.user_id, `Olá! Estou interessado no item "${item.title}". Pode me dar mais detalhes?`);
      // Redirecionar para o chat com o itemId
      navigate(`/chat/${item.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Alerta para itens indisponíveis */}
      {isUnavailable && !isOwner && (
        <Alert 
          severity={item.status === 'donated' ? 'error' : 'warning'} 
          sx={{ mb: 3 }}
          icon={item.status === 'donated' ? <BlockIcon /> : <Schedule />}
        >
          {item.status === 'donated' 
            ? 'Este item já foi doado e não está mais disponível.'
            : 'Este item está reservado e não está disponível no momento.'
          }
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Coluna Principal - Detalhes do Item */}
        <Grid item xs={12} lg={8}>
          {/* Header do Item */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={item.category} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={item.condition} 
                      color="secondary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={getStatusLabel(item.status)} 
                      color={getStatusColor(item.status)} 
                      variant="outlined" 
                      icon={item.status === 'donated' ? <BlockIcon /> : undefined}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Galeria de Imagens */}
              {item.images && item.images.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    {item.images.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={image}
                          alt={`${item.title} - Imagem ${index + 1}`}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: 1,
                            objectFit: 'contain',
                            bgcolor: 'grey.100',
                            p: 1,
                            '&:hover': {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => handleImageClick(index)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Descrição */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Descrição
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </Box>

              {/* Localização */}
              {item.location && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    📍 Localização
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">
                      {item.location}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Botões de Ação */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {isOwner ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard')}
                    >
                      Voltar ao Dashboard
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelete}
                    >
                      Deletar Item
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ChatIcon />}
                      onClick={handleStartChat}
                      size="large"
                      disabled={isUnavailable}
                    >
                      {isUnavailable ? 'Item Indisponível' : 'Iniciar Conversa'}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                      onClick={handleWhatsApp}
                      size="large"
                      disabled={isUnavailable}
                    >
                      {isUnavailable ? 'Item Indisponível' : 'WhatsApp'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/search')}
                    >
                      Voltar para Busca
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Gerenciamento de Status (apenas para o dono) */}
          {isOwner && (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  🎯 Gerenciar Status do Item
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Atualize o status do seu item conforme o processo de doação avança.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {item.status !== 'donated' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => markAsDonated(id, user.id)}
                      size="large"
                    >
                      Marcar como Doado
                    </Button>
                  )}
                  {item.status !== 'reserved' && item.status !== 'donated' && (
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<Schedule />}
                      onClick={() => markAsReserved(id, user.id)}
                      size="large"
                    >
                      Reservar Item
                    </Button>
                  )}
                  {item.status !== 'available' && item.status !== 'donated' && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Cancel />}
                      onClick={() => markAsAvailable(id, user.id)}
                      size="large"
                    >
                      Marcar como Disponível
                    </Button>
                  )}
                  {item.status === 'donated' && (
                    <Alert severity="info" sx={{ width: '100%' }}>
                      Este item foi marcado como doado e não pode mais ser alterado.
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Coluna Lateral - Informações do Doador */}
        {!isOwner && (
          <Grid item xs={12} lg={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  👤 Sobre o Doador
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                    {item.user_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.user_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Membro desde {formatDate(item.created_at)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Informações do Item */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    📋 Informações do Item
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Anunciado {formatDateTime(item.created_at)}
                    </Typography>
                  </Box>
                  {item.donated_at && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" color="success.main">
                        Doado {formatDateTime(item.donated_at)}
                      </Typography>
                    </Box>
                  )}
                  {item.reserved_at && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" color="warning.main">
                        Reservado {formatDateTime(item.reserved_at)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ChatIcon />}
                    onClick={handleStartChat}
                    fullWidth
                    size="large"
                    disabled={isUnavailable}
                  >
                    {isUnavailable ? 'Item Indisponível' : 'Iniciar Conversa'}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<WhatsAppIcon />}
                    onClick={handleWhatsApp}
                    fullWidth
                    size="large"
                    disabled={isUnavailable}
                  >
                    {isUnavailable ? 'Item Indisponível' : 'WhatsApp'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Coluna Lateral - Informações do Item (apenas para o autor) */}
        {isOwner && (
          <Grid item xs={12} lg={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  📋 Informações do Item
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Anunciado {formatDateTime(item.created_at)}
                  </Typography>
                </Box>
                {item.donated_at && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                    <Typography variant="body2" color="success.main">
                      Doado {formatDateTime(item.donated_at)}
                    </Typography>
                  </Box>
                )}
                {item.reserved_at && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" color="warning.main">
                      Reservado {formatDateTime(item.reserved_at)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  fullWidth
                  size="large"
                >
                  Voltar ao Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Modal de Imagem */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {item?.title} - Imagem {selectedImageIndex + 1} de {item?.images?.length}
            </Typography>
            <IconButton onClick={() => setImageDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            {item?.images && item.images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <NavigateBefore />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <NavigateNext />
                </IconButton>
              </>
            )}
            <img
              src={item?.images?.[selectedImageIndex]}
              alt={`${item?.title} - Imagem ${selectedImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetail;
