from fastapi import APIRouter, Request
from starlette.templating import Jinja2Templates


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/empresa")
async def empresa(request: Request):
    return templates.TemplateResponse("empresa.html", {"request": request, "title": "Empresa"})


@router.get("/sobre-nos")
async def sobre_nos(request: Request):
    return templates.TemplateResponse("sobre_nos.html", {"request": request, "title": "Sobre Nós"})


@router.get("/blog")
async def blog(request: Request):
    return templates.TemplateResponse("blog.html", {"request": request, "title": "Blog"})


@router.get("/carreiras")
async def carreiras(request: Request):
    return templates.TemplateResponse("carreiras.html", {"request": request, "title": "Carreiras"})


@router.get("/legal")
async def legal(request: Request):
    return templates.TemplateResponse("legal.html", {"request": request, "title": "Informações Legais"})


@router.get("/privacidade")
async def privacidade(request: Request):
    return templates.TemplateResponse("privacidade.html", {"request": request, "title": "Privacidade"})


@router.get("/termos")
async def termos(request: Request):
    return templates.TemplateResponse("termos.html", {"request": request, "title": "Termos"})


@router.get("/seguranca")
async def seguranca(request: Request):
    return templates.TemplateResponse("seguranca.html", {"request": request, "title": "Segurança"})