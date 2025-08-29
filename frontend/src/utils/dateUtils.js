// Função para formatar data e hora de forma amigável
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Se foi há menos de 1 minuto
  if (diffInMinutes < 1) {
    return 'Agora mesmo';
  }
  
  // Se foi há menos de 1 hora
  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  // Se foi há menos de 24 horas
  if (diffInHours < 24) {
    return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  
  // Se foi há menos de 7 dias
  if (diffInDays < 7) {
    return `Há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
  }
  
  // Se foi há mais de 7 dias, mostrar data completa
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Função para formatar apenas a data
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para formatar data e hora completa
export const formatFullDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Função para verificar se é hoje
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Função para verificar se foi ontem
export const isYesterday = (dateString) => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};
