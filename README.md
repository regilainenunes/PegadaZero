# PegadaZero

Aplicação para monitoramento e redução de pegada de carbono para empresas e indivíduos.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Front-end**: Desenvolvido com React e Tailwind CSS
- **Back-end**: API RESTful com Node.js, Express e MongoDB

## Requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou remoto)
- NPM ou Yarn

## Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd PegadaZero
```

### 2. Instalar dependências do front-end

```bash
npm install
```

### 3. Instalar dependências do back-end

```bash
cd server
npm install
```

## Configuração

### Back-end

1. Crie um arquivo `.env` na pasta `server` (já criado neste projeto) com as seguintes variáveis:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pegadazero
JWT_SECRET=pegadazero_secret_key_2023
NODE_ENV=development
```

Ajuste as variáveis conforme necessário para seu ambiente.

## Execução

### Iniciar o back-end

```bash
cd server
npm run dev
```

O servidor será iniciado na porta 5000 (ou na porta definida no arquivo .env).

### Iniciar o front-end

```bash
# Na pasta raiz do projeto
npm run dev
```

O front-end será iniciado e estará disponível em `http://localhost:5173`.

## Funcionalidades

- Registro e login de usuários
- Dashboard com métricas de pegada de carbono
- Cadastro de medições de pegada de carbono
- Relatórios e gráficos de progresso
- Recomendações para redução de emissões

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/profile` - Obter perfil do usuário autenticado

### Usuários

- `PUT /api/users/profile` - Atualizar perfil do usuário
- `PUT /api/users/change-password` - Alterar senha
- `DELETE /api/users` - Excluir conta

### Pegada de Carbono

- `POST /api/carbon` - Adicionar nova medição
- `GET /api/carbon` - Listar todas as medições do usuário
- `GET /api/carbon/summary` - Obter resumo da pegada de carbono
- `GET /api/carbon/:id` - Obter medição específica
- `PUT /api/carbon/:id` - Atualizar medição
- `DELETE /api/carbon/:id` - Excluir medição