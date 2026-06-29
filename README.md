# ✅ TaskFlow — MERN Stack Task Tracker

A full-featured task management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌐 Live Demo
- **Frontend:** [Deployed on Vercel/Netlify] *(add your URL here)*
- **Backend API:** [Deployed on Render] *(add your URL here)*

---

## ✨ Features

### Core (Mandatory)
- ✅ **Full CRUD** — Create, Read, Update, Delete tasks
- ✅ **Form Validation** — Client-side + server-side validation with error messages
- ✅ **REST API** — Clean RESTful endpoints with proper HTTP methods
- ✅ **MongoDB Integration** — MongoDB Atlas with Mongoose ODM
- ✅ **Responsive UI** — Mobile-first design, works on all screen sizes
- ✅ **Dynamic Updates** — No page refresh (React state + context)

### Bonus Features Implemented
- 🔍 **Search** — Real-time search by title/description
- 🎯 **Filtering** — Filter by status, priority, and category
- 🔃 **Sorting** — 6 sort options (newest, oldest, priority, due date, A-Z)
- 🔔 **Toast Notifications** — Success/error notifications for every action
- ♻️ **Reusable Components** — Badge, Modal, TaskForm, TaskCard, Loader, EmptyState
- 🌿 **Environment Variables** — `.env` for both client and server
- 📊 **Stats Dashboard** — Live task count by status
- 🏷️ **Tags & Categories** — Organize tasks by category and tags
- 📅 **Due Dates** — With overdue and "due today" visual warnings
- 🧹 **Bulk Delete** — Clear all completed tasks at once
- ⚡ **Priority Sorting** — Custom high→medium→low aggregation pipeline

---

## 🗂️ Project Structure

```
task-tracker/
├── server/                    # Backend (Node.js + Express)
│   ├── controllers/
│   │   └── taskController.js  # Business logic for all CRUD ops
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   └── Task.js            # Mongoose schema/model
│   ├── routes/
│   │   └── taskRoutes.js      # Route definitions
│   ├── .env.example
│   ├── index.js               # Server entry point
│   └── package.json
│
└── client/                    # Frontend (React)
    ├── public/
    │   └── index.html
    └── src/
        ├── components/        # Reusable UI components
        │   ├── Badge.jsx
        │   ├── EmptyState.jsx
        │   ├── FilterBar.jsx
        │   ├── Loader.jsx
        │   ├── Modal.jsx
        │   ├── StatsBar.jsx
        │   ├── TaskCard.jsx
        │   └── TaskForm.jsx
        ├── context/
        │   └── TaskContext.js  # Global state (React Context + useReducer)
        ├── hooks/
        │   └── useTaskForm.js  # Custom hook for form logic
        ├── pages/
        │   └── Home.jsx        # Main page
        ├── utils/
        │   └── api.js          # Centralized API calls (axios)
        ├── App.css             # All styles
        ├── App.js
        └── index.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd task-tracker
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env — add your MongoDB Atlas connection string
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# .env should have: REACT_APP_API_URL=http://localhost:5000/api
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports `?status`, `?priority`, `?category`, `?sort`, `?search`) |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Quick status update |
| DELETE | `/api/tasks/:id` | Delete a task |
| DELETE | `/api/tasks/completed/all` | Bulk delete completed tasks |
| GET | `/api/tasks/categories/all` | Get all distinct categories |

---

## ☁️ Deployment

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root directory to `server/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variable: `MONGO_URI` = your Atlas URI

### Frontend → Vercel
1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set root directory to `client/`
3. Add environment variable: `REACT_APP_API_URL` = your Render backend URL + `/api`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Context, CSS3 |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Deployment | Render (backend), Vercel (frontend) |

---

*Built as part of a Full-Stack internship technical assignment.*

By "ANANYA"