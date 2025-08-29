import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Park as ParkIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useMockData } from '../contexts/MockDataContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { getUserItems, getStats } = useMockData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const fileInputRef = useRef(null);
  
  // Scroll para o topo quando a página carregar
  useScrollToTop();

  // Estatísticas do usuário
  const userItems = getUserItems();
  const stats = getStats();
  const donatedItems = userItems.filter(item => item.status === 'donated').length;
  const availableItems = userItems.filter(item => item.status === 'available').length;
  const reservedItems = userItems.filter(item => item.status === 'reserved').length;

  // Inicializar dados de edição
  React.useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      bio: user.bio || '',
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...editData,
    };

    if (avatarFile) {
      // Simular upload de avatar
      const reader = new FileReader();
      reader.onload = (e) => {
        updatedUser.avatar = e.target.result;
        updateProfile(updatedUser);
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      };
      reader.readAsDataURL(avatarFile);
    } else {
      updateProfile(updatedUser);
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    } else {
      setShowAvatarDialog(true);
    }
  };

  const getStateOptions = () => [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Usuário não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header do Perfil */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Meu Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie suas informações pessoais e acompanhe suas atividades na plataforma
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Coluna Esquerda - Informações Pessoais */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                {/* Avatar */}
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <Avatar
                    src={avatarPreview || user.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      cursor: isEditing ? 'pointer' : 'default',
                      border: isEditing ? '3px solid #4CAF50' : '3px solid #e0e0e0',
                    }}
                    onClick={handleAvatarClick}
                  />
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  )}
                </Box>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />

                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  {user.name}
                </Typography>
                
                {user.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {user.bio}
                  </Typography>
                )}

                <Chip
                  label={`Membro desde ${new Date(user.created_at).toLocaleDateString('pt-BR')}`}
                  variant="outlined"
                  size="small"
                  icon={<CalendarIcon />}
                />
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 Minhas Estatísticas
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FavoriteIcon sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">Itens Doados</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {donatedItems}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="body2">Itens Disponíveis</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {availableItems}
                    </Typography>
                  </Box>
                  
                                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                       <ParkIcon sx={{ color: 'warning.main', mr: 1 }} />
                       <Typography variant="body2">CO₂ Economizado</Typography>
                     </Box>
                     <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                       {Math.round(stats.co2Saved * (donatedItems / Math.max(stats.donatedItems, 1)))} kg
                     </Typography>
                   </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Coluna Direita - Formulário de Edição */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    Informações Pessoais
                  </Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Editar
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        color="primary"
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  {/* Nome */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  {/* Telefone */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  {/* Estado */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={editData.state}
                        onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                        label="Estado"
                        startAdornment={<LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        {getStateOptions().map((state) => (
                          <MenuItem key={state.value} value={state.value}>
                            {state.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Cidade */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>

                  {/* Endereço */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      disabled={!isEditing}
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* Bio */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Biografia"
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      placeholder="Conte um pouco sobre você e seus interesses..."
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    💡 Dica: Clique na foto de perfil para alterá-la
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Itens do Usuário */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3 }}>
                  🎁 Meus Itens
                </Typography>

                {userItems.length > 0 ? (
                                     <List>
                     {userItems.slice(0, 5).map((item) => (
                       <ListItem 
                         key={item.id} 
                         sx={{ px: 0, cursor: 'pointer' }}
                         onClick={() => navigate(`/item/${item.id}`)}
                       >
                         <ListItemIcon>
                           <Chip
                             label={item.status === 'donated' ? 'Doado' : 
                                    item.status === 'reserved' ? 'Reservado' : 'Disponível'}
                             color={item.status === 'donated' ? 'success' : 
                                    item.status === 'reserved' ? 'warning' : 'primary'}
                             size="small"
                           />
                         </ListItemIcon>
                         <ListItemText
                           primary={item.title}
                           secondary={`${item.category} • ${item.condition} • ${new Date(item.created_at).toLocaleDateString('pt-BR')}`}
                         />
                       </ListItem>
                     ))}
                    {userItems.length > 5 && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={`... e mais ${userItems.length - 5} itens`}
                          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                                         <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                       Você ainda não cadastrou nenhum item
                     </Typography>
                     <Button 
                       variant="contained" 
                       color="primary"
                       onClick={() => navigate('/create-item')}
                     >
                       Cadastrar Primeiro Item
                     </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Dialog para visualizar avatar */}
      <Dialog
        open={showAvatarDialog}
        onClose={() => setShowAvatarDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Foto de Perfil</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar
              src={user.avatar}
              sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}
            />
            <Typography variant="body1">
              {user.name}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAvatarDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
