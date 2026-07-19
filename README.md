# NexHire ATS (Decoupled Architecture)
> A modern, lightweight, and production-ready Applicant Tracking System built for speed and reliability.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Live Demo:** [Coming Soon]

## 📖 Project Overview
NexHire is a full-stack SaaS Applicant Tracking System (ATS) engineered to streamline the hiring process. Built with a decoupled architecture, it separates the client-side rendering from the data API to ensure high performance, distinct scalability, and clean separation of concerns.

## 🛠️ Technology Stack
**Frontend (`/nexhire-client`)**
* **Framework:** React 19 + Vite (Single Page Application)
* **Language:** TypeScript (Strict Mode)
* **Routing:** React Router
* **Styling:** Tailwind CSS

**Backend (`/nexhire-api`)**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (via `pg` native client)
* **Validation:** Zod
* **Authentication:** JWT (JSON Web Tokens) & bcrypt

## 🏗️ Architecture & Data Flow
NexHire abandons the monolithic approach in favor of a standard RESTful architecture. 

* **The Client:** A lightweight React SPA handles all UI state, rendering, and route protection. It communicates with the backend exclusively via standard HTTP JSON requests.
* **The API:** An Express server handles business logic, JWT issuance, and Role-Based Access Control (RBAC). 
* **Data Access:** Direct PostgreSQL querying using the native `pg` driver ensures zero ORM overhead and maximum query efficiency.

## 🚀 Quick Start (Local Development)

### 1. Start the Backend API
```bash
cd nexhire-api
npm install
# Configure your .env with DATABASE_URL
npm run dev # Starts the Express server on localhost:5000
```


```bash
cd nexhire-client
npm install
npm run dev # Starts the Vite React app on localhost:5173
```