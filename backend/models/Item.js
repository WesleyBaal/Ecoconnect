const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título não pode ter mais de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: [
      'eletronicos',
      'moveis',
      'roupas',
      'livros',
      'brinquedos',
      'esportes',
      'casa',
      'jardinagem',
      'automoveis',
      'outros'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Condição é obrigatória'],
    enum: ['novo', 'como-novo', 'bom', 'regular', 'precisa-reparo']
  },
  images: [{
    type: String,
    required: [true, 'Pelo menos uma imagem é obrigatória']
  }],
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doador é obrigatório']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['disponivel', 'reservado', 'doado', 'cancelado'],
    default: 'disponivel'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Endereço é obrigatório']
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória']
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  pickupInstructions: {
    type: String,
    maxlength: [200, 'Instruções não podem ter mais de 200 caracteres']
  },
  availability: {
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    pickupTime: {
      type: String
    }
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  donatedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para melhor performance
itemSchema.index({ status: 1, category: 1 });
itemSchema.index({ 'location.coordinates': '2dsphere' });
itemSchema.index({ donor: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual para calcular tempo desde a publicação
itemSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return `${Math.floor(days / 365)} anos atrás`;
});

// Virtual para verificar se está disponível
itemSchema.virtual('isAvailable').get(function() {
  return this.status === 'disponivel' && this.isActive;
});

// Middleware para atualizar contadores quando item é doado
itemSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'doado') {
    this.donatedAt = new Date();
    
    // Incrementar contador de itens doados do doador
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.donor, { $inc: { itemsDonated: 1 } });
    
    // Incrementar contador de itens recebidos do receptor
    if (this.recipient) {
      await User.findByIdAndUpdate(this.recipient, { $inc: { itemsReceived: 1 } });
    }
  }
  next();
});

// Método para incrementar visualizações
itemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para adicionar/remover favorito
itemSchema.methods.toggleFavorite = function(userId) {
  const index = this.favorites.indexOf(userId);
  if (index > -1) {
    this.favorites.splice(index, 1);
  } else {
    this.favorites.push(userId);
  }
  return this.save();
};

// Método para reservar item
itemSchema.methods.reserve = function(recipientId) {
  this.status = 'reservado';
  this.recipient = recipientId;
  return this.save();
};

// Método para doar item
itemSchema.methods.donate = function() {
  this.status = 'doado';
  this.donatedAt = new Date();
  return this.save();
};

// Método para cancelar item
itemSchema.methods.cancel = function() {
  this.status = 'cancelado';
  this.recipient = null;
  return this.save();
};

// Método estático para buscar itens próximos
itemSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'disponivel',
    isActive: true
  });
};

// Método estático para buscar por categoria
itemSchema.statics.findByCategory = function(category) {
  return this.find({
    category,
    status: 'disponivel',
    isActive: true
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Item', itemSchema);
