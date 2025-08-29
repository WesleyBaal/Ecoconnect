module.exports = {
  // Configurações do Servidor
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Banco de Dados
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoconnect'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'ecoconnect_super_secret_key_2024_change_in_production',
    expiresIn: '7d'
  },

  // Google Maps API
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || 'your_google_maps_api_key_here'
  },

  // Upload de Imagens
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880 // 5MB
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutos
    maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100
  },

  // Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
