# EcoConnect Frontend

Frontend da plataforma EcoConnect - Economia Circular desenvolvido em React.js.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **Material-UI (MUI)** - Framework de componentes React
- **React Router** - Roteamento da aplicação
- **React Query** - Gerenciamento de estado e cache
- **React Hook Form** - Formulários com validação
- **Axios** - Cliente HTTP
- **Framer Motion** - Animações
- **React Hot Toast** - Notificações
- **Socket.io Client** - Comunicação em tempo real

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.js       # Cabeçalho da aplicação
│   ├── Footer.js       # Rodapé da aplicação
│   └── ProtectedRoute.js # Rota protegida
├── pages/              # Páginas da aplicação
│   ├── Home.js         # Página inicial
│   ├── Login.js        # Página de login
│   ├── Register.js     # Página de registro
│   ├── Dashboard.js    # Dashboard do usuário
│   ├── Search.js       # Busca de itens
│   ├── ItemDetail.js   # Detalhes do item
│   ├── CreateItem.js   # Criar item
│   ├── Profile.js      # Perfil do usuário
│   └── Chat.js         # Chat
├── contexts/           # Contextos React
│   └── AuthContext.js  # Contexto de autenticação
├── services/           # Serviços de API
│   └── authService.js  # Serviço de autenticação
├── hooks/              # Custom hooks
├── utils/              # Utilitários
├── assets/             # Recursos estáticos
├── App.js              # Componente principal
└── index.js            # Ponto de entrada
```

## 🎨 Design System

### Cores
- **Primária**: Verde sustentável (#2E7D32)
- **Secundária**: Laranja para destaque (#FF6F00)
- **Background**: Cinza claro (#F5F5F5)

### Tipografia
- **Fonte**: Roboto
- **Hierarquia**: H1-H6 com pesos variados

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Executar em desenvolvimento:**
```bash
npm start
```

4. **Build para produção:**
```bash
npm run build
```

## 📱 Funcionalidades Implementadas

### ✅ Concluídas
- [x] Layout responsivo com Material-UI
- [x] Sistema de autenticação (login/registro)
- [x] Navegação entre páginas
- [x] Página inicial com hero section
- [x] Dashboard básico
- [x] Rotas protegidas
- [x] Tema personalizado
- [x] Animações com Framer Motion
- [x] Notificações com React Hot Toast

### 🚧 Em Desenvolvimento
- [ ] Busca e filtros de itens
- [ ] Sistema de chat em tempo real
- [ ] Upload de imagens
- [ ] Geolocalização
- [ ] Avaliações e reviews
- [ ] Notificações push

## 🔧 Scripts Disponíveis

- `npm start` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa testes
- `npm run eject` - Ejecta configurações do Create React App

## 🌐 Acesso

- **Desenvolvimento**: http://localhost:3000
- **API Backend**: http://localhost:5000

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Backend EcoConnect rodando

## 🔗 Integração com Backend

O frontend se comunica com o backend através da API REST em `http://localhost:5000/api`. Certifique-se de que o backend esteja rodando antes de executar o frontend.

## 📸 Screenshots

### Página Inicial
![Home Page](screenshots/home.png)

### Login
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**EcoConnect Team** - Projeto de Extensão Universitária

---

**Projeto de Extensão Universitária - Economia Sustentável através da Tecnologia**
