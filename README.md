<div align="center">

<img src="https://img.shields.io/badge/FinTrack-Pro-6c63ff?style=for-the-badge&logoColor=white" alt="FinTrack Pro" />

# FinTrack Pro
### AI-Powered Personal Finance Tracker

A modern full-stack personal finance management application that helps users track income, expenses, budgets, and spending patterns through intelligent analytics and AI-generated insights.

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6c63ff?style=for-the-badge&logo=vercel&logoColor=white)](https://fin-track-pro-three.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/charuishika/FinTrack-Pro)

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq-FF6B35?style=flat-square&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## Screenshots

### Dashboard
<!-- Add your Dashboard screenshot here -->
<!-- Drag and drop your screenshot image below this line -->

&nbsp;

### Transactions
<!-- Add your Transactions page screenshot here -->
<!-- Drag and drop your screenshot image below this line -->

&nbsp;

### Budgets & Alerts
<!-- Add your Budgets page screenshot here -->
<!-- Drag and drop your screenshot image below this line -->

&nbsp;

### AI Insights
<!-- Add your AI Insights screenshot here -->
<!-- Drag and drop your screenshot image below this line -->

&nbsp;

### Progressive Web App (PWA)
<!-- Add your PWA install screenshot here -->
<!-- Drag and drop your screenshot image below this line -->

&nbsp;

---

## Features

<table>
<tr>
<td width="50%">

### Authentication & Security
- JWT-based User Authentication
- Secure Password Hashing (bcrypt)
- Protected API Routes
- Persistent Login Sessions

### Transaction Management
- Add / Edit / Delete Transactions
- Filter by Category and Type
- Export All Transactions as CSV
- Export Filtered Transactions as CSV

### Budget Management
- Create and Edit Monthly Budgets
- Delete Budgets with Confirmation
- Budget Utilization Tracking
- Overspending Detection

</td>
<td width="50%">

### Dashboard & Analytics
- Income vs Expense Area Chart
- Category-wise Expense Donut Chart
- Savings Rate Calculation
- Net Savings Tracking
- Real-Time Budget Alerts on Dashboard

### AI-Powered Insights
- Personalized Financial Recommendations
- Spending Pattern Analysis
- Savings Suggestions
- Budget Improvement Tips
- Powered by Groq AI (Llama 3.3 70B)

### User Experience
- Dark Mode & Light Mode Toggle
- Fully Responsive Design
- Mobile-Friendly Interface
- Installable PWA (Progressive Web App)

</td>
</tr>
</table>

---

## Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td>Frontend</td>
<td>React 18, React Router v6</td>
<td>UI components and navigation</td>
</tr>
<tr>
<td>State Management</td>
<td>React Context API</td>
<td>Global auth and finance state</td>
</tr>
<tr>
<td>Charts</td>
<td>Recharts</td>
<td>Area chart and donut chart</td>
</tr>
<tr>
<td>HTTP Client</td>
<td>Axios</td>
<td>API requests to backend</td>
</tr>
<tr>
<td>Backend</td>
<td>Node.js + Express.js</td>
<td>REST API server</td>
</tr>
<tr>
<td>Database</td>
<td>MongoDB Atlas</td>
<td>Cloud NoSQL database</td>
</tr>
<tr>
<td>Authentication</td>
<td>JWT + bcryptjs</td>
<td>Secure login system</td>
</tr>
<tr>
<td>AI Integration</td>
<td>Groq API (Llama 3.3 70B)</td>
<td>Financial insights generation</td>
</tr>
<tr>
<td>Frontend Hosting</td>
<td>Vercel</td>
<td>Auto-deploy from GitHub</td>
</tr>
<tr>
<td>Backend Hosting</td>
<td>Render</td>
<td>Node.js server hosting</td>
</tr>
<tr>
<td>PWA</td>
<td>Service Worker + Web Manifest</td>
<td>Installable app + offline support</td>
</tr>
</table>

---

## Architecture

```
Browser (React)
      │
      │  HTTP requests (Axios)
      ▼
Express Server (Node.js) — Render
      │
      ├── /api/auth          → Register, Login, Get user
      ├── /api/transactions  → CRUD + Aggregation + CSV Export
      ├── /api/budgets       → Budget management with spending join
      └── /api/insights      → Groq AI analysis
      │
      ▼
MongoDB Atlas (Cloud Database)
      │
      ├── Users collection
      ├── Transactions collection
      └── Budgets collection
```

---

## Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier)
- Groq API key (free at console.groq.com)

### 1. Clone Repository

```bash
git clone https://github.com/charuishika/FinTrack-Pro.git
cd FinTrack-Pro
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## Progressive Web App (PWA)

FinTrack Pro can be installed directly from the browser as a native desktop or mobile app.

**Desktop (Chrome):**
1. Open the live demo link in Chrome
2. Click the install icon in the address bar
3. Click Install — app opens like a native desktop application

**Android:**
1. Open in Chrome → tap the 3-dot menu
2. Tap "Add to Home Screen" → Install

**iPhone:**
1. Open in Safari → tap the Share button
2. Tap "Add to Home Screen" → Add

**PWA Features:**
- Installable on Desktop and Mobile
- Standalone App Experience (no browser UI)
- Service Worker caching for faster loading
- Fully responsive interface

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | List transactions (filterable) |
| POST | `/api/transactions` | Add transaction |
| PUT | `/api/transactions/:id` | Edit transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Monthly chart data |
| GET | `/api/transactions/by-category` | Pie chart data |
| GET | `/api/budgets` | Get budgets with spending |
| POST | `/api/budgets` | Create/update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
| POST | `/api/insights/analyze` | Get AI insights |

---

## Future Enhancements

- Transaction Search & Advanced Filters
- User Profile Management
- PDF Financial Reports
- Goal-Based Savings Tracking
- Advanced Spending Analytics
- Multi-currency Support
- Email Notifications for Budget Alerts

---

## Author

<div align="center">

**Charuishika S**

B.Tech Computer Science Engineering
SASTRA Deemed University

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-linkedin-here)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/charuishika)

</div>

---

<div align="center">

Made with dedication for TCS Recruitment 2025

⭐ Star this repo if you found it helpful!

</div>
