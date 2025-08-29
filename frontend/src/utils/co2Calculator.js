// Base de dados de emissões de CO₂ por categoria de item (em kg CO₂)
// Valores baseados em estudos científicos e dados de produção industrial

export const CO2_EMISSIONS = {
  // Eletrônicos (alto impacto)
  eletronicos: {
    smartphone: 85, // kg CO₂ por smartphone novo
    notebook: 422, // kg CO₂ por notebook novo
    tablet: 105, // kg CO₂ por tablet novo
    tv: 638, // kg CO₂ por TV nova
    computador: 500, // kg CO₂ por desktop novo
    default: 300 // valor padrão para outros eletrônicos
  },
  
  // Móveis (médio-alto impacto)
  moveis: {
    sofa: 260, // kg CO₂ por sofá novo
    mesa: 180, // kg CO₂ por mesa nova
    cadeira: 120, // kg CO₂ por cadeira nova
    cama: 200, // kg CO₂ por cama nova
    armario: 350, // kg CO₂ por armário novo
    default: 200 // valor padrão para outros móveis
  },
  
  // Roupas (médio impacto)
  roupas: {
    camiseta: 2.5, // kg CO₂ por camiseta nova
    calca: 23.5, // kg CO₂ por calça nova
    vestido: 15, // kg CO₂ por vestido novo
    casaco: 25, // kg CO₂ por casaco novo
    sapatos: 13.6, // kg CO₂ por par de sapatos novo
    default: 10 // valor padrão para outras roupas
  },
  
  // Livros (baixo-médio impacto)
  livros: {
    livro: 2.5, // kg CO₂ por livro novo
    revista: 1.2, // kg CO₂ por revista nova
    jornal: 0.3, // kg CO₂ por jornal
    default: 2 // valor padrão para outros materiais impressos
  },
  
  // Brinquedos (médio impacto)
  brinquedos: {
    bicicleta: 96, // kg CO₂ por bicicleta nova
    boneca: 3.5, // kg CO₂ por boneca nova
    carrinho: 5, // kg CO₂ por carrinho novo
    jogo: 8, // kg CO₂ por jogo novo
    default: 15 // valor padrão para outros brinquedos
  },
  
  // Esportes (médio-alto impacto)
  esportes: {
    bola: 12, // kg CO₂ por bola nova
    raquete: 25, // kg CO₂ por raquete nova
    patins: 45, // kg CO₂ por patins novos
    skate: 35, // kg CO₂ por skate novo
    default: 30 // valor padrão para outros equipamentos esportivos
  },
  
  // Casa (médio impacto)
  casa: {
    vaso: 8, // kg CO₂ por vaso novo
    toalha: 4, // kg CO₂ por toalha nova
    panela: 15, // kg CO₂ por panela nova
    prato: 2, // kg CO₂ por prato novo
    default: 10 // valor padrão para outros itens domésticos
  },
  
  // Jardinagem (baixo impacto)
  jardinagem: {
    ferramenta: 12, // kg CO₂ por ferramenta nova
    planta: 1, // kg CO₂ por planta nova
    vaso: 8, // kg CO₂ por vaso novo
    default: 8 // valor padrão para outros itens de jardinagem
  },
  
  // Automóveis (altíssimo impacto)
  automoveis: {
    carro: 5000, // kg CO₂ por carro novo (simplificado)
    moto: 1000, // kg CO₂ por moto nova
    bicicleta: 96, // kg CO₂ por bicicleta nova
    default: 2000 // valor padrão para outros veículos
  },
  
  // Outros (baixo impacto)
  outros: {
    default: 5 // valor padrão para itens não categorizados
  }
};

// Fatores de redução baseados na condição do item
export const CONDITION_FACTORS = {
  'novo': 0.95, // Item novo: 95% da economia (ainda economiza embalagem/transporte)
  'como-novo': 0.90, // Como novo: 90% da economia
  'bom': 0.85, // Bom estado: 85% da economia
  'regular': 0.70, // Estado regular: 70% da economia
  'precisa-reparo': 0.50 // Precisa reparo: 50% da economia
};

// Fatores de transporte local (em kg CO₂)
export const TRANSPORT_FACTORS = {
  local: 2, // Transporte local (carro pequeno)
  regional: 5, // Transporte regional
  nacional: 15 // Transporte nacional
};

/**
 * Calcula o CO₂ economizado por um item específico
 * @param {Object} item - Objeto do item
 * @returns {number} - kg de CO₂ economizados
 */
export const calculateItemCO2 = (item) => {
  const category = item.category;
  const condition = item.condition;
  const title = item.title.toLowerCase();
  
  // Buscar valor base de CO₂ para a categoria
  let baseCO2 = CO2_EMISSIONS[category]?.default || CO2_EMISSIONS.outros.default;
  
  // Tentar encontrar valor específico baseado no título
  if (CO2_EMISSIONS[category]) {
    for (const [key, value] of Object.entries(CO2_EMISSIONS[category])) {
      if (key !== 'default' && title.includes(key)) {
        baseCO2 = value;
        break;
      }
    }
  }
  
  // Aplicar fator de condição
  const conditionFactor = CONDITION_FACTORS[condition] || 0.8;
  const adjustedCO2 = baseCO2 * conditionFactor;
  
  // Subtrair emissões do transporte local
  const transportCO2 = TRANSPORT_FACTORS.local;
  
  // CO₂ economizado = produção evitada - transporte local
  const co2Saved = Math.max(0, adjustedCO2 - transportCO2);
  
  return Math.round(co2Saved * 10) / 10; // Arredondar para 1 casa decimal
};

/**
 * Calcula o CO₂ total economizado por uma lista de itens
 * @param {Array} items - Lista de itens
 * @returns {number} - kg de CO₂ economizados
 */
export const calculateTotalCO2 = (items) => {
  return items.reduce((total, item) => {
    return total + calculateItemCO2(item);
  }, 0);
};

/**
 * Calcula estatísticas detalhadas de CO₂
 * @param {Array} items - Lista de itens
 * @returns {Object} - Estatísticas detalhadas
 */
export const calculateCO2Stats = (items) => {
  const donatedItems = items.filter(item => item.status === 'donated');
  const totalCO2 = calculateTotalCO2(donatedItems);
  
  // Calcular por categoria
  const co2ByCategory = {};
  donatedItems.forEach(item => {
    const category = item.category;
    if (!co2ByCategory[category]) {
      co2ByCategory[category] = 0;
    }
    co2ByCategory[category] += calculateItemCO2(item);
  });
  
  // Encontrar categoria que mais economiza
  const topCategory = Object.entries(co2ByCategory)
    .sort(([,a], [,b]) => b - a)[0];
  
  return {
    totalCO2: Math.round(totalCO2),
    co2ByCategory,
    topCategory: topCategory ? {
      name: topCategory[0],
      co2: Math.round(topCategory[1])
    } : null,
    itemCount: donatedItems.length,
    averagePerItem: donatedItems.length > 0 ? Math.round(totalCO2 / donatedItems.length) : 0
  };
};

/**
 * Converte CO₂ em equivalentes mais compreensíveis
 * @param {number} co2Kg - kg de CO₂
 * @returns {Object} - Equivalências
 */
export const getCO2Equivalents = (co2Kg) => {
  return {
    trees: Math.round(co2Kg / 22), // 1 árvore absorve ~22kg CO₂/ano
    carKm: Math.round(co2Kg * 4), // 1kg CO₂ = ~4km de carro
    flights: Math.round(co2Kg / 100), // 1 voo curto = ~100kg CO₂
    smartphones: Math.round(co2Kg / 85), // 1 smartphone = ~85kg CO₂
    months: Math.round(co2Kg / 8.3) // 1 pessoa emite ~8.3kg CO₂/mês
  };
};
