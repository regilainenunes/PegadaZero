# 🐳 Guia de Deploy Local com Docker Compose

## 📋 Pré-requisitos

- ✅ Docker Desktop instalado e rodando
- ✅ Docker Compose disponível
- ✅ Arquivo `.env.local` configurado

---

## ⚙️ Configuração Inicial

### 1. Configure o arquivo `.env.local`

O arquivo `.env.local` já foi criado com as configurações padrão. **Edite os valores conforme necessário**:

```env
# Configurações para ambiente local com Docker Compose
# Backend API
SQL_DATABASE_URL=sqlite:///./data/pegadazero.db
SECRET_KEY=your-secret-key-here-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_ALGORITHM=HS256
ENV=development

# Kiwify Payment Integration
KIWIFY_API_KEY=your-kiwify-api-key-here
KIWIFY_API_URL=https://api.kiwify.com.br

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### 2. **IMPORTANTE**: Altere os valores padrão

- **SECRET_KEY**: Gere uma chave segura de 32+ caracteres
- **KIWIFY_API_KEY**: Adicione sua chave real da API Kiwify

---

## 🚀 Comandos de Deploy

### **Iniciar a aplicação completa:**
```bash
docker-compose up -d
```

### **Ver logs em tempo real:**
```bash
docker-compose logs -f
```

### **Parar a aplicação:**
```bash
docker-compose down
```

### **Rebuild completo (após mudanças no código):**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🌐 URLs de Acesso

Após o deploy bem-sucedido:

- **Frontend (Interface)**: http://localhost:8080
- **Backend (API)**: http://localhost:5000
- **Documentação da API**: http://localhost:5000/docs

---

## 🔍 Verificação de Status

### Verificar containers rodando:
```bash
docker-compose ps
```

### Verificar logs específicos:
```bash
# Logs do backend
docker-compose logs backend

# Logs do frontend  
docker-compose logs frontend
```

### Health Check do Backend:
```bash
curl http://localhost:5000/health
```

---

## 🗄️ Dados Persistentes

- **Banco de dados**: Armazenado em volume Docker `backend_data`
- **Localização**: `/app/data/pegadazero.db` dentro do container
- **Backup**: Os dados persistem entre reinicializações

### Para resetar o banco de dados:
```bash
docker-compose down
docker volume rm pegadazero_backend_data
docker-compose up -d
```

---

## 🐛 Troubleshooting

### **Problema**: Porta já em uso
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :8080
netstat -ano | findstr :5000

# Parar processo específico (substitua PID)
taskkill /PID <PID> /F
```

### **Problema**: Erro de build
```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker-compose build --no-cache
```

### **Problema**: Backend não conecta
1. Verifique se o arquivo `.env.local` existe
2. Verifique se as variáveis estão corretas
3. Verifique os logs: `docker-compose logs backend`

---

## 📊 Monitoramento

### Verificar uso de recursos:
```bash
docker stats
```

### Verificar volumes:
```bash
docker volume ls
```

### Acessar container (debug):
```bash
# Backend
docker-compose exec backend bash

# Frontend  
docker-compose exec frontend sh
```

---

## 🔄 Workflow de Desenvolvimento

1. **Faça mudanças no código**
2. **Rebuild apenas o serviço alterado**:
   ```bash
   # Para mudanças no backend
   docker-compose up -d --build backend
   
   # Para mudanças no frontend
   docker-compose up -d --build frontend
   ```
3. **Teste as mudanças**
4. **Commit e push**

---

## ✅ Checklist de Deploy

- [ ] Docker Desktop rodando
- [ ] Arquivo `.env.local` configurado
- [ ] Portas 5000 e 8080 livres
- [ ] `docker-compose up -d` executado com sucesso
- [ ] Frontend acessível em http://localhost:8080
- [ ] Backend acessível em http://localhost:5000
- [ ] API docs em http://localhost:5000/docs
- [ ] Health check retorna OK