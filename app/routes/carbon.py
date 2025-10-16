from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from beanie import PydanticObjectId
from typing import Optional, Dict

from ..models.carbon import CarbonRecord, Category
from ..models.user import User
from ..utils.auth_handler import get_current_user
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
async def create_record(payload: CarbonCreatePayload, current_user: User = Depends(get_current_user)):
    emissions = calculate_emissions(payload.category, payload.amount)
    record = CarbonRecord(user_id=current_user.id, category=payload.category, amount=payload.amount, emissions=emissions)
    await record.insert()
    return record


@router.get("")
async def list_records(current_user: User = Depends(get_current_user)):
    records = await CarbonRecord.find(CarbonRecord.user_id == current_user.id).to_list()
    return records


@router.get("/summary")
async def summary(current_user: User = Depends(get_current_user)):
    records = await CarbonRecord.find(CarbonRecord.user_id == current_user.id).to_list()
    totals: Dict[str, float] = {c.value: 0.0 for c in Category}
    for r in records:
        totals[r.category.value] += r.emissions
    return {"totals": totals, "count": len(records)}


@router.get("/{record_id}")
async def get_record(record_id: str, current_user: User = Depends(get_current_user)):
    record = await CarbonRecord.get(PydanticObjectId(record_id))
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return record


@router.put("/{record_id}")
async def update_record(record_id: str, payload: CarbonUpdatePayload, current_user: User = Depends(get_current_user)):
    record = await CarbonRecord.get(PydanticObjectId(record_id))
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    if payload.category is not None:
        record.category = payload.category
    if payload.amount is not None:
        record.amount = payload.amount
        record.emissions = calculate_emissions(record.category, record.amount)
    if payload.emissions is not None:
        record.emissions = payload.emissions
    await record.save()
    return record


@router.delete("/{record_id}")
async def delete_record(record_id: str, current_user: User = Depends(get_current_user)):
    record = await CarbonRecord.get(PydanticObjectId(record_id))
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    await record.delete()
    return {"message": "Registro excluído"}