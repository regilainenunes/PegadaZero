# Deploy na DigitalOcean sem Docker (App Platform + Buildpacks)

Este guia publica o PegadaZero na DigitalOcean sem usar Docker, com:
- App Platform lendo diretamente o repositório do GitHub
- Backend (FastAPI) via buildpack Python
- Frontend (Vite/React) como Static Site com build `npm`
- CI simples via GitHub Actions para aplicar o spec

## Pré‑requisitos
- Conta na DigitalOcean.
- Repositório no GitHub com acesso a Actions.
- Opcional: `doctl` local para criar/atualizar o App.

## Estrutura do deploy
- Spec: `infra/do/app.yaml`
  - `services.backend`: Python, roda `uvicorn app.main:app --port 5000`
  - `static_sites.frontend`: build `npm ci && npm run build`, `dist` como saída
  - Ingress: `/api` para backend e `/` para frontend
- CI: `.github/workflows/deploy-digitalocean.yml`
  - Apenas atualiza o app com o spec (sem imagens Docker)

## Configuração do spec
Edite `infra/do/app.yaml` e ajuste:
- `github.repo`: substitua por `OWNER/REPO` do seu projeto
- Secrets/envs:
  - Backend:
    - `KIWIFY_API_KEY`: defina como SECRET na App Platform
    - `KIWIFY_API_URL`: `https://api.kiwify.com`
    - `SQL_DATABASE_URL`: `sqlite:////app/data/pegadazero.db` (atenção: armazenamento efêmero)
  - Frontend:
    - `VITE_API_URL`: `${APP_URL}/api` (BUILD_TIME) para apontar o backend no mesmo domínio

## Criar o App na App Platform
Usando `doctl`:
```bash
doctl auth init
# Cria o app a partir do spec
doctl apps create --spec infra/do/app.yaml --format ID,DefaultIngress
# Guarde o APP_ID (para usar no CI)
```
Ou crie pelo painel e importe o repositório do GitHub.

## Configurar Secrets no GitHub (para CI)
Em `Settings > Secrets and variables > Actions`:
- `DO_API_TOKEN`: Personal Access Token da DigitalOcean
- `DO_APP_ID`: ID do app (obtido na criação)

O workflow executa em push para `main` e roda:
```bash
doctl apps update $DO_APP_ID --spec infra/do/app.yaml
```

## Domínios e rotas
- Configure seu domínio (ex.: `pegadazero.com`) na App Platform.
- Ingress já roteia `/api` → backend e `/` → frontend.

## Verificação
- Frontend online no domínio.
- Login Master e acesso ao `/admin/dashboard-master`.
- Exportações protegidas:
  - `GET /api/admin/export.csv`
  - `GET /api/admin/export.pdf`

## Observações de produção
- Persistência: SQLite em App Platform é efêmero. Para produção, use Managed PostgreSQL e ajuste `SQL_DATABASE_URL`.
- Segredos: mantenha `KIWIFY_API_KEY` nas secrets do App Platform (não em arquivos).
- Escala: use `instance_size_slug` e `instance_count` conforme necessidade.

## Sem Docker (alternativas de dev)
- Desenvolvimento local: `npm run dev` para frontend e `uvicorn app.main:app --reload` para backend.
- Deploy: App Platform compila/builda a partir do GitHub; sem container registry.