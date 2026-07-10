from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas


def create_ticket(db: Session, ticket: schemas.TicketCreate):
    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        category=ticket.category,
        location=ticket.location,
        priority=ticket.priority,
        requester_name=ticket.requester_name
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_tickets(db: Session, status: str = None, priority: str = None, category: str = None):
    query = db.query(models.Ticket)

    if status:
        query = query.filter(models.Ticket.status == status)

    if priority:
        query = query.filter(models.Ticket.priority == priority)

    if category:
        query = query.filter(models.Ticket.category == category)

    return query.order_by(models.Ticket.created_at.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: int):
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()


def update_ticket(db: Session, ticket_id: int, ticket_update: schemas.TicketUpdate):
    db_ticket = get_ticket_by_id(db, ticket_id)

    if not db_ticket:
        return None

    if ticket_update.status is not None:
        db_ticket.status = ticket_update.status

    if ticket_update.assigned_to is not None:
        db_ticket.assigned_to = ticket_update.assigned_to

    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_dashboard_stats(db: Session):
    total = db.query(func.count(models.Ticket.id)).scalar()
    open_count = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "open").scalar()
    in_progress_count = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "in_progress").scalar()
    resolved_count = db.query(func.count(models.Ticket.id)).filter(models.Ticket.status == "resolved").scalar()
    high_priority_count = db.query(func.count(models.Ticket.id)).filter(models.Ticket.priority == "high").scalar()

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
        "high_priority": high_priority_count
    }