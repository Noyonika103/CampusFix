from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TicketCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str
    priority: str
    requester_name: str


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    priority: str
    status: str
    requester_name: str
    assigned_to: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True