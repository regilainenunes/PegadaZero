# PegadaZero (FastAPI)

Esta é a versão em Python (FastAPI) do PegadaZero, com rotas públicas renderizadas via Jinja2 e integração com MongoDB (Beanie ODM).

## Requisitos

- Python 3.10+
- MongoDB (local ou remoto)

## Instalação

```bash
python -m pip install -r requirements.txt
```

## Configuração

Crie um arquivo `.env` na raiz (já incluído neste projeto) com:

```
MONGO_URI=mongodb://localhost:27017/pegadazero
SECRET_KEY=pegadazero_secret_key_2025
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENV=development
```

## Execução

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Acesse:
- Home: `http://localhost:8000/`
- Empresa: `http://localhost:8000/empresa`
- Sobre nós: `http://localhost:8000/sobre-nos`
- Blog: `http://localhost:8000/blog`
- Carreiras: `http://localhost:8000/carreiras`
- Legal: `http://localhost:8000/legal`
- Privacidade: `http://localhost:8000/privacidade`
- Termos: `http://localhost:8000/termos`
- Segurança: `http://localhost:8000/seguranca`

## API (Principais)

- `POST /api/auth/register` – Registro com JWT
- `POST /api/auth/login` – Login com JWT
- `GET /api/auth/profile` – Perfil do usuário
- `PUT /api/users/profile` – Atualizar perfil
- `PUT /api/users/change-password` – Alterar senha
- `DELETE /api/users` – Excluir conta

- `POST /api/carbon` – Adicionar medição
- `GET /api/carbon` – Listar medições do usuário
- `GET /api/carbon/summary` – Resumo por categoria
- `GET /api/carbon/{id}` – Obter medição
- `PUT /api/carbon/{id}` – Atualizar medição
- `DELETE /api/carbon/{id}` – Excluir medição

## Estrutura

```
app/
├── main.py
├── config.py
├── routes/
│   ├── auth.py
│   ├── carbon.py
│   ├── dashboard.py
│   └── public_pages.py
├── models/
│   ├── user.py
│   ├── carbon.py
│   └── organization.py
├── templates/
│   ├── base.html
│   ├── home.html
│   ├── empresa.html
│   ├── sobre_nos.html
│   ├── blog.html
│   ├── carreiras.html
│   ├── legal.html
│   ├── privacidade.html
│   ├── termos.html
│   └── seguranca.html
├── static/
│   └── css/
│       └── theme.css
└── utils/
    ├── database.py
    ├── auth_handler.py
    ├── email.py
    └── calculations.py
```