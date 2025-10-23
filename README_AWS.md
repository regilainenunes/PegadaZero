# Deploy na AWS - PegadaZero

Este guia detalha como fazer o deploy da aplicação PegadaZero na AWS usando ECS (Elastic Container Service) com ECR (Elastic Container Registry).

## Arquitetura

- **Backend**: FastAPI rodando em container ECS
- **Frontend**: React/Vite servido via container ECS
- **Database**: SQLite com persistência via EFS (Elastic File System)
- **Load Balancer**: Application Load Balancer (ALB)
- **CI/CD**: GitHub Actions com deploy automático

## Pré-requisitos

1. **Conta AWS** com permissões adequadas
2. **AWS CLI** configurado
3. **Repositório GitHub** com secrets configurados
4. **Domínio** (opcional, para HTTPS)

## 1. Configuração da Infraestrutura AWS

### 1.1 Criar ECR Repositories

```bash
# Criar repositórios no ECR
aws ecr create-repository --repository-name pegadazero-backend --region us-east-1
aws ecr create-repository --repository-name pegadazero-frontend --region us-east-1
```

### 1.2 Criar EFS File System

```bash
# Criar EFS para persistência do SQLite
aws efs create-file-system \
  --creation-token pegadazero-data \
  --performance-mode generalPurpose \
  --throughput-mode provisioned \
  --provisioned-throughput-in-mibps 10 \
  --tags Key=Name,Value=pegadazero-data
```

### 1.3 Criar VPC e Subnets (se necessário)

```bash
# Usar VPC padrão ou criar nova VPC
aws ec2 describe-vpcs --filters "Name=is-default,Values=true"
```

### 1.4 Criar Security Groups

```bash
# Security Group para ALB
aws ec2 create-security-group \
  --group-name pegadazero-alb-sg \
  --description "Security group for PegadaZero ALB"

# Security Group para ECS Tasks
aws ec2 create-security-group \
  --group-name pegadazero-ecs-sg \
  --description "Security group for PegadaZero ECS tasks"

# Security Group para EFS
aws ec2 create-security-group \
  --group-name pegadazero-efs-sg \
  --description "Security group for PegadaZero EFS"
```

### 1.5 Criar Application Load Balancer

```bash
# Criar ALB
aws elbv2 create-load-balancer \
  --name pegadazero-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678

# Criar Target Groups
aws elbv2 create-target-group \
  --name pegadazero-backend-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-12345678 \
  --target-type ip

aws elbv2 create-target-group \
  --name pegadazero-frontend-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-12345678 \
  --target-type ip
```

### 1.6 Criar ECS Cluster

```bash
# Criar cluster ECS
aws ecs create-cluster --cluster-name pegadazero-cluster
```

## 2. Configuração do AWS Secrets Manager

```bash
# Criar secret para KIWIFY_API_KEY
aws secretsmanager create-secret \
  --name pegadazero/kiwify-api-key \
  --description "Kiwify API Key for PegadaZero" \
  --secret-string "your-kiwify-api-key-here"
```

## 3. Configuração do GitHub Secrets

Configure os seguintes secrets no seu repositório GitHub:

### Secrets Obrigatórios

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `AWS_ACCOUNT_ID` | ID da conta AWS | `123456789012` |
| `AWS_REGION` | Região AWS | `us-east-1` |
| `AWS_ROLE_TO_ASSUME` | ARN do role para GitHub Actions | `arn:aws:iam::123456789012:role/GitHubActionsRole` |
| `ECR_REGISTRY` | Registry ECR | `123456789012.dkr.ecr.us-east-1.amazonaws.com` |
| `ECS_CLUSTER` | Nome do cluster ECS | `pegadazero-cluster` |
| `ECS_BACKEND_SERVICE` | Nome do serviço backend | `pegadazero-backend-service` |
| `ECS_FRONTEND_SERVICE` | Nome do serviço frontend | `pegadazero-frontend-service` |
| `EFS_FILE_SYSTEM_ID` | ID do EFS | `fs-12345678` |
| `ALB_DNS_NAME` | DNS do ALB | `pegadazero-alb-123456789.us-east-1.elb.amazonaws.com` |

### Como configurar os secrets:

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione cada secret da tabela acima

## 4. Configuração do IAM Role para GitHub Actions

### 4.1 Criar Role com OIDC

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:regilainenunes/PegadaZero:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### 4.2 Políticas Necessárias

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService",
        "ecs:DescribeServices"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole"
    }
  ]
}
```

## 5. Criar ECS Services

### 5.1 Registrar Task Definitions

```bash
# Registrar task definition do backend
aws ecs register-task-definition --cli-input-json file://infra/ecs/backend-task.json

# Registrar task definition do frontend
aws ecs register-task-definition --cli-input-json file://infra/ecs/frontend-task.json
```

### 5.2 Criar Services

```bash
# Criar serviço backend
aws ecs create-service \
  --cluster pegadazero-cluster \
  --service-name pegadazero-backend-service \
  --task-definition pegadazero-backend:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/pegadazero-backend-tg/1234567890123456,containerName=pegadazero-backend,containerPort=8000

# Criar serviço frontend
aws ecs create-service \
  --cluster pegadazero-cluster \
  --service-name pegadazero-frontend-service \
  --task-definition pegadazero-frontend:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/pegadazero-frontend-tg/1234567890123456,containerName=pegadazero-frontend,containerPort=80
```

## 6. Configurar ALB Listeners

```bash
# Listener para frontend (porta 80)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/pegadazero-alb/1234567890123456 \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/pegadazero-frontend-tg/1234567890123456

# Listener rule para backend (/api/*)
aws elbv2 create-rule \
  --listener-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:listener/app/pegadazero-alb/1234567890123456/1234567890123456 \
  --priority 100 \
  --conditions Field=path-pattern,Values="/api/*" \
  --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/pegadazero-backend-tg/1234567890123456
```

## 7. Deploy Automático

Após configurar tudo, o deploy acontece automaticamente:

1. **Push para main** → Trigger do GitHub Actions
2. **Build das imagens** → Docker build + push para ECR
3. **Update das task definitions** → Substituição de placeholders
4. **Deploy no ECS** → Atualização dos serviços
5. **Verificação** → Aguarda estabilização

## 8. Monitoramento e Logs

### 8.1 CloudWatch Logs

```bash
# Ver logs do backend
aws logs describe-log-groups --log-group-name-prefix "/ecs/pegadazero-backend"

# Ver logs do frontend
aws logs describe-log-groups --log-group-name-prefix "/ecs/pegadazero-frontend"
```

### 8.2 Métricas ECS

- CPU e memória dos containers
- Health checks do ALB
- Número de tasks rodando

## 9. Troubleshooting

### Problemas Comuns

1. **Task não inicia**: Verificar logs no CloudWatch
2. **Health check falha**: Verificar security groups e portas
3. **Deploy falha**: Verificar permissões IAM
4. **Imagem não encontrada**: Verificar ECR e tags

### Comandos Úteis

```bash
# Status dos serviços
aws ecs describe-services --cluster pegadazero-cluster --services pegadazero-backend-service pegadazero-frontend-service

# Logs recentes
aws logs tail /ecs/pegadazero-backend --follow

# Forçar novo deploy
aws ecs update-service --cluster pegadazero-cluster --service pegadazero-backend-service --force-new-deployment
```

## 10. Custos Estimados

- **ECS Fargate**: ~$30-50/mês (1 vCPU, 2GB RAM por serviço)
- **ALB**: ~$20/mês
- **EFS**: ~$5/mês (10GB)
- **ECR**: ~$1/mês (storage)
- **CloudWatch**: ~$5/mês (logs)

**Total estimado**: ~$60-80/mês

## 11. Próximos Passos

1. **HTTPS**: Configurar certificado SSL/TLS
2. **Domínio**: Configurar Route 53
3. **Backup**: Configurar backup do EFS
4. **Scaling**: Configurar auto-scaling
5. **Monitoring**: Configurar alertas CloudWatch

---

Para dúvidas ou problemas, consulte a documentação oficial da AWS ou abra uma issue no repositório.