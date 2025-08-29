<<<<<<< HEAD
# 🔒 Segurança do EcoConnect

## 🛡️ Medidas de Segurança Implementadas

### **1. Autenticação e Autorização**
- ✅ **JWT Tokens** com expiração de 7 dias
- ✅ **Bcrypt** para hash de senhas (12 rounds)
- ✅ **Validação de tokens** em todas as rotas protegidas
- ✅ **Rate limiting** específico para login (5 tentativas/15min)

### **2. Proteção contra Ataques**
- ✅ **Rate Limiting** global (100 requests/15min por IP)
- ✅ **Helmet** para headers de segurança
- ✅ **CORS** configurado adequadamente
- ✅ **Sanitização de dados** para prevenir XSS
- ✅ **Validação de entrada** com Joi

### **3. Upload de Arquivos**
- ✅ **Validação de tipo** (apenas JPEG, PNG, WebP)
- ✅ **Limite de tamanho** (5MB por arquivo)
- ✅ **Rate limiting** para uploads (10/hora)
- ✅ **Sanitização de nomes** de arquivos

### **4. Logs e Monitoramento**
- ✅ **Logs de segurança** para todas as requisições
- ✅ **Logs específicos** para tentativas de login
- ✅ **Logs de erro** sem exposição de dados sensíveis
- ✅ **Monitoramento** de IPs suspeitos

### **5. Configuração de Produção**
- ✅ **Variáveis de ambiente** para configurações sensíveis
- ✅ **Headers de segurança** configurados
- ✅ **Tratamento de erros** sem exposição de dados
- ✅ **CORS restrito** para domínios específicos

## 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` no backend com:

```env
# Configurações de Segurança
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024_ecoconnect
NODE_ENV=production

# Configurações CORS (produção)
ALLOWED_ORIGINS=https://seu-dominio.vercel.app

# Configurações de Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

# Configurações de Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

## 🚨 Checklist de Segurança para Deploy

### **Antes do Deploy:**
- [ ] Alterar `JWT_SECRET` para uma chave forte
- [ ] Configurar `NODE_ENV=production`
- [ ] Definir `ALLOWED_ORIGINS` corretamente
- [ ] Configurar HTTPS no servidor
- [ ] Configurar firewall se necessário

### **Após o Deploy:**
- [ ] Testar rate limiting
- [ ] Verificar logs de segurança
- [ ] Testar upload de arquivos
- [ ] Verificar headers de segurança
- [ ] Monitorar tentativas de acesso

## 📊 Monitoramento de Segurança

### **Logs Importantes:**
- Tentativas de login
- Uploads de arquivos
- Requisições com erro 404
- Requisições bloqueadas por rate limiting

### **Alertas Recomendados:**
- Múltiplas tentativas de login do mesmo IP
- Uploads de arquivos suspeitos
- Requisições com padrões anômalos

## 🔐 Boas Práticas

### **Para Desenvolvedores:**
1. Nunca commitar arquivos `.env`
2. Sempre validar entrada de dados
3. Usar HTTPS em produção
4. Manter dependências atualizadas
5. Fazer backup regular dos dados

### **Para Usuários:**
1. Usar senhas fortes
2. Não compartilhar tokens
3. Fazer logout em dispositivos públicos
4. Reportar comportamentos suspeitos

## 🆘 Em Caso de Incidente

1. **Imediato:**
   - Bloquear IPs suspeitos
   - Revogar tokens se necessário
   - Verificar logs de segurança

2. **Análise:**
   - Identificar origem do ataque
   - Avaliar impacto nos dados
   - Documentar incidente

3. **Recuperação:**
   - Implementar medidas adicionais
   - Notificar usuários se necessário
   - Atualizar documentação

## 📞 Contato de Segurança

Para reportar vulnerabilidades de segurança:
- Email: security@ecoconnect.com
- GitHub Issues: [Link para issues]
- Discord: [Link do servidor]

---

**Última atualização:** Janeiro 2024
**Versão:** 1.0.0
=======
# 🔒 Segurança do EcoConnect

## 🛡️ Medidas de Segurança Implementadas

### **1. Autenticação e Autorização**
- ✅ **JWT Tokens** com expiração de 7 dias
- ✅ **Bcrypt** para hash de senhas (12 rounds)
- ✅ **Validação de tokens** em todas as rotas protegidas
- ✅ **Rate limiting** específico para login (5 tentativas/15min)

### **2. Proteção contra Ataques**
- ✅ **Rate Limiting** global (100 requests/15min por IP)
- ✅ **Helmet** para headers de segurança
- ✅ **CORS** configurado adequadamente
- ✅ **Sanitização de dados** para prevenir XSS
- ✅ **Validação de entrada** com Joi

### **3. Upload de Arquivos**
- ✅ **Validação de tipo** (apenas JPEG, PNG, WebP)
- ✅ **Limite de tamanho** (5MB por arquivo)
- ✅ **Rate limiting** para uploads (10/hora)
- ✅ **Sanitização de nomes** de arquivos

### **4. Logs e Monitoramento**
- ✅ **Logs de segurança** para todas as requisições
- ✅ **Logs específicos** para tentativas de login
- ✅ **Logs de erro** sem exposição de dados sensíveis
- ✅ **Monitoramento** de IPs suspeitos

### **5. Configuração de Produção**
- ✅ **Variáveis de ambiente** para configurações sensíveis
- ✅ **Headers de segurança** configurados
- ✅ **Tratamento de erros** sem exposição de dados
- ✅ **CORS restrito** para domínios específicos

## 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` no backend com:

```env
# Configurações de Segurança
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024_ecoconnect
NODE_ENV=production

# Configurações CORS (produção)
ALLOWED_ORIGINS=https://seu-dominio.vercel.app

# Configurações de Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

# Configurações de Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

## 🚨 Checklist de Segurança para Deploy

### **Antes do Deploy:**
- [ ] Alterar `JWT_SECRET` para uma chave forte
- [ ] Configurar `NODE_ENV=production`
- [ ] Definir `ALLOWED_ORIGINS` corretamente
- [ ] Configurar HTTPS no servidor
- [ ] Configurar firewall se necessário

### **Após o Deploy:**
- [ ] Testar rate limiting
- [ ] Verificar logs de segurança
- [ ] Testar upload de arquivos
- [ ] Verificar headers de segurança
- [ ] Monitorar tentativas de acesso

## 📊 Monitoramento de Segurança

### **Logs Importantes:**
- Tentativas de login
- Uploads de arquivos
- Requisições com erro 404
- Requisições bloqueadas por rate limiting

### **Alertas Recomendados:**
- Múltiplas tentativas de login do mesmo IP
- Uploads de arquivos suspeitos
- Requisições com padrões anômalos

## 🔐 Boas Práticas

### **Para Desenvolvedores:**
1. Nunca commitar arquivos `.env`
2. Sempre validar entrada de dados
3. Usar HTTPS em produção
4. Manter dependências atualizadas
5. Fazer backup regular dos dados

### **Para Usuários:**
1. Usar senhas fortes
2. Não compartilhar tokens
3. Fazer logout em dispositivos públicos
4. Reportar comportamentos suspeitos

## 🆘 Em Caso de Incidente

1. **Imediato:**
   - Bloquear IPs suspeitos
   - Revogar tokens se necessário
   - Verificar logs de segurança

2. **Análise:**
   - Identificar origem do ataque
   - Avaliar impacto nos dados
   - Documentar incidente

3. **Recuperação:**
   - Implementar medidas adicionais
   - Notificar usuários se necessário
   - Atualizar documentação

## 📞 Contato de Segurança

Para reportar vulnerabilidades de segurança:
- Email: security@ecoconnect.com
- GitHub Issues: [Link para issues]
- Discord: [Link do servidor]

---

**Última atualização:** Janeiro 2024
**Versão:** 1.0.0
>>>>>>> 9d7e5f2ce7952b91650bed567928a384f31e471f
