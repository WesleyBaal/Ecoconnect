const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Mensagem não pode estar vazia'],
    maxlength: [1000, 'Mensagem não pode ter mais de 1000 caracteres']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'location'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Índices para melhor performance
chatSchema.index({ participants: 1 });
chatSchema.index({ item: 1 });
chatSchema.index({ lastMessage: -1 });
chatSchema.index({ 'participants': 1, 'lastMessage': -1 });

// Virtual para obter o outro participante
chatSchema.virtual('otherParticipant').get(function() {
  return this.participants.filter(p => p.toString() !== this.currentUser?.toString())[0];
});

// Middleware para atualizar lastMessage quando nova mensagem é adicionada
chatSchema.pre('save', function(next) {
  if (this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1].createdAt;
  }
  next();
});

// Método para adicionar mensagem
chatSchema.methods.addMessage = function(senderId, content, messageType = 'text') {
  const message = {
    sender: senderId,
    content,
    messageType,
    isRead: false
  };
  
  this.messages.push(message);
  
  // Atualizar contador de mensagens não lidas para o outro participante
  const otherParticipant = this.participants.find(p => p.toString() !== senderId.toString());
  if (otherParticipant) {
    const currentCount = this.unreadCount.get(otherParticipant.toString()) || 0;
    this.unreadCount.set(otherParticipant.toString(), currentCount + 1);
  }
  
  return this.save();
};

// Método para marcar mensagens como lidas
chatSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId.toString() && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
    }
  });
  
  // Resetar contador de mensagens não lidas
  this.unreadCount.set(userId.toString(), 0);
  
  return this.save();
};

// Método para obter mensagens não lidas
chatSchema.methods.getUnreadCount = function(userId) {
  return this.unreadCount.get(userId.toString()) || 0;
};

// Método estático para encontrar ou criar chat
chatSchema.statics.findOrCreateChat = async function(user1Id, user2Id, itemId) {
  let chat = await this.findOne({
    participants: { $all: [user1Id, user2Id] },
    item: itemId,
    isActive: true
  }).populate('participants', 'name avatar');
  
  if (!chat) {
    chat = new this({
      participants: [user1Id, user2Id],
      item: itemId,
      messages: [],
      unreadCount: new Map()
    });
    await chat.save();
    chat = await chat.populate('participants', 'name avatar');
  }
  
  return chat;
};

// Método estático para buscar chats de um usuário
chatSchema.statics.findUserChats = function(userId) {
  return this.find({
    participants: userId,
    isActive: true
  })
  .populate('participants', 'name avatar')
  .populate('item', 'title images category')
  .sort({ lastMessage: -1 });
};

// Método estático para buscar chat específico
chatSchema.statics.findChatById = function(chatId, userId) {
  return this.findOne({
    _id: chatId,
    participants: userId,
    isActive: true
  })
  .populate('participants', 'name avatar')
  .populate('item', 'title images category donor recipient status')
  .populate('messages.sender', 'name avatar');
};

module.exports = mongoose.model('Chat', chatSchema);
