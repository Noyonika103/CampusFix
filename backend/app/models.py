from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="medium")
    status = Column(String, nullable=False, default="open")
    requester_name = Column(String, nullable=False)
    assigned_to = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)