from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict
from sqlalchemy.orm import Session

from ..models.carbon import Category
from ..sql_models import CarbonRecordSQL, UserSQL
from ..utils.auth_handler import get_current_user
from ..utils.sql_session import get_db
from ..utils.calculations import calculate_emissions


router = APIRouter()


class CarbonCreatePayload(BaseModel):
    category: Category
    amount: float
    date: Optional[str] = None  # ISO string opcional


class CarbonUpdatePayload(BaseModel):
    category: Optional[Category] = None
    amount: Optional[float] = None
    emissions: Optional[float] = None


@router.post("")
async def create_record(payload: CarbonCreatePayload, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    emissions = calculate_emissions(payload.category, payload.amount)
    record = CarbonRecordSQL(
        user_id=current_user.id,
        category=payload.category.value,
        amount=payload.amount,
        emissions=emissions,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("")
async def list_records(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(CarbonRecordSQL).filter(CarbonRecordSQL.user_id == current_user.id).all()
    return records


@router.get("/summary")
async def summary(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(CarbonRecordSQL).filter(CarbonRecordSQL.user_id == current_user.id).all()
    totals: Dict[str, float] = {c.value: 0.0 for c in Category}
    for r in records:
        # Em SQL armazenamos a categoria como string
        totals[r.category] += r.emissions
    return {"totals": totals, "count": len(records)}


@router.get("/{record_id}")
async def get_record(record_id: int, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(CarbonRecordSQL).filter(CarbonRecordSQL.id == record_id).first()
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return record


@router.put("/{record_id}")
async def update_record(record_id: int, payload: CarbonUpdatePayload, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(CarbonRecordSQL).filter(CarbonRecordSQL.id == record_id).first()
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    if payload.category is not None:
        record.category = payload.category.value
    if payload.amount is not None:
        record.amount = payload.amount
        # Recalcula emissões com categoria atual
        cat_enum = Category(record.category)
        record.emissions = calculate_emissions(cat_enum, record.amount)
    if payload.emissions is not None:
        record.emissions = payload.emissions
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
async def delete_record(record_id: int, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(CarbonRecordSQL).filter(CarbonRecordSQL.id == record_id).first()
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    db.delete(record)
    db.commit()
    return {"message": "Registro excluído"}