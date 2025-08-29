const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Importar middlewares de segurança
const {
  loginLimiter,
  validateUser,
  validateLogin
} = require('../middleware/security');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', validateUser, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      bio
    } = req.body;

    // Verificar se usuário já existe
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe com este email'
      });
    }

    // Criptografar senha
    const salt = await bcrypt.genSalt(12); // Aumentado para 12 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir novo usuário
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, address, city, state, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, email, hashedPassword, phone || null, address || null, city || null, state || null, bio || null);
    
    const userId = result.lastInsertRowid;

    // Buscar usuário criado
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    // Gerar token JWT com expiração mais segura
    const payload = {
      user: {
        id: newUser.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { 
        expiresIn: '7d',
        issuer: 'ecoconnect',
        audience: 'ecoconnect-users'
      },
      (err, token) => {
        if (err) throw err;
        
        // Remover senha do objeto de resposta
        const { password, ...userWithoutPassword } = newUser;
        
        res.json({
          success: true,
          message: 'Usuário registrado com sucesso!',
          token,
          user: userWithoutPassword
        });
      }
    );

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário
// @access  Public
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { 
        expiresIn: '7d',
        issuer: 'ecoconnect',
        audience: 'ecoconnect-users'
      },
      (err, token) => {
        if (err) throw err;
        
        // Remover senha do objeto de resposta
        const { password, ...userWithoutPassword } = user;
        
        res.json({
          success: true,
          message: 'Login realizado com sucesso!',
          token,
          user: userWithoutPassword
        });
      }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Verificar token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Buscar usuário
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Remover senha do objeto de resposta
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', validateUser, async (req, res) => {
  try {
    // Verificar token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      bio
    } = req.body;

    // Verificar se email já existe (exceto para o usuário atual)
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? AND id != ?').get(email, decoded.user.id);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Atualizar usuário
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, bio = ?
      WHERE id = ?
    `);
    
    stmt.run(name, email, phone || null, address || null, city || null, state || null, bio || null, decoded.user.id);

    // Buscar usuário atualizado
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.user.id);

    // Remover senha do objeto de resposta
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso!',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
