import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useMockData } from './MockDataContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const navigate = useNavigate();
  
  // Importar dados mock
  const { findUserByEmail, createUser: createMockUser, findUserById } = useMockData();

  // Verificar token na inicialização
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Extrair ID do usuário do token mock
          const tokenParts = token.split('_');
          const userId = parseInt(tokenParts[2]);
          
          // Buscar usuário nos dados mock
          const userData = findUserById(userId);
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Usar dados mock
      const mockUser = findUserByEmail(email);
      if (!mockUser) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      // Verificar senha (simplificado para demo)
      if (password !== mockUser.password) {
        return { success: false, error: 'Senha incorreta' };
      }
      
      // Criar token simulado
      const mockToken = `mock_token_${mockUser.id}_${Date.now()}`;
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Verificar se usuário já existe
      const existingUser = findUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'Usuário já existe com este email' };
      }
      
      // Criar usuário mock
      const newUser = createMockUser(userData);
      
      // Criar token simulado
      const mockToken = `mock_token_${newUser.id}_${Date.now()}`;
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(newUser);
      
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro ao criar conta' };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  // Atualizar perfil do usuário
  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  // Verificar se está autenticado
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
