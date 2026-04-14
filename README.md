# StreamIQ - Directorial Suite 🎬📈

![StreamIQ Banner](https://img.shields.io/badge/Status-Presentation_Ready-brightgreen.svg)
![React](https://img.shields.io/badge/Backend-MongoDB%20%7C%20Node.js-green.svg)
![React](https://img.shields.io/badge/Frontend-Vite%20%7C%20React%20%7C%20Tailwind-blue.svg)

**StreamIQ** is a premium, full-stack Content Analytics Hub built specifically for streaming executives. It offers powerful, real-time insights into content distribution, audience engagement, and genre performance. Designed with a custom **"Liquid Glass"** aesthetic, StreamIQ bridges the gap between raw data manipulation and beautiful data visualization.

---

## 🔥 Features
*   **Intelligent Content Explorer:** Interface directly with over 8,800+ titles backed by a MongoDB cluster.
*   **Dual Data Architecture:** Seamlessly merges a Netflix dataset with live data fetched via the **TMDB API**, allowing you to explore modern titles and natively play their official YouTube trailers right inside the dashboard.
*   **Regex-Powered Filters:** A robust backend query system using MongoDB `$regex` mappings to safely and perfectly capture nuanced media genres without fatal indexing crashes.
*   **Dynamic Custom Reporting:** Export tailored, deeply customized analytics modules across PDF and CSV formats. 
*   **Data Visualization UI:** Implemented utilizing Recharts to provide visually stunning distributions of Region, Rating, and Genre mappings. 
*   **Directorial Detail View:** An executive-styled overview of simulated content engagement, retention, and exact metadata.

---

## 🛠️ Technology Stack
*   **Fullstack MERN:** Node.js, Express.js, MongoDB (Atlas), React.js (Vite)
*   **Design:** Tailwind CSS w/ custom `.liquid-glass` tokens (Backdrop-blur, Deep Theme)
*   **Third-Party API:** The Movie Database (TMDB) integration for modern poster rendering, trailer traversal, and title seeding.
*   **Graphs:** Recharts

---

## 🚀 Local Development Setup

To run StreamIQ's Directorial Suite locally on your machine, follow these steps:

### 1. Requirements
Ensure you have Node.js and npm installed.

### 2. Environment Configurations (`.env`)
You will need `.env` files located in the root of the project to interface with TMDB and MongoDB correctly:
```properties
# .env (Found in root & frontend)
VITE_TMDB_API_KEY="YOUR_TMDB_API_KEY"

# server/.env
MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
PORT=5000
```

### 3. Backend Initialization
```bash
cd server
npm install
npm run serve
```
*The backend should default to `http://localhost:5000`.*

### 4. Frontend Initialization
Open a new terminal window at the project root:
```bash
npm install
npm run dev
```
*The frontend should default to `http://localhost:3004` (Vite Proxy mapped to port 5000).*

---

## 👨‍💻 Author
Developed by **Sourish** (Software & Database Engineering).

> *This project serves as a comprehensive DBMS Mini-Project demonstrating capable database routing securely connected to dynamic front-end aesthetic logic.*
