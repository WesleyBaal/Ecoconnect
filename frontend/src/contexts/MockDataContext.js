import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { calculateCO2Stats, getCO2Equivalents } from '../utils/co2Calculator';

const MockDataContext = createContext();

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData deve ser usado dentro de um MockDataProvider');
  }
  return context;
};

export const MockDataProvider = ({ children }) => {
  // Dados simulados de usuários
  const [mockUsers, setMockUsers] = useState(() => {
    const saved = localStorage.getItem('mockUsers');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Wesley Baal',
        email: 'wesleypbi@hotmail.com',
        password: '123456',
        phone: '(55) 99710-2742',
        address: 'Rua Benjamin Constant, 611',
        city: 'Passo Fundo',
        state: 'RS',
        bio: 'Apaixonado por sustentabilidade e economia circular',
        avatar: null,
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@teste.com',
        password: '123456',
        phone: '(54) 99999-8888',
        address: 'Rua General Osório, 789',
        city: 'Passo Fundo',
        state: 'RS',
        bio: 'Adoro doar e ajudar o próximo',
        avatar: null,
        created_at: '2024-01-16T14:30:00Z'
      }
    ];
  });

  // Dados simulados de itens
  const [mockItems, setMockItems] = useState(() => {
    const saved = localStorage.getItem('mockItems');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Sofá 3 Lugares',
        description: 'Sofá confortável em ótimo estado, ideal para sala de estar.',
        category: 'moveis',
        condition: 'bom',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500'
        ],
        location: 'Passo Fundo, RS',
        status: 'available',
        user_id: 1,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        donated_at: null,
        reserved_at: null
      },
      {
        id: 2,
        title: 'Notebook Dell Inspiron',
        description: 'Notebook em excelente estado, processador i5, 8GB RAM, 256GB SSD.',
        category: 'eletronicos',
        condition: 'como-novo',
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
        ],
        location: 'Passo Fundo, RS',
        status: 'donated',
        user_id: 2,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        donated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reserved_at: null
      },
      {
        id: 3,
        title: 'Bicicleta Mountain Bike',
        description: 'Bicicleta para trilhas, aro 26, freios a disco, em bom estado.',
        category: 'esportes',
        condition: 'bom',
        images: [
          'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=500',
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'
        ],
        location: 'Passo Fundo, RS',
        status: 'reserved',
        user_id: 1,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        donated_at: null,
        reserved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        title: 'Livros de Programação',
        description: 'Coleção de livros sobre JavaScript, React e Node.js.',
        category: 'livros',
        condition: 'novo',
        images: [
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
        ],
        location: 'Passo Fundo, RS',
        status: 'available',
        user_id: 2,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        donated_at: null,
        reserved_at: null
      },
      {
        id: 5,
        title: 'Smartphone Samsung Galaxy',
        description: 'Smartphone em ótimo estado, tela 6.1", 128GB, câmera 48MP.',
        category: 'eletronicos',
        condition: 'como-novo',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
        ],
        location: 'Passo Fundo, RS',
        status: 'donated',
        user_id: 1,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        donated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reserved_at: null
      }
    ];
  });

  // Dados simulados de mensagens
  const [mockMessages, setMockMessages] = useState(() => {
    const saved = localStorage.getItem('mockMessages');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        item_id: 2,
        sender_id: 1,
        receiver_id: 2,
        message: 'Olá! Estou interessado nos livros de programação. Eles ainda estão disponíveis?',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 dias atrás
      },
      {
        id: 2,
        item_id: 2,
        sender_id: 2,
        receiver_id: 1,
        message: 'Sim, ainda estão disponíveis! Você gostaria de combinar um horário para buscar?',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString() // 2 dias atrás + 30 min
      },
      {
        id: 3,
        item_id: 4,
        sender_id: 1,
        receiver_id: 2,
        message: 'Oi! O notebook ainda está disponível? Qual a configuração exata?',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 horas atrás
      }
    ];
  });

  // Salvar dados no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    localStorage.setItem('mockItems', JSON.stringify(mockItems));
  }, [mockItems]);

  useEffect(() => {
    localStorage.setItem('mockMessages', JSON.stringify(mockMessages));
  }, [mockMessages]);

  // Funções para gerenciar usuários
  const createUser = (userData) => {
    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
      ...userData,
      created_at: new Date().toISOString()
    };
    setMockUsers(prev => [...prev, newUser]);
    toast.success('Usuário criado com sucesso!');
    return newUser;
  };

  const findUserByEmail = (email) => {
    return mockUsers.find(user => user.email === email);
  };

  const findUserById = (id) => {
    return mockUsers.find(user => user.id === id);
  };

  // Funções para gerenciar itens
  const createItem = (itemData, userId) => {
    const user = findUserById(userId);
    const newItem = {
      id: Math.max(...mockItems.map(i => i.id), 0) + 1,
      ...itemData,
      user_id: userId,
      user_name: user.name,
      user_avatar: user.avatar,
      status: 'available',
      created_at: new Date().toISOString()
    };
    setMockItems(prev => [...prev, newItem]);
    toast.success('Item criado com sucesso!');
    return newItem;
  };

  const getItems = (filters = {}) => {
    let filteredItems = [...mockItems];

    // Filtrar por categoria
    if (filters.category && filters.category !== '') {
      filteredItems = filteredItems.filter(item => item.category === filters.category);
    }

    // Filtrar por condição
    if (filters.condition && filters.condition !== '') {
      filteredItems = filteredItems.filter(item => item.condition === filters.condition);
    }

    // Filtrar por busca
    if (filters.search && filters.search !== '') {
      const search = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    }

    // Filtrar por status
    if (filters.status && filters.status !== '') {
      filteredItems = filteredItems.filter(item => item.status === filters.status);
    }

    // Ordenar por data de criação (mais recente primeiro)
    filteredItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredItems.length,
        pages: Math.ceil(filteredItems.length / parseInt(limit))
      }
    };
  };

  const getItemById = (id) => {
    return mockItems.find(item => item.id === parseInt(id));
  };

  const updateItem = (id, updates, userId) => {
    setMockItems(prev => prev.map(item => {
      if (item.id === parseInt(id) && item.user_id === userId) {
        return {
          ...item,
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    }));
    toast.success('Item atualizado com sucesso!');
  };

  const deleteItem = (id, userId) => {
    setMockItems(prev => prev.filter(item => 
      !(item.id === parseInt(id) && item.user_id === userId)
    ));
    toast.success('Item deletado com sucesso!');
  };

  const getUserItems = (userId) => {
    return mockItems.filter(item => item.user_id === userId);
  };

  // Funções para gerenciar mensagens
  const getMessages = (userId) => {
    return mockMessages.filter(msg => 
      msg.sender_id === userId || msg.receiver_id === userId
    );
  };

  const getMessagesByItem = (itemId) => {
    return mockMessages.filter(msg => msg.item_id === parseInt(itemId));
  };

  const sendMessage = (itemId, senderId, receiverId, message) => {
    const newMessage = {
      id: Math.max(...mockMessages.map(m => m.id), 0) + 1,
      item_id: parseInt(itemId),
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      created_at: new Date().toISOString()
    };
    
    // Atualizar o estado imediatamente
    setMockMessages(prev => {
      const updated = [...prev, newMessage];
      // Salvar no localStorage
      localStorage.setItem('mockMessages', JSON.stringify(updated));
      return updated;
    });
    
    toast.success('Mensagem enviada com sucesso!');
    return newMessage;
  };

  const markMessagesAsRead = (itemId, userId) => {
    setMockMessages(prev => {
      const updated = prev.map(message => {
        if (message.item_id === parseInt(itemId) && 
            message.receiver_id === userId && 
            !message.read) {
          return { ...message, read: true };
        }
        return message;
      });
      
      // Salvar no localStorage
      localStorage.setItem('mockMessages', JSON.stringify(updated));
      return updated;
    });
  };

  // Funções para gerenciar status dos itens
  const markAsDonated = (itemId, userId) => {
    setMockItems(prev => prev.map(item => {
      if (item.id === parseInt(itemId) && item.user_id === userId) {
        // Verificar se já não está doado
        if (item.status === 'donated') {
          toast.error('Este item já foi marcado como doado!');
          return item;
        }
        return {
          ...item,
          status: 'donated',
          donated_at: new Date().toISOString()
        };
      }
      return item;
    }));
    toast.success('Item marcado como doado com sucesso!');
  };

  const markAsReserved = (itemId, userId) => {
    setMockItems(prev => prev.map(item => {
      if (item.id === parseInt(itemId) && item.user_id === userId) {
        // Verificar se não está doado
        if (item.status === 'donated') {
          toast.error('Não é possível reservar um item que já foi doado!');
          return item;
        }
        return {
          ...item,
          status: 'reserved',
          reserved_at: new Date().toISOString()
        };
      }
      return item;
    }));
    toast.success('Item reservado com sucesso!');
  };

  const markAsAvailable = (itemId, userId) => {
    setMockItems(prev => prev.map(item => {
      if (item.id === parseInt(itemId) && item.user_id === userId) {
        // Verificar se não está doado
        if (item.status === 'donated') {
          toast.error('Não é possível alterar o status de um item que já foi doado!');
          return item;
        }
        return {
          ...item,
          status: 'available',
          donated_at: null,
          reserved_at: null
        };
      }
      return item;
    }));
    toast.success('Item marcado como disponível!');
  };

  // Funções para estatísticas
  const getStats = () => {
    const donatedItems = mockItems.filter(item => item.status === 'donated');
    const activeUsers = mockUsers.length;
    const totalItems = mockItems.length;
    
    // Calcular CO₂ usando o sistema preciso
    const co2Stats = calculateCO2Stats(mockItems);
    const co2Equivalents = getCO2Equivalents(co2Stats.totalCO2);
    
    // Calcular taxa de reutilização
    const reuseRate = totalItems > 0 ? Math.round((donatedItems.length / totalItems) * 100) : 0;
    
    return {
      activeUsers,
      donatedItems: donatedItems.length,
      co2Saved: co2Stats.totalCO2,
      reuseRate,
      // Estatísticas detalhadas de CO₂
      co2Stats,
      co2Equivalents,
      // Estatísticas por categoria
      co2ByCategory: co2Stats.co2ByCategory,
      topCategory: co2Stats.topCategory,
      averagePerItem: co2Stats.averagePerItem
    };
  };

  const value = {
    // Usuários
    mockUsers,
    createUser,
    findUserByEmail,
    findUserById,
    
    // Itens
    mockItems,
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
    getUserItems,
    
    // Mensagens
    mockMessages,
    getMessages,
    getMessagesByItem,
    sendMessage,
    markMessagesAsRead,
    
    // Status
    markAsDonated,
    markAsReserved,
    markAsAvailable,
    
    // Estatísticas
    getStats
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};
