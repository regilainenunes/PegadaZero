from beanie import Document, PydanticObjectId
from pydantic import Field
from typing import List


class Organization(Document):
    name: str
    admin_id: PydanticObjectId
    members: List[PydanticObjectId] = Field(default_factory=list)

    class Settings:
        name = "organizations"