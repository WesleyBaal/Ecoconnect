import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo e Descrição */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              🌱 EcoConnect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Conectando pessoas para promover a economia circular. 
              Doe e receba itens usados, contribuindo para um futuro mais sustentável.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Links Rápidos */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Links Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Início
              </Link>
              <Link href="/search" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Buscar Itens
              </Link>
              <Link href="/create-item" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Doar Item
              </Link>
              <Link href="/about" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Sobre Nós
              </Link>
            </Box>
          </Grid>

          {/* Categorias */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Categorias
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/search?category=eletronicos" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Eletrônicos
              </Link>
              <Link href="/search?category=moveis" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Móveis
              </Link>
              <Link href="/search?category=roupas" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Roupas
              </Link>
              <Link href="/search?category=livros" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Livros
              </Link>
            </Box>
          </Grid>

          {/* Contato */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contato
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  wesleypbi@hotmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  (55) 99710-2742
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Rua Benjamin Constant, 611 - Passo Fundo, RS - Brasil
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} EcoConnect. Todos os direitos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
              Política de Privacidade
            </Link>
            <Link href="/terms" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>
              Termos de Uso
            </Link>
          </Box>
        </Box>

        {/* Projeto de Extensão */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Projeto de Extensão Universitária Cruzeiro do Sul
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
