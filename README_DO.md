# Deploy na DigitalOcean (App Platform + DOCR)

Este guia prepara e publica o PegadaZero na DigitalOcean usando:
- App Platform (frontend como Static Site e backend como Web Service Docker)
- DigitalOcean Container Registry (DOCR) para a imagem do backend
- GitHub Actions para CI/CD

## Pré‑requisitos
- Conta na DigitalOcean.
- `doctl` instalado localmente (opcional para testes): https://docs.digitalocean.com/reference/doctl/how-to/install/
- Repositório no GitHub com acesso a Actions.

## Passo 1 — Criar o Registry DOCR
1. No painel da DigitalOcean, crie um Container Registry (DOCR), por exemplo: `pegadazero`.
2. Anote o nome completo: `registry.digitalocean.com/pegadazero`.

## Passo 2 — App Platform (spec)
O arquivo `infra/do/app.yaml` define:
- Ingress unificado: `/api` para backend e `/` para frontend
- Backend via imagem DOCR `pegadazero-backend:latest` (com deploy-on-push ativado)
- Frontend como Static Site (build com `npm run build`)

Ajuste placeholders:
- `github.repo`: substitua por `<OWNER>/<REPO>`
- `KIWIFY_API_KEY`: defina como SECRET no App Platform

Para criar o app:
```bash
# Via CLI
doctl auth init
# Crie o app inicialmente (ou use o painel)
doctl apps create --spec infra/do/app.yaml --format ID,DefaultIngress
# Guarde o APP_ID e configure DNS/domínios conforme necessário
```

## Passo 3 — Secrets no GitHub
Configure os seguintes Secrets em `Settings > Secrets and variables > Actions`:
- `DO_API_TOKEN`: Personal Access Token da DigitalOcean
- `DOCR_REGISTRY`: nome do registry DOCR (ex.: `pegadazero`)
- `DO_APP_ID`: ID do app na App Platform (obtido no passo anterior)

## Passo 4 — CI/CD
O workflow `.github/workflows/deploy-digitalocean.yml` faz:
- Build e push da imagem backend para DOCR (`latest` e commit SHA)
- Update do App com a spec (`infra/do/app.yaml`) usando a tag do commit

Pipeline dispara em push para `main`.

## Passo 5 — Variáveis e Secrets no App Platform
- Backend:
  - `SQL_DATABASE_URL` (padrão `sqlite:////app/data/pegadazero.db`). Observação: App Platform não fornece volume persistente; para produção considere um Managed Database (PostgreSQL) e ajuste a URL.
  - `KIWIFY_API_URL` (geral): `https://api.kiwify.com`
  - `KIWIFY_API_KEY` (SECRET): defina no App Platform
- Frontend (Static Site):
  - `VITE_API_URL` (BUILD_TIME): use `${APP_URL}/api` para apontar o backend do mesmo domínio

## Passo 6 — Domínios
- Configure um domínio principal (ex.: `pegadazero.com`) apontando para o App Platform
- Ingress já roteia `/api` -> backend e `/` -> frontend

## Verificação pós‑deploy
- Frontend acessível no domínio.
- Login Master (
  - usar seed/credenciais existentes
  - acessar `/admin/dashboard-master`)
- Testar exportações:
  - `GET /api/admin/export.csv`
  - `GET /api/admin/export.pdf`
- PDF via WeasyPrint: validado dentro do container backend.

## Alternativa: Droplet + Docker Compose
Se preferir Droplet:
1. Crie um Droplet Ubuntu
2. Instale Docker e Docker Compose
3. `scp` do projeto ao Droplet e rode `docker-compose up -d`
4. Use Nginx/Firewall/Let’s Encrypt para HTTPS

## Próximos passos (produção)
- Migrar `SQL_DATABASE_URL` para PostgreSQL (Managed DB)
- Configurar Cloud Firewalls
- Autoscaling/planos do App Platform
- Observabilidade (logs, métricas) e alertas
- Backups e plano de recuperação