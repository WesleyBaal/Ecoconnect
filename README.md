<<<<<<< HEAD
# 🌱 EcoConnect - Plataforma de Economia Circular

## 📋 Descrição do Projeto

O **EcoConnect** é uma plataforma web inovadora que promove a economia circular conectando pessoas que desejam doar itens usados com aqueles que precisam deles. O projeto visa reduzir o desperdício, promover a sustentabilidade e criar uma comunidade consciente sobre o consumo responsável.

## 🎯 Objetivos

- **Sustentabilidade**: Reduzir desperdício através da reutilização de itens
- **Comunidade**: Criar conexões entre pessoas com valores sustentáveis
- **Tecnologia**: Aplicar desenvolvimento web moderno para solução social
- **Impacto**: Demonstrar como tecnologia pode promover economia sustentável

## 🚀 Acesso à Aplicação

### 🌐 Acesse a aplicação online:
(em breve disponível via GitHub Pages ou outro serviço)

### 📱 Teste o app agora:
<!-- Link removido, será atualizado após novo deploy -->

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** - Interface moderna e responsiva
- **Material-UI** - Componentes visuais profissionais
- **Google Maps API** - Geolocalização para encontrar itens próximos
- **Axios** - Comunicação com backend

### Backend
- **Node.js** - Servidor JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados local
- **JWT** - Autenticação segura
- **Multer** - Upload de imagens

## 🚀 Funcionalidades

### ✅ Implementadas
- [x] Cadastro e login de usuários
- [x] Publicação de itens para doação
- [x] Busca e filtros por categoria/localização
- [x] Sistema de chat entre usuários
- [x] Upload de imagens
- [x] Dashboard com estatísticas
- [x] Sistema de avaliações

## 🏃‍♂️ Como Executar Localmente

### Pré-requisitos
- Node.js 16+
- Conta Google Cloud (para Maps API) - opcional

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/WesleyBaal/Ecoconnect.git
cd ecoconnect
```

2. **Instale as dependências**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `backend/`:
```bash
# Backend (.env)
PORT=5000
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development

# Opcional - Google Maps API
GOOGLE_MAPS_API_KEY=sua_api_key_google_maps
```

Crie um arquivo `.env` na pasta `frontend/`:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=sua_api_key_google_maps
```

4. **Execute o projeto**
```bash
# Backend (terminal 1)
cd backend
npm start

# Frontend (terminal 2)
cd frontend
npm start
```

5. **Acesse a aplicação online**
<!-- Links removidos, será atualizado após novo deploy -->

## 🔒 Segurança

O projeto inclui várias medidas de segurança:
- Autenticação JWT
- Rate limiting
- Sanitização de dados
- Headers de segurança (Helmet)
- CORS configurado
- Validação de entrada

## 📊 Impacto Esperado

### Ambiental
- Redução de 30% no descarte de itens reutilizáveis
- Economia de recursos naturais
- Diminuição da pegada de carbono

### Social
- Criação de comunidade sustentável
- Ajuda mútua entre vizinhos
- Conscientização sobre consumo

### Econômico
- Economia para famílias
- Redução de custos de descarte
- Promoção de economia local

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Importante

- **Nunca commite** arquivos `.env` ou o banco de dados
- Mantenha suas chaves de API seguras
- O banco de dados SQLite é criado automaticamente na primeira execução

---

=======
# 🌱 EcoConnect - Plataforma de Economia Circular

## 📋 Descrição do Projeto

O **EcoConnect** é uma plataforma web inovadora que promove a economia circular conectando pessoas que desejam doar itens usados com aqueles que precisam deles. O projeto visa reduzir o desperdício, promover a sustentabilidade e criar uma comunidade consciente sobre o consumo responsável.

## 🎯 Objetivos

- **Sustentabilidade**: Reduzir desperdício através da reutilização de itens
- **Comunidade**: Criar conexões entre pessoas com valores sustentáveis
- **Tecnologia**: Aplicar desenvolvimento web moderno para solução social
- **Impacto**: Demonstrar como tecnologia pode promover economia sustentável

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** - Interface moderna e responsiva
- **Material-UI** - Componentes visuais profissionais
- **Google Maps API** - Geolocalização para encontrar itens próximos
- **Axios** - Comunicação com backend

### Backend
- **Node.js** - Servidor JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados local
- **JWT** - Autenticação segura
- **Multer** - Upload de imagens

## 🚀 Funcionalidades

### ✅ Implementadas
- [x] Cadastro e login de usuários
- [x] Publicação de itens para doação
- [x] Busca e filtros por categoria/localização
- [x] Sistema de chat entre usuários
- [x] Upload de imagens
- [x] Dashboard com estatísticas
- [x] Sistema de avaliações

## 🏃‍♂️ Como Executar

### Pré-requisitos
- Node.js 16+
- Conta Google Cloud (para Maps API) - opcional

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/ecoconnect.git
cd ecoconnect
```

2. **Instale as dependências**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `backend/`:
```bash
# Backend (.env)
PORT=5000
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development

# Opcional - Google Maps API
GOOGLE_MAPS_API_KEY=sua_api_key_google_maps
```

Crie um arquivo `.env` na pasta `frontend/`:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=sua_api_key_google_maps
```

4. **Execute o projeto**
```bash
# Backend (terminal 1)
cd backend
npm start

# Frontend (terminal 2)
cd frontend
npm start
```

5. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔒 Segurança

O projeto inclui várias medidas de segurança:
- Autenticação JWT
- Rate limiting
- Sanitização de dados
- Headers de segurança (Helmet)
- CORS configurado
- Validação de entrada

## 📊 Impacto Esperado

### Ambiental
- Redução de 30% no descarte de itens reutilizáveis
- Economia de recursos naturais
- Diminuição da pegada de carbono

### Social
- Criação de comunidade sustentável
- Ajuda mútua entre vizinhos
- Conscientização sobre consumo

### Econômico
- Economia para famílias
- Redução de custos de descarte
- Promoção de economia local

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Importante

- **Nunca commite** arquivos `.env` ou o banco de dados
- Mantenha suas chaves de API seguras
- O banco de dados SQLite é criado automaticamente na primeira execução

---

**Desenvolvido com ❤️ para promover Economia Sustentável através da Tecnologia**
>>>>>>> 9d7e5f2ce7952b91650bed567928a384f31e471f
