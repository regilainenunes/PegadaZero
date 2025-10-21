# Publicação Beta da Plataforma PegadaZero

Este guia prepara e executa o ambiente completo (frontend + backend) em Docker para publicar a primeira versão beta localmente.

## Pré-requisitos
- Docker Desktop (Windows)
- 4 GB de RAM livre
- Portas disponíveis: `5000` (API), `8080` (Frontend)

## Estrutura de Containers
- Backend (FastAPI): `uvicorn app.main:app` em `:5000`
  - PDF via WeasyPrint (dependências do sistema já incluídas na imagem)
  - Banco: SQLite em volume (`/app/data/pegadazero.db`)
- Frontend (Vite + Nginx): build de produção servido em `:8080`

## Passo a passo

1. Build e subida dos serviços

```bash
# Na raiz do projeto
docker compose up --build -d
```

2. Verificação rápida
- Frontend: `http://localhost:8080/`
- API base: `http://localhost:5000/`
  - `GET /` (página home Jinja)
  - `GET /api/admin/stats` (requer token Master)

3. Usuário Master
- O backend executa seed no startup (`ensure_sql_seed`), criando usuário Admin/Master.
- Caso necessário, ajuste `app/utils/seed.py` para definir email/senha do Master e reinicie o container do backend:

```bash
docker compose restart backend
```

4. Login e uso do Dashboard Master
- Acesse `http://localhost:8080/login` e faça login com o usuário Master.
- Abra `http://localhost:8080/admin/dashboard-master`.
- Exporte relatórios:
  - CSV: botão “Exportar CSV” chama `GET /api/admin/export.csv` com autenticação
  - PDF: botão “Gerar PDF” chama `GET /api/admin/export.pdf` com autenticação

## Variáveis de Ambiente

Frontend (`.env.production`):
```
VITE_API_URL=http://localhost:5000/api
```

Backend (via `docker-compose.yml`):
- `SQL_DATABASE_URL=sqlite:///./data/pegadazero.db`
- `KIWIFY_API_URL` e `KIWIFY_API_KEY` (opcional)

## Comandos úteis

```bash
# Logs
docker compose logs -f backend
docker compose logs -f frontend

# Reiniciar um serviço
docker compose restart backend

# Parar tudo
docker compose down
```

## Observações
- PDF requer WeasyPrint; a imagem inclui libs necessárias (Cairo, Pango, Pixbuf).
- Para banco Postgres em produção, troque `SQL_DATABASE_URL` por algo como:
  `postgresql+psycopg2://user:pass@host:5432/pegadazero` e ajuste serviços conforme.
- CORS está liberado para beta (`*`); em produção final, restrinja a origem.