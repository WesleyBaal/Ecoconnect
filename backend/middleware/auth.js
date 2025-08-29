const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  // Obter token do header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  // Verificar se não há token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Token não fornecido.'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuário não encontrado.'
      });
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada.'
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};
