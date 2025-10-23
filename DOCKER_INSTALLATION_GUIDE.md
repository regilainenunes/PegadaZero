# 🐳 Guia de Instalação do Docker Desktop

## ❗ Docker Não Encontrado

O Docker não está instalado ou não está no PATH do sistema. Para usar o deploy local com Docker Compose, você precisa instalar o Docker Desktop.

---

## 📥 Instalação do Docker Desktop

### **1. Download**
- Acesse: https://www.docker.com/products/docker-desktop/
- Clique em **Download for Windows**
- Baixe o instalador `Docker Desktop Installer.exe`

### **2. Instalação**
1. Execute o instalador como **Administrador**
2. Aceite os termos de licença
3. Marque as opções:
   - ✅ **Use WSL 2 instead of Hyper-V** (recomendado)
   - ✅ **Add shortcut to desktop**
4. Clique em **Install**
5. **Reinicie o computador** quando solicitado

### **3. Configuração Inicial**
1. Abra o **Docker Desktop**
2. Aceite os termos de serviço
3. Aguarde a inicialização (pode demorar alguns minutos)
4. Verifique se aparece "Docker Desktop is running" na bandeja do sistema

---

## ✅ Verificação da Instalação

Abra um novo **PowerShell** e execute:

```powershell
docker --version
docker-compose --version
```

Deve retornar algo como:
```
Docker version 24.0.7, build afdd53b
Docker Compose version v2.23.3-desktop.2
```

---

## 🔧 Pré-requisitos do Sistema

### **Windows 10/11:**
- Windows 10 versão 2004 ou superior (Build 19041+)
- WSL 2 habilitado
- Virtualização habilitada no BIOS

### **Verificar WSL 2:**
```powershell
wsl --list --verbose
```

### **Instalar/Atualizar WSL 2 (se necessário):**
```powershell
wsl --install
wsl --update
```

---

## 🚀 Após a Instalação

1. **Reinicie o PowerShell/Terminal**
2. **Navegue até o projeto:**
   ```powershell
   cd "C:\Users\Cliente\Documents\trae_projects\PegadaZero"
   ```
3. **Execute o deploy local:**
   ```powershell
   docker-compose up -d
   ```

---

## 🐛 Troubleshooting

### **Erro: "WSL 2 installation is incomplete"**
```powershell
# Instalar WSL 2
wsl --install

# Reiniciar o computador
# Abrir Docker Desktop novamente
```

### **Erro: "Docker daemon is not running"**
1. Abra o Docker Desktop
2. Aguarde a inicialização completa
3. Tente novamente

### **Erro: "Hyper-V is not available"**
1. Habilite a virtualização no BIOS
2. Ou use WSL 2 em vez de Hyper-V

---

## 📱 Alternativa: Deploy sem Docker

Se não puder instalar o Docker, você pode executar a aplicação diretamente:

### **Backend (FastAPI):**
```powershell
cd app
pip install -r ../requirements.txt
python -m uvicorn main:app --reload --port 5000
```

### **Frontend (React):**
```powershell
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 🎯 Próximos Passos

Após instalar o Docker:
1. ✅ Verificar instalação com `docker --version`
2. ✅ Seguir o guia `DEPLOY_LOCAL_GUIDE.md`
3. ✅ Executar `docker-compose up -d`
4. ✅ Acessar http://localhost:8080