from fastapi import APIRouter, Depends
from ..models.user import User
from ..utils.auth_handler import get_current_user
from ..models.carbon import CarbonRecord


router = APIRouter()


@router.get("/dashboard")
async def dashboard_overview(current_user: User = Depends(get_current_user)):
    count = await CarbonRecord.find(CarbonRecord.user_id == current_user.id).count()
    return {"message": "Dashboard", "records_count": count}