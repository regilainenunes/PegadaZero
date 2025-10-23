# 🌱 PegadaZero - Plataforma de Cálculo de Pegada de Carbono

<div align="center">
  <img src="./public/LogoPegadaZero1.svg" alt="PegadaZero Logo" width="200"/>
  
  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
  [![Supabase](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.com/)
  [![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
  [![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Python](https://img.shields.io/badge/Language-Python-yellow?logo=python)](https://www.python.org/)
</div>

## 📋 Sobre o Projeto

O **PegadaZero** é uma plataforma moderna e intuitiva para cálculo, monitoramento e redução da pegada de carbono. Desenvolvida com tecnologias de ponta, oferece uma experiência completa para indivíduos e empresas que desejam contribuir para um futuro mais sustentável.

### 🎯 Principais Funcionalidades

- **Cálculo Preciso**: Algoritmos científicos para cálculo de emissões de CO₂
- **Dashboard Interativo**: Visualização de dados com gráficos e métricas
- **Relatórios Detalhados**: Análises personalizadas e exportação de dados
- **Metas Sustentáveis**: Definição e acompanhamento de objetivos de redução
- **Multi-usuário**: Suporte para indivíduos e organizações
- **Histórico Completo**: Acompanhamento da evolução das emissões

## 🚀 Preview da Aplicação

### 🏠 Página Inicial
![Homepage Preview](https://via.placeholder.com/800x400/2BA84A/FFFFFF?text=PegadaZero+Homepage)

### 📊 Dashboard
![Dashboard Preview](https://via.placeholder.com/800x400/007E80/FFFFFF?text=Dashboard+Interativo)

### 📈 Relatórios
![Reports Preview](https://via.placeholder.com/800x400/C4EAD0/004D1C?text=Relatórios+Detalhados)

> **🔗 Demo Online**: [https://pegadazero.vercel.app](https://pegadazero.vercel.app)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Recharts** para gráficos interativos

### Backend
- **FastAPI** (Python) para API REST
- **Supabase** como banco PostgreSQL
- **JWT** para autenticação
- **Pydantic** para validação de dados
- **Bcrypt** para hash de senhas

### Deploy e Infraestrutura
- **Vercel** para hospedagem (frontend + backend)
- **Supabase** para banco de dados PostgreSQL
- **GitHub Actions** para CI/CD
- **Vercel Analytics** para monitoramento

## 🎨 Identidade Visual

### Paleta de Cores
- **Verde Folha**: `#2BA84A` - Cor principal vibrante
- **Azul Esverdeado**: `#007E80` - Transições e acentos
- **Verde Escuro**: `#004D1C` - Textos e elementos principais
- **Verde Claro**: `#C4EAD0` - Backgrounds suaves e reflexos
- **Branco**: `#FFFFFF` - Fundos e áreas neutras

### Logos Disponíveis
- `LogoPegadaZero1.svg` - Logo principal
- `LogoPegadaZero_branco.png` - Logo para fundos escuros
- `IconPegadaZero.svg` - Ícone do PegadaZero
- `IconPegadaZero.png` - Ícone para favicon e apps

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Python 3.11+
- Conta no Supabase
- Conta no Vercel (para deploy)

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/PegadaZero.git
cd PegadaZero
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com suas credenciais
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_ANON_KEY=sua-chave-aqui
# JWT_SECRET=sua-chave-jwt-secreta
```

### 3. Instalar Dependências
```bash
# Frontend
npm install

# Backend (se executar localmente)
pip install -r requirements.txt
```

### 4. Configurar Banco de Dados
1. Criar projeto no [Supabase](https://supabase.com/)
2. Executar o script `supabase_setup.sql` no SQL Editor
3. Obter URL e chave anônima do projeto

### 5. Executar em Desenvolvimento
```bash
# Frontend (porta 3000)
npm run dev

# Backend local (opcional - porta 8000)
cd api && python -m uvicorn index:app --reload
```

## 📦 Deploy em Produção

### Deploy Automático no Vercel

1. **Conectar Repositório**:
   - Acesse [vercel.com](https://vercel.com/)
   - Importe o repositório GitHub
   - Configure as variáveis de ambiente

2. **Configurar Supabase**:
   - Criar projeto no Supabase
   - Executar script SQL de configuração
   - Obter credenciais de acesso

3. **Deploy Automático**:
   - Push para `main` = deploy automático
   - Preview em pull requests
   - Logs em tempo real

📖 **Guia Completo**: Veja [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) para instruções detalhadas.

## 📊 Estrutura do Projeto

```
PegadaZero/
├── 📁 api/                    # Backend FastAPI
│   └── index.py              # API principal
├── 📁 src/                   # Frontend React
│   ├── 📁 components/        # Componentes reutilizáveis
│   ├── 📁 pages/            # Páginas da aplicação
│   ├── 📁 services/         # Serviços e API calls
│   └── 📁 styles/           # Estilos globais
├── 📁 public/               # Assets estáticos
├── 📄 vercel.json           # Configuração Vercel
├── 📄 supabase_setup.sql    # Script do banco
└── 📄 requirements.txt      # Dependências Python
```

## 🔐 Segurança

- **Autenticação JWT** com tokens seguros
- **Row Level Security (RLS)** no Supabase
- **Validação de dados** com Pydantic
- **Hash de senhas** com Bcrypt
- **CORS configurado** para domínios específicos
- **Variáveis de ambiente** para credenciais

## 📈 Funcionalidades da API

### Endpoints Principais

```bash
# Autenticação
POST /api/auth/register     # Registro de usuário
POST /api/auth/login        # Login

# Cálculos de Carbono
POST /api/carbon/calculate  # Novo cálculo
GET  /api/carbon/history    # Histórico do usuário

# Dashboard
GET  /api/dashboard/stats   # Estatísticas do usuário
```

### Exemplo de Cálculo
```json
{
  "energy_consumption": 150.5,
  "transport_km": 25.0,
  "waste_kg": 10.2,
  "water_usage": 300.0
}
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe PegadaZero
- **Design**: Identidade visual sustentável
- **DevOps**: Deploy automatizado com Vercel

## 📞 Contato

- **Email**: contato@pegadazero.com
- **Website**: [https://pegadazero.vercel.app](https://pegadazero.vercel.app)
- **GitHub**: [https://github.com/seu-usuario/PegadaZero](https://github.com/seu-usuario/PegadaZero)

---

<div align="center">
  <p>🌱 <strong>Juntos por um futuro mais sustentável!</strong> 🌱</p>
  <p>Feito com 💚 pela equipe PegadaZero</p>
</div>