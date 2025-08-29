import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Nature,
  TrendingUp,
  Park,
  LocalShipping,
  Recycling,
  Visibility,
} from '@mui/icons-material';
import { useMockData } from '../contexts/MockDataContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Stats = () => {
  const { getStats } = useMockData();
  const statsData = getStats();
  
  // Scroll para o topo quando a página carregar
  useScrollToTop();

  const getCategoryLabel = (category) => {
    const labels = {
      'eletronicos': 'Eletrônicos',
      'moveis': 'Móveis',
      'roupas': 'Roupas',
      'livros': 'Livros',
      'brinquedos': 'Brinquedos',
      'esportes': 'Esportes',
      'casa': 'Casa',
      'jardinagem': 'Jardinagem',
      'automoveis': 'Automóveis',
      'outros': 'Outros'
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'eletronicos': '📱',
      'moveis': '🪑',
      'roupas': '👕',
      'livros': '📚',
      'brinquedos': '🧸',
      'esportes': '⚽',
      'casa': '🏠',
      'jardinagem': '🌱',
      'automoveis': '🚗',
      'outros': '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
        📊 Estatísticas de Impacto Ambiental
      </Typography>

      {/* Resumo Geral */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <CardContent>
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                <Nature sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {statsData.co2Saved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                kg CO₂ Economizados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <CardContent>
              <Box sx={{ color: 'success.main', mb: 2 }}>
                <Park sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {statsData.co2Equivalents?.trees || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Árvores Equivalentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <CardContent>
              <Box sx={{ color: 'warning.main', mb: 2 }}>
                <LocalShipping sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {statsData.co2Equivalents?.carKm || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                km de Carro Evitados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', py: 3 }}>
            <CardContent>
              <Box sx={{ color: 'info.main', mb: 2 }}>
                <Recycling sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {statsData.reuseRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taxa de Reutilização
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Impacto por Categoria */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            🌱 Impacto por Categoria
          </Typography>
          
          {Object.entries(statsData.co2ByCategory || {}).length > 0 ? (
            <List>
              {Object.entries(statsData.co2ByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, co2]) => (
                  <ListItem key={category} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Typography variant="h5">
                        {getCategoryIcon(category)}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6">
                            {getCategoryLabel(category)}
                          </Typography>
                          <Chip 
                            label={`${Math.round(co2)} kg CO₂`} 
                            color="success" 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(co2 / statsData.co2Saved) * 100} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {Math.round((co2 / statsData.co2Saved) * 100)}% do total economizado
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Nenhum item doado ainda. Seja o primeiro a fazer a diferença!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Equivalências Ambientais */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            🌍 Equivalências Ambientais
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Nature sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">
                    {statsData.co2Equivalents?.trees || 0} árvores plantadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equivale ao CO₂ absorvido por {statsData.co2Equivalents?.trees || 0} árvores em 1 ano
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">
                    {statsData.co2Equivalents?.carKm || 0} km de carro
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distância que um carro percorreria emitindo a mesma quantidade de CO₂
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Visibility sx={{ mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h6">
                    {statsData.co2Equivalents?.months || 0} meses de emissão
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equivale às emissões de uma pessoa em {statsData.co2Equivalents?.months || 0} meses
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">
                    {statsData.averagePerItem} kg CO₂/item
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Média de CO₂ economizado por item doado
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Informações Educativas */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            📚 Como Calculamos o Impacto
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Nosso sistema de cálculo considera:
          </Typography>
          
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Typography variant="h6">🏭</Typography>
              </ListItemIcon>
              <ListItemText 
                primary="Emissões de Produção"
                secondary="CO₂ emitido na fabricação de produtos novos"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Typography variant="h6">🚚</Typography>
              </ListItemIcon>
              <ListItemText 
                primary="Emissões de Transporte"
                secondary="CO₂ emitido no transporte de produtos novos"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Typography variant="h6">📦</Typography>
              </ListItemIcon>
              <ListItemText 
                primary="Embalagens"
                secondary="CO₂ emitido na produção de embalagens"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Typography variant="h6">♻️</Typography>
              </ListItemIcon>
              <ListItemText 
                primary="Condição do Item"
                secondary="Fator de redução baseado no estado do item"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Typography variant="h6">🚗</Typography>
              </ListItemIcon>
              <ListItemText 
                primary="Transporte Local"
                secondary="CO₂ emitido no transporte local do item usado"
              />
            </ListItem>
          </List>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            * Valores baseados em estudos científicos e dados de produção industrial
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Stats;
