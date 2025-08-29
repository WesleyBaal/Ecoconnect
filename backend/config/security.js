module.exports = {
  // Configurações JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_aqui_2024_ecoconnect',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'ecoconnect',
    audience: 'ecoconnect-users'
  },

  // Configurações de Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5,
    uploadMax: 10
  },

  // Configurações de Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    maxFiles: 5
  },

  // Configurações CORS
  cors: {
    origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // Configurações de Log
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableSecurityLogs: process.env.ENABLE_SECURITY_LOGS !== 'false'
  },

  // Configurações de Sanitização
  sanitization: {
    maxStringLength: 1000,
    allowedHtmlTags: [], // Nenhuma tag HTML permitida
    allowedAttributes: [] // Nenhum atributo permitido
  }
};
