# <img src="public/icon.svg" alt="BudgetTracker Logo" width="36" height="36" style="margin-right: 8px;"> BudgetTracker - Personal Finance Management App

A modern, full-stack budget tracking application built with Next.js, TypeScript, and PostgreSQL. Track your income, expenses, and financial goals with beautiful visualizations and comprehensive analytics.

## 🚀 Live Demo

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://budget-tracker-x.vercel.app)

## 📱 Screenshots

### Dashboard Overview

![Dashboard Overview](public/screenshots/dashboard-overview.png)
_Comprehensive financial overview with overall statistics and analytics_

### Monthly Analytics

![Monthly Analytics](public/screenshots/dashboard-monthly.png)
_Monthly breakdown with detailed charts and category analysis_

### Range Analytics

![Range Analytics](public/screenshots/dashboard-range.png)
_Custom date range analytics with trend analysis_

### Profile Management

![Profile Management](public/screenshots/profile.png)
_User profile with account settings and preferences_

## ✨ Features

### 🔐 Authentication & Security

- **Secure Authentication** with NextAuth.js
- **Password Protection** with bcryptjs encryption
- **Session Management** with secure cookies
- **Route Protection** via middleware
- **Account Management** with profile settings

### 💰 Financial Tracking

- **Income & Expense Tracking** with detailed categorization
- **Transaction Management** (Create, Read, Update, Delete)
- **Base Balance Management** for accurate financial calculations
- **Multi-Currency Support** with configurable currency settings
- **Date-based Filtering** with timezone-aware handling

### 📊 Advanced Analytics

- **Overall Summary** with lifetime financial statistics
- **Monthly Analytics** with period-specific insights
- **Range Analytics** with custom date range selection
- **Visual Charts** using Recharts library:
  - Bar charts for income vs expenses
  - Pie charts for category breakdown
  - Line charts for trend analysis
  - Category trends over time

### 🎨 Modern UI/UX

- **Responsive Design** that works on all devices
- **Modern Landing Page** with feature highlights
- **Beautiful Dashboard** with intuitive navigation
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Dark/Light Theme** support

### 🔧 Developer Experience

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prisma ORM** for database management
- **Tailwind CSS** for styling
- **Turbopack** for fast development

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend

- **Next.js API Routes** for serverless functions
- **NextAuth.js** for authentication
- **Prisma ORM** for database operations
- **PostgreSQL** for data storage
- **bcryptjs** for password hashing

### Development Tools

- **TypeScript** for type safety
- **ESLint** for code linting
- **Turbopack** for fast builds
- **Prisma Studio** for database management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/h-sharda/budget-tracking-app.git
   cd budget-tracking-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/budget_tracker"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
budget-tracking-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── profile/           # Profile page
│   │   └── transactions/      # Transaction pages
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   ├── profile/           # Profile components
│   │   ├── transactions/      # Transaction components
│   │   └── ui/                # Reusable UI components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── constants/             # App constants
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── screenshots/               # App screenshots
```

## 🔧 Configuration

### Database Schema

The app uses the following main models:

- **User**: User accounts with profile information
- **Transaction**: Financial transactions (income/expense)
- **Account**: OAuth account connections
- **Session**: User sessions

### Environment Variables

| Variable          | Description                  | Required |
| ----------------- | ---------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string | Yes      |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js       | Yes      |
| `NEXTAUTH_URL`    | Base URL for the application | Yes      |

## 📊 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Dashboard

- `GET /api/dashboard` - Overall financial statistics
- `GET /api/dashboard/period` - Period-specific analytics
- `GET /api/dashboard/range` - Range-based analytics

### Transactions

- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile/basic` - Update basic info
- `PUT /api/profile/email` - Update email
- `PUT /api/profile/password` - Update password

## 🎯 Key Features Explained

### Financial Overview

The dashboard provides three levels of financial analysis:

1. **Overall Summary**: Lifetime financial statistics including base balance, total income, total expenses, and net balance
2. **Period Analytics**: Monthly/yearly breakdown with detailed charts and category analysis
3. **Range Analytics**: Custom date range analysis with trend insights

### Transaction Management

- **Categorization**: Organize transactions by categories (Food, Rent, Entertainment, etc.)
- **Type Classification**: Separate income and expense tracking
- **Date Filtering**: Filter transactions by specific time periods
- **Search & Sort**: Find transactions quickly with search and sorting options

### Data Visualization

- **Interactive Charts**: Hover effects and detailed tooltips
- **Responsive Design**: Charts adapt to different screen sizes
- **Real-time Updates**: Data updates immediately after changes
- **Export Capabilities**: Save charts and reports (future feature)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic builds on push

### Other Platforms

The app can be deployed on any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

**Made by [h-sharda](https://github.com/h-sharda)**
