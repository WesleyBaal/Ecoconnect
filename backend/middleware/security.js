const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const Joi = require('joi');

// Rate limiting para prevenir ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para upload de imagens
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 uploads por hora
  message: {
    error: 'Limite de uploads excedido. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuração CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio.vercel.app'] // Substitua pelo seu domínio
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Schemas de validação
const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  phone: Joi.string().pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/).optional(),
  address: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().length(2).optional(),
  bio: Joi.string().max(500).optional(),
});

const itemSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string().valid(
    'eletronicos', 'moveis', 'roupas', 'livros', 
    'brinquedos', 'esportes', 'casa', 'jardinagem', 
    'automoveis', 'outros'
  ).required(),
  condition: Joi.string().valid(
    'novo', 'como-novo', 'bom', 'regular', 'precisa-reparo'
  ).required(),
  location: Joi.string().max(100).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware de validação
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: error.details[0].message
    });
  }
  next();
};

const validateItem = (req, res, next) => {
  const { error } = itemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: error.details[0].message
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: error.details[0].message
    });
  }
  next();
};

// Middleware para validar upload de imagens
const validateImageUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (let file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Tipo de arquivo não permitido. Use apenas JPEG, PNG ou WebP.' 
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: 'Arquivo muito grande. Máximo 5MB por imagem.' 
      });
    }
  }

  next();
};

// Middleware para sanitizar dados
const sanitizeData = (req, res, next) => {
  // Sanitizar strings para prevenir XSS
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      }
    });
  }
  next();
};

// Middleware para logs de segurança
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent');

  console.log(`[${timestamp}] ${ip} ${method} ${url} - ${userAgent}`);

  // Log de tentativas suspeitas
  if (req.url.includes('/login') && req.method === 'POST') {
    console.log(`[LOGIN ATTEMPT] ${ip} - ${timestamp}`);
  }

  next();
};

module.exports = {
  limiter,
  loginLimiter,
  uploadLimiter,
  corsOptions,
  validateUser,
  validateItem,
  validateLogin,
  validateImageUpload,
  sanitizeData,
  securityLogger,
};
