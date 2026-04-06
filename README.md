# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React. Designed to help users track transactions, understand spending patterns, and gain financial insights.

---

## Live Demo

> Run locally using the instructions below.

---

## Tech Stack

- **React** (via Vite) — UI framework
- **Tailwind CSS** — Styling
- **Recharts** — Charts and data visualizations
- **Framer Motion** — Animations and transitions
- **React Router v6** — Client-side routing
- **Context API** — Global state management

---

## Features

### Dashboard
- Summary cards showing Total Balance, Income, and Expenses
- Area chart showing monthly income vs expense trends
- Donut chart showing spending breakdown by category
- Recent transactions list

### Transactions
- Full transaction table with date, category, type, and amount
- Search by description or category
- Filter by category and type (income / expense)
- Sort by date or amount
- Admin-only: Add, edit, and delete transactions

### Insights
- Top spending category
- Best and worst savings months
- Average monthly expense
- Bar chart of spending by category
- Month-by-month income, expense, and savings comparison table

### Role-Based UI
- **Viewer** — Read-only access to all data
- **Admin** — Can add, edit, and delete transactions
- Switch roles using the dropdown in the navbar (no login required — frontend simulation)

### Dark Mode
- Full dark / light mode toggle
- Persists across all pages via Context

---

## Project Structure
```
src/
├── components/
│   └── layout/            # Sidebar, Navbar, Layout wrapper
├── context/
│   └── AppContext.jsx      # Global state (transactions, role, theme, filters)
├── data/
│   └── mockData.js         # Static mock transactions and category config
├── pages/
│   ├── Dashboard.jsx       # Overview page with charts
│   ├── Transactions.jsx    # Transaction table with filters
│   └── Insights.jsx        # Spending insights and comparisons
└── App.jsx                 # Routes
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/OmJaiswal05/finance-dashboard.git
cd finance-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Design Decisions

- **Context API over Redux** — The app state is straightforward (transactions, filters, role, theme). Context API is sufficient and keeps the codebase lean without adding Redux boilerplate.
- **Mock data** — All data is static and lives in `mockData.js`. No backend is required. The Admin role allows runtime additions and edits that persist for the session.
- **Framer Motion** — Used for staggered card animations on page load and smooth modal transitions, adding polish without overcomplicating the code.
- **Recharts** — Chosen for its React-native API and easy composability with custom tooltips and gradients.
- **Responsive layout** — Sidebar collapses on mobile with a hamburger menu. All grids adapt from 1 to 3 columns.

---

## Assumptions

- Authentication is out of scope — role switching is a UI-only simulation via a dropdown.
- Data does not persist across page refreshes (no localStorage or backend). Admin changes are session-only.
- All amounts are in Indian Rupees (₹).