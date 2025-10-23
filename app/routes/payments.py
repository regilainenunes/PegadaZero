from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from ..utils.auth_handler import get_current_user
from ..utils.sql_session import get_db
from ..sql_models import UserSQL
from ..payments import KiwifyClient, create_payment_record, update_payment_status


router = APIRouter()


class CreatePaymentPayload(BaseModel):
    amount: float
    currency: str = "BRL"
    product_id: str
    company_id: Optional[int] = None


@router.post("/create")
async def create_payment(payload: CreatePaymentPayload, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    client = KiwifyClient()
    # Cliente do checkout (dados mínimos)
    customer = {"name": current_user.name, "email": current_user.email}
    try:
        data = client.create_checkout(payload.amount, payload.currency, payload.product_id, customer)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Falha ao criar checkout Kiwify: {e}")

    payment = create_payment_record(
        user_id=current_user.id,
        company_id=payload.company_id,
        amount=payload.amount,
        currency=payload.currency,
        status=data.get("status", "pending"),
        order_id=data.get("order_id"),
        checkout_url=data.get("checkout_url"),
    )
    return {
        "payment_id": payment.id,
        "status": payment.status,
        "checkout_url": payment.kiwify_checkout_url,
        "order_id": payment.kiwify_order_id,
    }


class WebhookPayload(BaseModel):
    order_id: str
    status: str


@router.post("/webhook")
async def kiwify_webhook(request: Request, payload: WebhookPayload):
    """
    Webhook para receber notificações de pagamento do Kiwify
    URL: https://seudominio.com/api/payments/webhook
    """
    # Verificar se o pagamento existe
    payment = update_payment_status(payload.order_id, payload.status)
    if not payment:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    # Log do webhook para auditoria
    print(f"Webhook recebido - Order ID: {payload.order_id}, Status: {payload.status}")
    
    return {"message": "Status atualizado", "payment_id": payment.id, "status": payment.status}