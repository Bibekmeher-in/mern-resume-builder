# 💼 ResumePath — AI Powered Resume Builder (MERN Stack)

## 🚀 Overview
**ResumePath** is a full-stack MERN application that helps users easily create professional resumes in minutes.  
It provides an intuitive UI, dynamic templates, and AI-powered suggestions for job-specific resumes.

---

## 🧩 Tech Stack
- **Frontend:** React.js, HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT / bcrypt  
- **Hosting:** Render

---

## ⚙️ Features
✅ User authentication (Login / Signup)  
✅ AI-powered resume content suggestions  
✅ Dynamic templates for resumes  
✅ Real-time preview of resume  
✅ Download as PDF  
✅ Responsive design for all devices  

---

## 🧰 Installation & Setup
Follow these steps to run the project locally 👇  

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

// Frontend
cd server
npm install

cd ../client
npm install

.ENV
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8080

// Backend
cd server
npm start

cd ../client
npm start
