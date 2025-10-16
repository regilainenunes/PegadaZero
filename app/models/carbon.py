from beanie import Document, PydanticObjectId
from pydantic import Field
from enum import Enum
from datetime import datetime


class Category(str, Enum):
    energia = "energia"
    transporte = "transporte"
    residuos = "residuos"


class CarbonRecord(Document):
    user_id: PydanticObjectId
    category: Category
    amount: float
    emissions: float
    date: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "carbon_records"