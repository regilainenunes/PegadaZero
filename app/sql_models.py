from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship

from .db.sql import Base


class OrganizationSQL(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # Novos campos para dashboard master
    cnpj = Column(String(20), index=True, nullable=True)
    sector = Column(String(100), index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

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


class PaymentSQL(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    company_id = Column(Integer, ForeignKey("organizations.id"), index=True, nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="BRL", nullable=False)
    status = Column(String(20), default="pending", index=True, nullable=False)
    kiwify_order_id = Column(String(100), unique=True, index=True, nullable=True)
    kiwify_checkout_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AdminAuditLogSQL(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)