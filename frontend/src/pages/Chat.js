import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMockData } from '../contexts/MockDataContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Chat = () => {
  const navigate = useNavigate();
  const { itemId } = useParams(); // Pegar o itemId da URL se existir
  const { user } = useAuth();
  const { 
    getMessages, 
    getMessagesByItem, 
    sendMessage, 
    getItemById, 
    findUserById,
    mockMessages,
    markMessagesAsRead
  } = useMockData();
  
  const [messages, setMessages] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  // Função para rolar para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Atualizar mensagens sempre que mockMessages mudar
  useEffect(() => {
    if (selectedItem) {
      const itemMessages = getMessagesByItem(selectedItem.id);
      const previousMessageCount = messages.length;
      setMessages(itemMessages);
      
      // Só fazer scroll para o final se for uma mensagem recebida (não enviada)
      if (itemMessages.length > previousMessageCount) {
        const newMessages = itemMessages.slice(previousMessageCount);
        const hasReceivedMessages = newMessages.some(msg => msg.sender_id !== user.id);
        
        if (hasReceivedMessages) {
          setTimeout(scrollToBottom, 100);
        }
      }
    }
  }, [mockMessages, selectedItem, getMessagesByItem, messages.length, user.id]);

  // Scroll para o topo quando a página carregar
  useScrollToTop();

  // Carregar conversas do usuário
  useEffect(() => {
    if (user) {
      const userMessages = getMessages(user.id);
      const conversationsMap = new Map();
      
      userMessages.forEach(message => {
        const item = getItemById(message.item_id);
        if (item) {
          if (!conversationsMap.has(item.id)) {
            const itemMessages = getMessagesByItem(item.id);
            const lastMessage = itemMessages[itemMessages.length - 1];
            
            conversationsMap.set(item.id, {
              itemId: item.id,
              item,
              messages: itemMessages,
              lastMessage,
              unreadCount: itemMessages.filter(msg => 
                msg.receiver_id === user.id && !msg.read
              ).length
            });
          }
        }
      });
      
      const conversationsArray = Array.from(conversationsMap.values());
      setConversations(conversationsArray);
      
      // Se há um itemId na URL, selecionar automaticamente
      if (itemId) {
        const targetItem = getItemById(parseInt(itemId));
        if (targetItem) {
          setSelectedItem(targetItem);
          const itemMessages = getMessagesByItem(parseInt(itemId));
          setMessages(itemMessages);
          
          // Marcar mensagens como lidas
          markMessagesAsRead(parseInt(itemId), user.id);
        }
      }
    }
  }, [user, itemId, getMessages, getMessagesByItem, getItemById, mockMessages, markMessagesAsRead]);

  const handleSelectConversation = (itemId) => {
    const item = getItemById(itemId);
    if (item) {
      setSelectedItem(item);
      const itemMessages = getMessagesByItem(itemId);
      setMessages(itemMessages);
      
      // Marcar mensagens como lidas
      markMessagesAsRead(itemId, user.id);
      
      // Atualizar URL
      navigate(`/chat/${itemId}`);
      
      // Scroll para o topo (não para o rodapé)
      window.scrollTo(0, 0);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedItem && user) {
      // Garantir que a mensagem seja enviada para o dono do item
      const receiverId = selectedItem.user_id;
      
      // Só enviar se o usuário atual não for o dono do item
      if (receiverId !== user.id) {
        sendMessage(selectedItem.id, user.id, receiverId, newMessage.trim());
        setNewMessage('');
      } else {
        // Se for o dono do item, enviar para o último interessado
        const itemMessages = getMessagesByItem(selectedItem.id);
        if (itemMessages.length > 0) {
          const lastMessage = itemMessages[itemMessages.length - 1];
          const receiverId = lastMessage.sender_id === user.id ? 
            lastMessage.receiver_id : lastMessage.sender_id;
          
          sendMessage(selectedItem.id, user.id, receiverId, newMessage.trim());
          setNewMessage('');
        }
      }
    }
  };

  const handleWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Olá! Vi seu item "${selectedItem?.title}" no EcoConnect e gostaria de saber mais sobre ele.`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Função para obter o nome do outro participante da conversa
  const getOtherParticipantName = () => {
    if (!selectedItem || !user) return '';
    
    if (selectedItem.user_id === user.id) {
      // Se o usuário atual é o dono do item, mostrar o nome do interessado
      const itemMessages = getMessagesByItem(selectedItem.id);
      if (itemMessages.length > 0) {
        const lastMessage = itemMessages[itemMessages.length - 1];
        const otherUserId = lastMessage.sender_id === user.id ? 
          lastMessage.receiver_id : lastMessage.sender_id;
        const otherUser = findUserById(otherUserId);
        return otherUser?.name || 'Usuário';
      }
    } else {
      // Se o usuário atual não é o dono, mostrar o nome do dono
      return selectedItem.user_name;
    }
    
    return 'Usuário';
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Faça login para acessar o chat
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Fazer Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
        💬 Conversas
      </Typography>

      <Grid container spacing={3}>
        {/* Lista de conversas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Conversas ({conversations.length})
              </Typography>
              
              {conversations.length > 0 ? (
                <List>
                  {conversations.map((conversation, index) => (
                    <React.Fragment key={conversation.itemId}>
                      <ListItem 
                        button 
                        onClick={() => handleSelectConversation(conversation.itemId)}
                        selected={selectedItem?.id === conversation.itemId}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {conversation.item?.title?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={conversation.item?.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {conversation.lastMessage?.message?.substring(0, 50)}...
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(conversation.lastMessage?.created_at).toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>
                          }
                        />
                        {conversation.unreadCount > 0 && (
                          <Chip 
                            label={conversation.unreadCount} 
                            color="primary" 
                            size="small" 
                          />
                        )}
                      </ListItem>
                      {index < conversations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma conversa ainda
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Chat */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedItem ? (
              <>
                {/* Header do chat */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar>
                        {selectedItem.title.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6">
                        {selectedItem.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversa com {getOtherParticipantName()}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => {
                          const itemOwner = findUserById(selectedItem.user_id);
                          if (itemOwner?.phone) {
                            handleWhatsApp(itemOwner.phone);
                          }
                        }}
                        size="small"
                      >
                        WhatsApp
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* Mensagens */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {messages.map((message) => {
                        const isOwnMessage = message.sender_id === user.id;
                        const sender = findUserById(message.sender_id);
                        
                        return (
                          <Box
                            key={message.id}
                            sx={{
                              display: 'flex',
                              justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                            }}
                          >
                            <Paper
                              sx={{
                                p: 2,
                                maxWidth: '70%',
                                bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                                color: isOwnMessage ? 'white' : 'text.primary',
                              }}
                            >
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {message.message}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {new Date(message.created_at).toLocaleString('pt-BR')}
                              </Typography>
                            </Paper>
                          </Box>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nenhuma mensagem ainda. Inicie uma conversa!
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Input de mensagem */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        multiline
                        maxRows={3}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        startIcon={<SendIcon />}
                      >
                        Enviar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}>
                <Typography variant="h6" color="text.secondary">
                  Selecione uma conversa para começar
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
