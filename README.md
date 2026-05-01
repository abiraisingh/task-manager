# 📝 Task Manager (Full-Stack)

A full-stack Task Manager application with authentication and CRUD operations, built using React (TypeScript), Node.js, Express, and MongoDB.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT Authentication)
- 🛡️ Protected Routes (Frontend + Backend)
- 📋 Create, Read, Update, Delete Tasks
- 🎨 Clean and modern UI
- ⚡ Fast frontend with Vite + React

---

## 🛠️ Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Axios
- CSS (custom modern UI)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt (password hashing)

---

## 📁 Project Structure

```
task-manager/
│
├── backend/
│ ├── src/
│ ├── server.js
│ └── .env
│
├── frontend/
│ ├── src/
│ ├── index.css
│ └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/abiraisingh/task-manager.git
cd task-manager
```

### 2️⃣ Backend Setup
```
cd backend
npm install
```
Create .env file inside backend/:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run backend:
```
npm run dev
```
### 3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```
Frontend runs at:
```
http://localhost:5173
```
## 🔌 API Endpoints
### Auth
```
POST /api/v1/auth/register
POST /api/v1/auth/login
```
### Tasks
```
GET /api/v1/tasks
POST /api/v1/tasks
PUT /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```
## 🧪 How to Use
1. Register a new user
2. Login to receive JWT token
3. Add tasks
4. Edit tasks
5. Delete tasks
6. Logout

## ⚠️ Notes
- .env file is not included for security reasons
- Ensure MongoDB is running
- Start backend before frontend

## 📌 Future Improvements
- Task completion status (done/pending)
- Due dates
- Drag-and-drop UI
- Dark mode
- Role-based access (admin/user)

## 👨‍💻 Author
Abirai Singh

## ⭐ Summary
This project demonstrates full-stack development skills including authentication, API design, state management, and modern UI implementation using the MERN stack.
