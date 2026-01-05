
# DonateUs 🤝

A modern crowdfunding platform built for transparency, trust, and scale.


---

# 🚩 Problem Statement

Traditional donation platforms often suffer from poor transparency, outdated user experiences, and limited control for campaign creators and administrators. Donors rarely get real-time visibility into how campaigns are performing, while organizations struggle to manage campaigns securely and efficiently.


---

# 💡 Solution

DonateUs addresses these challenges by providing a role-based, full-stack crowdfunding system with real-time insights, modern UI/UX, and a scalable backend architecture — all designed to create trust between donors and campaign owners.


---

# 🌟 Key Highlights

Role-based access for Users and Admins

Clean, modern dark UI with glassmorphism

Scalable REST API architecture

Secure authentication with JWT & OAuth

Optimized performance and modular design

Production-ready structure (frontend + backend)



---

# 🧠 Core Features

# 🎯 Campaign Management

Create and manage fundraising campaigns

Category-based campaigns (Education, Healthcare, Emergency, etc.)

Real-time progress tracking

Campaign lifecycle states (Active, Pending, Completed, Suspended)


# 👥 User & Admin System

Secure email/password authentication

Google OAuth integration

Role-based authorization

Profile management with verification support


# 📊 Dashboards & Insights

User dashboard with donation history

Admin dashboard for platform control

Campaign performance metrics

Live status updates


# 🎨 UI / UX

Mobile-first responsive design

Dark theme with smooth animations

Reusable component system

Accessible and keyboard-friendly UI


# 🔒 Security

Password hashing using bcrypt

JWT-based session handling

Input validation (client + server)
 
Secure headers with Helmet

CORS protection


# 🧱 Tech Stack

Frontend

React 19 + Vite

Tailwind CSS 4

Zustand for state management

Framer Motion for animations

Axios for API communication


Backend

Node.js + Express

MongoDB & Mongoose

JWT & Passport.js

Cloudinary & Multer for media handling

Helmet & CORS for security


# 🗂️ Project Structure

Frontend

frontend/
├── components/
├── pages/
├── layout/
├── lib/
├── ui/
└── main.jsx

Backend

backend/
├── models/
├── routes/
├── controllers/
├── middleware/
├── services/
└── utils/



# 🧾 Data Models (Simplified)

User

Name, Email, Password

Role (User / Admin)

OAuth support

Soft delete & verification flags


Campaign

Title & description

Target & collected amount

Category & status

Creator reference


Donation

Donor & campaign reference

Amount & type

Status tracking


# 🚀 Performance & Scalability

Lazy loading & code splitting

CDN-based image delivery

Optimized API responses

Modular architecture ready for scaling

Docker & cloud-deployment ready



# 🔮 Future Enhancements

Real-time analytics via WebSockets

Multi-language & multi-currency support

Community engagement features

Advanced reporting & insights

Volunteer & campaign update system


# 📌 Why DonateUs?

DonateUs isn’t just another CRUD app — it’s a production-grade crowdfunding platform that demonstrates:

Strong full-stack engineering

Clean system architecture

Modern UI/UX thinking

Secure authentication & authorization

Scalable backend design

