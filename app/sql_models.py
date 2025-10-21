from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship

from .db.sql import Base


class OrganizationSQL(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    members = relationship("UserSQL", back_populates="organization")


class UserSQL(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="Usuario", nullable=False)
    points = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("OrganizationSQL", back_populates="members")


class CarbonRecordSQL(Base):
    __tablename__ = "carbon_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    category = Column(String(20), nullable=False)
    amount = Column(Float, nullable=False)
    emissions = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("UserSQL")