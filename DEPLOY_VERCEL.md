# 🚀 Deploy PegadaZero - Vercel + Supabase

## 📋 Visão Geral

Este guia detalha como fazer o deploy da plataforma PegadaZero usando:
- **Frontend**: React/TypeScript no Vercel
- **Backend**: Python/FastAPI no Vercel
- **Banco de Dados**: PostgreSQL no Supabase

## 🔧 Pré-requisitos

1. Conta no [Vercel](https://vercel.com/)
2. Conta no [Supabase](https://supabase.com/)
3. Repositório GitHub configurado

## 📊 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com/)
2. Clique em "New Project"
3. Escolha sua organização
4. Configure:
   - **Name**: PegadaZero
   - **Database Password**: (senha segura)
   - **Region**: South America (São Paulo)

### 2. Configurar Database

1. No painel do Supabase, vá para **SQL Editor**
2. Execute o script `supabase_setup.sql`:

```sql
-- Copie e cole o conteúdo do arquivo supabase_setup.sql
```

### 3. Obter Credenciais

No painel do Supabase, vá para **Settings > API**:
- **Project URL**: `https://your-project.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🌐 Deploy no Vercel

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com/)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, vá para **Settings > Environment Variables**:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (gere uma chave segura)
JWT_SECRET=sua-chave-jwt-super-secreta-aqui

# Vercel Environment
VERCEL_ENV=production
```

### 3. Deploy Automático

O Vercel fará o deploy automaticamente:
- **Frontend**: Servido pelo Vercel CDN
- **Backend**: Função serverless Python (`/api/*`)

## 🔐 Configuração de Segurança

### 1. Supabase RLS (Row Level Security)

As políticas RLS já estão configuradas no script SQL para:
- Usuários só veem seus próprios dados
- Cálculos de carbono são privados por usuário
- Organizações são públicas para leitura

### 2. CORS e Domínios

No Supabase, configure os domínios permitidos:
- `https://your-app.vercel.app`
- `http://localhost:3000` (desenvolvimento)

## 📱 URLs de Acesso

Após o deploy:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api`
- **Docs API**: `https://your-app.vercel.app/api/docs`

## 🧪 Testando o Deploy

### 1. Teste da API

```bash
# Health check
curl https://your-app.vercel.app/api/

# Registro de usuário
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'
```

### 2. Teste do Frontend

1. Acesse `https://your-app.vercel.app`
2. Teste o registro de usuário
3. Faça login
4. Teste o cálculo de pegada de carbono

## 🔄 Atualizações e CI/CD

### Deploy Automático

O Vercel faz deploy automático quando:
- Push para branch `main`
- Pull request (preview deploy)

### Logs e Monitoramento

- **Vercel Functions**: Logs em tempo real
- **Supabase**: Dashboard com métricas
- **Uptime**: Monitoramento automático

## 🛠️ Comandos Úteis

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar frontend
npm run dev

# Executar backend local (opcional)
cd api && python -m uvicorn index:app --reload
```

### Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy manual
vercel --prod

# Logs em tempo real
vercel logs
```

## 📊 Monitoramento

### Métricas Importantes

1. **Performance**:
   - Tempo de resposta da API
   - Tempo de carregamento do frontend
   - Core Web Vitals

2. **Uso**:
   - Número de usuários ativos
   - Cálculos de carbono por dia
   - Uso do banco de dados

3. **Erros**:
   - Logs de erro da API
   - Erros JavaScript no frontend
   - Falhas de conexão com Supabase

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro 500 na API**:
   - Verificar variáveis de ambiente
   - Checar logs no Vercel
   - Validar conexão com Supabase

2. **CORS Error**:
   - Configurar domínios no Supabase
   - Verificar headers da API

3. **Database Connection**:
   - Verificar credenciais Supabase
   - Checar status do projeto Supabase

### Logs e Debug

```bash
# Ver logs do Vercel
vercel logs --follow

# Debug local da API
export SUPABASE_URL="your-url"
export SUPABASE_ANON_KEY="your-key"
python api/index.py
```

## 📈 Próximos Passos

1. **Domínio Personalizado**: Configurar domínio próprio
2. **Analytics**: Implementar Google Analytics
3. **Monitoring**: Configurar alertas de uptime
4. **Backup**: Configurar backup automático do Supabase
5. **CDN**: Otimizar assets estáticos

## 💰 Custos Estimados

### Vercel (Hobby - Gratuito)
- 100GB bandwidth/mês
- 100GB-hrs function execution
- Domínios ilimitados

### Supabase (Free Tier)
- 500MB database
- 2GB bandwidth
- 50MB file storage

### Upgrade Recomendado
- **Vercel Pro**: $20/mês (mais recursos)
- **Supabase Pro**: $25/mês (mais storage e bandwidth)

---

## ✅ Checklist de Deploy

- [ ] Projeto criado no Supabase
- [ ] Database configurado com SQL script
- [ ] Credenciais Supabase obtidas
- [ ] Repositório conectado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Testes de API funcionando
- [ ] Frontend acessível
- [ ] Registro e login funcionando
- [ ] Cálculo de carbono operacional

**Status**: ✅ Configuração completa para deploy em produção!