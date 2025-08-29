const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Importar configuração do banco de dados
const db = require('./config/database');

// Importar middlewares de segurança
const {
  limiter,
  corsOptions,
  securityLogger,
  sanitizeData
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());

// Rate limiting global
app.use(limiter);

// CORS configurado
app.use(cors(corsOptions));

// Logs de segurança
app.use(securityLogger);

// Sanitização de dados
app.use(sanitizeData);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Banco de dados SQLite já está configurado
console.log('✅ Banco de dados SQLite conectado');

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: '🌱 EcoConnect API - Plataforma de Economia Circular',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    security: 'enabled'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.ip} - ${req.method} ${req.url} - ${err.message}`);
  
  // Não expor detalhes de erro em produção
  const errorResponse = {
    success: false,
    message: 'Erro interno do servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
});

// Rota 404
app.use('*', (req, res) => {
  console.log(`[404] ${req.ip} - ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}`);
  console.log(`🛡️  Segurança habilitada`);
  console.log(`🌱 EcoConnect - Economia Sustentável através da Tecnologia`);
});

module.exports = app;
