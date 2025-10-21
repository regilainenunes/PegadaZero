import os
from typing import Optional, Dict
from datetime import datetime
import requests

from .config import settings
from .db.sql import SessionLocal
from .sql_models import PaymentSQL, UserSQL, OrganizationSQL


class KiwifyClient:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or settings.KIWIFY_API_KEY
        self.base_url = base_url or settings.KIWIFY_API_URL.rstrip("/")
        if not self.api_key:
            raise RuntimeError("KIWIFY_API_KEY não configurada")

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def create_checkout(self, amount: float, currency: str, product_id: str, customer: Dict[str, str]) -> Dict[str, str]:
        """
        Cria um link de checkout no Kiwify.
        Observação: Estrutura baseada em integração REST comum; ajuste conforme docs reais.
        """
        payload = {
            "amount": amount,
            "currency": currency,
            "product_id": product_id,
            "customer": customer,
        }
        url = f"{self.base_url}/checkout/create"
        resp = requests.post(url, json=payload, headers=self._headers(), timeout=15)
        resp.raise_for_status()
        data = resp.json()
        # Espera: { checkout_url, order_id, status }
        return {
            "checkout_url": data.get("checkout_url"),
            "order_id": data.get("order_id"),
            "status": data.get("status", "pending"),
        }

    def verify_webhook(self, signature: str, body: bytes) -> bool:
        # Placeholder: validar HMAC/assinatura fornecida pelo Kiwify
        return bool(signature)


def create_payment_record(user_id: int, company_id: Optional[int], amount: float, currency: str, status: str, order_id: Optional[str], checkout_url: Optional[str]) -> PaymentSQL:
    db = SessionLocal()
    try:
        payment = PaymentSQL(
            user_id=user_id,
            company_id=company_id,
            amount=amount,
            currency=currency,
            status=status,
            kiwify_order_id=order_id,
            kiwify_checkout_url=checkout_url,
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment
    finally:
        db.close()


def update_payment_status(order_id: str, status: str) -> Optional[PaymentSQL]:
    db = SessionLocal()
    try:
        payment = db.query(PaymentSQL).filter(PaymentSQL.kiwify_order_id == order_id).first()
        if not payment:
            return None
        payment.status = status
        payment.updated_at = datetime.utcnow()
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment
    finally:
        db.close()