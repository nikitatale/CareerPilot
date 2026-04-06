# 💼 CareerPilot - Professional Networking Platform

> **CareerPilot** is a modern professional networking platform where users can connect, share, and grow their careers.
> Create profiles, connect with others, and explore opportunities - all in one place.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-career--pilot.vercel.app-blue?style=for-the-badge)](https://career-pilot-omega.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-nikitatale-black?style=for-the-badge\&logo=github)](https://github.com/nikitatale/CareerPilot)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Nikita_Tale-0077B5?style=for-the-badge\&logo=linkedin)](https://www.linkedin.com/in/nikita-tale)

---

## 🖼️ Demo Preview

![CareerPilot Preview](frontend/public/website.png)

---

## ✨ What Makes This Project Stand Out

| Feature                            | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| 👤 **User Profiles**               | Create and manage professional profiles with profile pictures |
| 🤝 **Connect with Professionals**  | Send & manage connection requests                             |
| 📰 **Feed System**                 | View and interact with posts from your network                |
| 🔐 **Authentication System**       | Secure login & signup using bcrypt                            |
| 📄 **Resume Upload & PDF Support** | Upload and manage resumes (PDF generation supported)          |
| 📸 **Image Uploads**               | Profile pictures handled via Multer                           |
| ⚡ **REST API Integration**         | Smooth frontend-backend communication using Axios             |
| 📱 **Responsive UI**               | Clean UI built with Next.js + Tailwind CSS                    |

---

## 🛠️ Tech Stack

```
Frontend   → Next.js 16, React 19, Tailwind CSS, Redux Toolkit
Backend    → Node.js, Express v5
Database   → MongoDB, Mongoose
Auth       → bcrypt
File Upload → Multer
PDF        → pdfkit, pdf-creator-node
API Client → Axios
Deployment → Vercel (Frontend), Render (Backend)
```

---

## 🚀 Getting Started Locally

### Prerequisites

* Node.js v18+
* MongoDB (local or Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/nikitatale/CareerPilot.git
cd CareerPilot
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `/backend`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8080
```

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit → **http://localhost:3000**

---

## 📁 Project Structure

```
CareerPilot/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── redux/
│   └── public/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## 🌐 Live Deployment

| Service  | Link                                  |
| -------- | ------------------------------------- |
| Frontend | https://career-pilot.vercel.app       |
| Backend  | https://careerpilot-p9bi.onrender.com |

---

## 💡 Key Learnings & Challenges

* Built a **full-stack MERN application** with real-world architecture
* Implemented **file uploads using Multer**
* Handled **secure authentication & password hashing**
* Managed **API integration between Next.js frontend and Express backend**
* Deployed **frontend & backend separately (Vercel + Render)**

---

## 👩‍💻 About the Developer

**Nikita Tale** - Full-Stack Developer (MERN Stack)
📧 Open to work! Let's connect →

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/nikita-tale)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?logo=github)](https://github.com/nikitatale)

---

> ⭐ If you found this project interesting, please star it - it really helps!
