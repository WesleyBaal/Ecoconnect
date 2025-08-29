const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// @route   GET /api/items
// @desc    Buscar todos os itens disponíveis
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      condition,
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Construir query base
    let query = 'SELECT i.*, u.name as user_name, u.avatar as user_avatar FROM items i JOIN users u ON i.user_id = u.id WHERE i.status = "available"';
    const params = [];

    // Adicionar filtros
    if (category) {
      query += ' AND i.category = ?';
      params.push(category);
    }

    if (condition) {
      query += ' AND i.condition = ?';
      params.push(condition);
    }

    if (search) {
      query += ' AND (i.title LIKE ? OR i.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Adicionar ordenação e paginação
    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    // Executar query
    const items = db.prepare(query).all(...params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM items i WHERE i.status = "available"';
    const countParams = [];

    if (category) {
      countQuery += ' AND i.category = ?';
      countParams.push(category);
    }

    if (condition) {
      countQuery += ' AND i.condition = ?';
      countParams.push(condition);
    }

    if (search) {
      countQuery += ' AND (i.title LIKE ? OR i.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const total = db.prepare(countQuery).get(...countParams).total;

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/items/:id
// @desc    Buscar item específico
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = db.prepare(`
      SELECT i.*, u.name as user_name, u.avatar as user_avatar, u.bio as user_bio
      FROM items i 
      JOIN users u ON i.user_id = u.id 
      WHERE i.id = ?
    `).get(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    res.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Erro ao buscar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/items
// @desc    Criar novo item
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter entre 3 e 100 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  body('category')
    .isIn(['eletronicos', 'moveis', 'roupas', 'livros', 'brinquedos', 'esportes', 'casa', 'jardinagem', 'automoveis', 'outros'])
    .withMessage('Categoria inválida'),
  body('condition')
    .isIn(['novo', 'como-novo', 'bom', 'regular', 'precisa-reparo'])
    .withMessage('Condição inválida')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Verificar token (simplificado)
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const {
      title,
      description,
      category,
      condition,
      images,
      location
    } = req.body;

    // Inserir item
    const stmt = db.prepare(`
      INSERT INTO items (title, description, category, condition, images, location, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, description, category, condition, images || null, location || null, decoded.user.id);
    const itemId = result.lastInsertRowid;

    // Buscar item criado
    const newItem = db.prepare(`
      SELECT i.*, u.name as user_name, u.avatar as user_avatar
      FROM items i 
      JOIN users u ON i.user_id = u.id 
      WHERE i.id = ?
    `).get(itemId);

    res.status(201).json({
      success: true,
      message: 'Item criado com sucesso!',
      data: newItem
    });

  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   PUT /api/items/:id
// @desc    Atualizar item
// @access  Private
router.put('/:id', [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter entre 3 e 100 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  body('category')
    .isIn(['eletronicos', 'moveis', 'roupas', 'livros', 'brinquedos', 'esportes', 'casa', 'jardinagem', 'automoveis', 'outros'])
    .withMessage('Categoria inválida'),
  body('condition')
    .isIn(['novo', 'como-novo', 'bom', 'regular', 'precisa-reparo'])
    .withMessage('Condição inválida')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Verificar token
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Verificar se item existe e pertence ao usuário
    const existingItem = db.prepare('SELECT * FROM items WHERE id = ? AND user_id = ?').get(req.params.id, decoded.user.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado ou não autorizado'
      });
    }

    const {
      title,
      description,
      category,
      condition,
      images,
      location,
      status
    } = req.body;

    // Atualizar item
    const stmt = db.prepare(`
      UPDATE items 
      SET title = ?, description = ?, category = ?, condition = ?, images = ?, location = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(title, description, category, condition, images || null, location || null, status || 'available', req.params.id);

    // Buscar item atualizado
    const updatedItem = db.prepare(`
      SELECT i.*, u.name as user_name, u.avatar as user_avatar
      FROM items i 
      JOIN users u ON i.user_id = u.id 
      WHERE i.id = ?
    `).get(req.params.id);

    res.json({
      success: true,
      message: 'Item atualizado com sucesso!',
      data: updatedItem
    });

  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   DELETE /api/items/:id
// @desc    Deletar item
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Verificar token
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Verificar se item existe e pertence ao usuário
    const existingItem = db.prepare('SELECT * FROM items WHERE id = ? AND user_id = ?').get(req.params.id, decoded.user.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado ou não autorizado'
      });
    }

    // Deletar item
    db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Item deletado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
