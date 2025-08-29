import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import { 
  Search as SearchIcon,
  Chat as ChatIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { useAuth } from '../contexts/AuthContext';
import { useMockData } from '../contexts/MockDataContext';
import { formatDateTime } from '../utils/dateUtils';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { findUserById, sendMessage } = useMockData();
  const [filters, setFilters] = React.useState({
    search: '',
    category: '',
    condition: '',
  });
  
  const { items, loading, pagination } = useItems(filters);

  // Capturar parâmetros da URL e aplicar filtros
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    
    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        category: categoryFromUrl
      }));
    }
  }, [location.search]);

  // Scroll para o topo quando a página carregar
  useScrollToTop();

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStartChat = (item, event) => {
    event.stopPropagation();
    if (item.status === 'donated') {
      return; // Não permitir chat para itens doados
    }
    if (user) {
      // Enviar mensagem inicial
      sendMessage(item.id, user.id, item.user_id, `Olá! Estou interessado no item "${item.title}". Pode me dar mais detalhes?`);
      // Redirecionar para o chat
      navigate(`/chat/${item.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleWhatsApp = (item, event) => {
    event.stopPropagation();
    if (item.status === 'donated') {
      return; // Não permitir WhatsApp para itens doados
    }
    const itemOwner = findUserById(item.user_id);
    if (itemOwner?.phone) {
      const cleanPhone = itemOwner.phone.replace(/\D/g, '');
      const message = `Olá! Vi seu item "${item.title}" no EcoConnect e gostaria de saber mais sobre ele.`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
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

  const categories = [
    { value: '', label: 'Todas' },
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
    { value: '', label: 'Todas' },
    { value: 'novo', label: 'Novo' },
    { value: 'como-novo', label: 'Como Novo' },
    { value: 'bom', label: 'Bom' },
    { value: 'regular', label: 'Regular' },
    { value: 'precisa-reparo', label: 'Precisa de Reparo' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
        🔍 Buscar Itens
      </Typography>
      
      {/* Search Form */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar itens..."
              variant="outlined"
              placeholder="Ex: móveis, eletrônicos, livros..."
              value={filters.search}
              onChange={(e) => handleSearch({ ...filters, search: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select 
                label="Categoria" 
                value={filters.category}
                onChange={(e) => handleSearch({ ...filters, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Condição</InputLabel>
              <Select 
                label="Condição" 
                value={filters.condition}
                onChange={(e) => handleSearch({ ...filters, condition: e.target.value })}
              >
                {conditions.map((condition) => (
                  <MenuItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Results */}
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {loading ? 'Carregando...' : `${items.length} itens encontrados`}
        </Typography>
        
        {items.length > 0 ? (
          <Grid container spacing={3}>
            {items.map((item) => {
              const isUnavailable = item.status === 'donated' || item.status === 'reserved';
              
              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      opacity: isUnavailable ? 0.7 : 1,
                      '&:hover': {
                        transform: isUnavailable ? 'none' : 'translateY(-5px)',
                        boxShadow: isUnavailable ? 1 : 4,
                      },
                    }}
                    onClick={() => navigate(`/item/${item.id}`)}
                  >
                    {/* Overlay para itens indisponíveis */}
                    {isUnavailable && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          zIndex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Chip
                          icon={<BlockIcon />}
                          label={getStatusLabel(item.status)}
                          color={getStatusColor(item.status)}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    )}

                    {/* Imagem do item */}
                    {item.images && item.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.images[0]}
                        alt={item.title}
                        sx={{ 
                          objectFit: 'contain',
                          bgcolor: 'grey.100',
                          p: 1
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                        {item.description.substring(0, 80)}...
                      </Typography>
                      
                      {/* Chips de categoria e condição */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                          label={item.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={item.condition} 
                          size="small" 
                          color="secondary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={getStatusLabel(item.status)} 
                          size="small" 
                          color={getStatusColor(item.status)} 
                          variant="outlined" 
                        />
                      </Box>
                      
                      {/* Informações do usuário */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 1, width: 24, height: 24 }}>
                          {item.user_name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {item.user_name}
                        </Typography>
                      </Box>
                      
                      {/* Localização */}
                      {item.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.location}
                          </Typography>
                        </Box>
                      )}

                      {/* Data de criação */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Anunciado {formatDateTime(item.created_at)}
                        </Typography>
                      </Box>
                      
                      {/* Botões de ação */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ChatIcon />}
                          onClick={(e) => handleStartChat(item, e)}
                          sx={{ flex: 1 }}
                          disabled={isUnavailable}
                        >
                          Chat
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<WhatsAppIcon />}
                          onClick={(e) => handleWhatsApp(item, e)}
                          sx={{ flex: 1 }}
                          color="success"
                          disabled={isUnavailable}
                        >
                          WhatsApp
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : !loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Nenhum item encontrado
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tente ajustar os filtros de busca.
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
};

export default Search;
