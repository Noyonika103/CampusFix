# CampusFix – Complaint Management System

CampusFix is a simple complaint and issue management system built as a hackathon-style MVP. It allows users to raise complaints, track ticket status, assign issues, and view dashboard statistics.

## Features

- Create complaint tickets
- View all tickets
- Filter tickets by status, priority, and category
- Update ticket status and assignment
- Dashboard with complaint statistics:
  - Total tickets
  - Open tickets
  - In-progress tickets
  - Resolved tickets
  - High-priority tickets

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript

## Project Structure

```bash
campusfix/
│
├── backend/
│   ├── app/
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md
└── .gitignore