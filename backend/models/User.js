const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [50, 'Nome não pode ter mais de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Telefone inválido']
  },
  address: {
    street: {
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
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio não pode ter mais de 200 caracteres']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  itemsDonated: {
    type: Number,
    default: 0
  },
  itemsReceived: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para melhor performance
userSchema.index({ email: 1 });
userSchema.index({ 'address.coordinates': '2dsphere' });
userSchema.index({ rating: -1 });

// Virtual para calcular rating médio
userSchema.virtual('averageRating').get(function() {
  return this.totalRatings > 0 ? (this.rating / this.totalRatings).toFixed(1) : 0;
});

// Middleware para criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para atualizar rating
userSchema.methods.updateRating = function(newRating) {
  this.totalRatings += 1;
  this.rating += newRating;
  return this.save();
};

// Método para incrementar itens doados
userSchema.methods.incrementDonatedItems = function() {
  this.itemsDonated += 1;
  return this.save();
};

// Método para incrementar itens recebidos
userSchema.methods.incrementReceivedItems = function() {
  this.itemsReceived += 1;
  return this.save();
};

// Método para obter dados públicos do usuário
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
