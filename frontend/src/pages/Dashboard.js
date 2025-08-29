import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../hooks/useItems';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserItems } = useItems();
  
  // Scroll para o topo quando a página carregar
  useScrollToTop();

  const userItems = getUserItems();

  const quickActions = [
    {
      title: 'Doar Item',
      description: 'Compartilhe itens que não usa mais',
      icon: <AddIcon />,
      color: 'secondary',
      action: () => navigate('/create-item'),
    },
    {
      title: 'Buscar Itens',
      description: 'Encontre itens disponíveis',
      icon: <SearchIcon />,
      color: 'primary',
      action: () => navigate('/search'),
    },
    {
      title: 'Conversas',
      description: 'Veja suas mensagens',
      icon: <ChatIcon />,
      color: 'info',
      action: () => navigate('/chat'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Olá, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo ao seu painel de controle. Aqui você pode gerenciar suas doações e encontrar novos itens.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    color: `${action.color}.main`,
                    fontSize: 48,
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {userItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Itens Doados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Itens Recebidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'info.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conversas Ativas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'success.main' }}>
                5.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avaliação Média
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            Seus Itens
          </Typography>
          {userItems.length > 0 ? (
            <Grid container spacing={2}>
              {userItems.slice(0, 3).map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card variant="outlined">
                    {/* Imagem do item */}
                    {item.images && item.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.images[0]}
                        alt={item.title}
                        sx={{ 
                          objectFit: 'contain',
                          bgcolor: 'grey.100',
                          p: 1
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description.substring(0, 80)}...
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Você ainda não tem itens doados.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Comece doando itens para ver sua atividade aqui.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-item')}
                sx={{ mt: 2 }}
              >
                Doar Primeiro Item
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
