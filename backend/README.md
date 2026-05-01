# 🎓 Scholar's Hub — Backend API

**Student Name:** [Your Name]
**Module:** INFS 202 — Midterm Backend Project

## Project Description

RESTful backend API for Scholar's Hub Student Directory.
Built with Node.js, Express, and SQL Server. Supports JWT
authentication, full CRUD for students, and role-based access.

## Tech Stack

- Node.js + Express
- Microsoft SQL Server (mssql driver)
- JWT Authentication (jsonwebtoken)
- Password hashing (bcryptjs)
- Input validation (express-validator)
- CORS enabled for React frontend

## Setup Instructions

### 1. Clone and install

git clone <your-repo-url>
cd scholars-hub-backend
npm install

### 2. Configure environment

Copy .env.example to .env and fill in your SQL Server credentials.

### 3. Make sure SQL Server is running

The app auto-creates tables on first run.

### 4. Start the server

npm run dev # development with nodemon
npm start # production

## API Endpoints

### Auth

POST /api/auth/register — Register a new user
POST /api/auth/login — Login, receive JWT token
GET /api/auth/me — Get logged-in user (protected)

### Students

GET /api/students — Get all students (optional ?search= &major=)
GET /api/students/:id — Get one student
POST /api/students — Add student (requires login)
PUT /api/students/:id — Update student (admin only)
DELETE /api/students/:id — Delete student (admin only)

## Live URL

http://localhost:5000 (update after deployment)
