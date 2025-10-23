# Configuração de Secrets do GitHub para Deploy AWS

## 📋 Secrets Necessários

Para configurar o deploy automático na AWS via GitHub Actions, você precisa adicionar os seguintes secrets no seu repositório GitHub:

### 🔐 Como Adicionar Secrets no GitHub:
1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Adicione cada secret abaixo:

---

## 🚀 Secrets Obrigatórios para AWS

### **AWS_REGION**
- **Valor**: `us-east-1` (ou sua região preferida)
- **Descrição**: Região AWS onde os recursos serão criados

### **ECR_REGISTRY**
- **Valor**: `123456789012.dkr.ecr.us-east-1.amazonaws.com`
- **Descrição**: URL do seu registro ECR
- **Como obter**: No console AWS → ECR → Repositories → copie o URI

### **ECS_CLUSTER**
- **Valor**: `pegadazero-cluster`
- **Descrição**: Nome do cluster ECS
- **Como obter**: No console AWS → ECS → Clusters

### **AWS_ACCOUNT_ID**
- **Valor**: `123456789012`
- **Descrição**: ID da sua conta AWS (12 dígitos)
- **Como obter**: No console AWS → clique no seu nome → Account ID

### **EFS_FILE_SYSTEM_ID**
- **Valor**: `fs-0123456789abcdef0`
- **Descrição**: ID do sistema de arquivos EFS para persistência
- **Como obter**: No console AWS → EFS → File systems

### **ALB_DNS_NAME**
- **Valor**: `pegadazero-alb-123456789.us-east-1.elb.amazonaws.com`
- **Descrição**: DNS name do Application Load Balancer
- **Como obter**: No console AWS → EC2 → Load Balancers

---

## 💳 Secrets para Pagamentos

### **KIWIFY_API_KEY**
- **Valor**: `sua-chave-api-kiwify-aqui`
- **Descrição**: Chave da API do Kiwify para processar pagamentos
- **Como obter**: No painel do Kiwify → Configurações → API

---

## 🔧 Secrets Adicionais (Opcionais)

### **SECRET_KEY**
- **Valor**: `sua-chave-secreta-jwt-super-segura-aqui`
- **Descrição**: Chave secreta para JWT tokens
- **Recomendação**: Use um gerador de senhas para criar uma chave de 32+ caracteres

---

## ✅ Verificação

Após adicionar todos os secrets, verifique se estão listados em:
**Settings** → **Secrets and variables** → **Actions**

Os secrets devem aparecer como:
- ✅ AWS_REGION
- ✅ ECR_REGISTRY  
- ✅ ECS_CLUSTER
- ✅ AWS_ACCOUNT_ID
- ✅ EFS_FILE_SYSTEM_ID
- ✅ ALB_DNS_NAME
- ✅ KIWIFY_API_KEY

---

## 🚀 Próximo Passo

Após configurar todos os secrets, faça um push para a branch `main` para disparar o deploy automático!

```bash
git add .
git commit -m "Configure deployment secrets"
git push origin main
```

O GitHub Actions irá automaticamente:
1. Fazer build das imagens Docker
2. Fazer push para o ECR
3. Atualizar os serviços ECS
4. Disponibilizar a aplicação na AWS