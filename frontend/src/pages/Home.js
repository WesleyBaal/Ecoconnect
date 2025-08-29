import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Favorite,
  People,
  TrendingUp,
  ArrowForward,
  Search,
  Add,
  Chat,
  Nature,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../hooks/useItems';
import { useMockData } from '../contexts/MockDataContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Home = () => {
  const navigate = useNavigate();
  const { items, loading } = useItems({ limit: 6 }); // Mostrar apenas 6 itens recentes
  const { getStats } = useMockData();
  
  const statsData = getStats();
  
  // Scroll para o topo quando a página carregar
  useScrollToTop();

  const stats = [
    { icon: <People />, value: statsData.activeUsers.toString(), label: 'Usuários Ativos' },
    { icon: <Favorite />, value: statsData.donatedItems.toString(), label: 'Itens Doados' },
    { 
      icon: <Nature />, 
      value: statsData.co2Saved.toString(), 
      label: `kg CO₂ Economizados`,
      subtitle: statsData.co2Equivalents ? 
        `Equivale a ${statsData.co2Equivalents.trees} árvores plantadas` : null
    },
    { icon: <TrendingUp />, value: `${statsData.reuseRate}%`, label: 'Taxa de Reutilização' },
  ];

  const features = [
    {
      icon: <Search color="primary" />,
      title: 'Encontre Itens',
      description: 'Busque por itens disponíveis em sua região e conecte-se com doadores.',
    },
    {
      icon: <Add color="secondary" />,
      title: 'Doe Itens',
      description: 'Compartilhe itens que não usa mais e ajude outras pessoas.',
    },
    {
      icon: <Chat color="primary" />,
      title: 'Conecte-se',
      description: 'Converse diretamente com doadores e receptores através do chat.',
    },
  ];

  const categories = [
    { name: 'Eletrônicos', value: 'eletronicos', icon: '📱', color: '#2196F3' },
    { name: 'Móveis', value: 'moveis', icon: '🪑', color: '#8BC34A' },
    { name: 'Roupas', value: 'roupas', icon: '👕', color: '#FF9800' },
    { name: 'Livros', value: 'livros', icon: '📚', color: '#9C27B0' },
    { name: 'Brinquedos', value: 'brinquedos', icon: '🧸', color: '#E91E63' },
    { name: 'Esportes', value: 'esportes', icon: '⚽', color: '#607D8B' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  Conecte-se para um futuro mais sustentável
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  Doe e receba itens usados, promovendo a economia circular e 
                  construindo uma comunidade mais consciente.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => navigate('/search')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    Buscar Itens
                    <ArrowForward sx={{ ml: 1 }} />
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Cadastre-se
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                  }}
                >
                  <Nature sx={{ fontSize: 200, opacity: 0.3 }} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    {stat.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {stat.subtitle}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{ mb: 6, fontWeight: 600 }}
            >
              Como Funciona
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ fontSize: 60, mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Recent Items Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Itens Recentes
          </Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Carregando itens...</Typography>
            </Box>
          ) : items.length > 0 ? (
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate(`/item/${item.id}`)}
                  >
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
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description.substring(0, 100)}...
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
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
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Por: {item.user_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum item disponível no momento
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Categorias Populares
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/search?category=${category.value}`)}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {category.icon}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Pronto para começar?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Junte-se à nossa comunidade e ajude a construir um futuro mais sustentável.
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => navigate('/register')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                }}
              >
                Começar Agora
                <ArrowForward sx={{ ml: 1 }} />
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
