from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from ..config import settings
from ..models.user import User
from ..models.carbon import CarbonRecord
from ..models.organization import Organization


client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client.get_default_database()
    await init_beanie(database=db, document_models=[User, CarbonRecord, Organization])