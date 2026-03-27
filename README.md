# backend-task-manager-api

Backend API for task manager CRUD with status, priority, due date, and user ownership using JWT and HttpOnly cookies.

## Features

- Register user
- Login user
- Logout user
- Create task
- Get all tasks (user-specific)
- Get single task (user-specific)
- Update task (user-specific)
- Delete task (user-specific)
- Task status support
- Task priority support
- Due date support
- Protected routes
- JWT authentication
- HttpOnly cookie based auth
- MongoDB with Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser

## Environment Variables

Create a .env file:

```bash
PORT=1203
MONGO_URI=mongodb://127.0.0.1:27017/backend_task_manager_api
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Tasks

- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

### Task Fields

- title
- description
- status → pending, in-progress, completed
- priority → low, medium, high
- dueDate

## Notes

- Each task belongs to a specific user
- Users can only access their own tasks
- Authentication via HttpOnly cookies
- Use withCredentials: true in frontend

## Follow Me

- GitHub: https://github.com/a2rp
- Portfolio: https://www.ashishranjan.net
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz
