# 🚀 AI Campaign Studio

An AI-powered marketing campaign platform that helps marketers create, manage, and launch campaign experiences from a single interface.

## 📌 Project Overview

AI Campaign Studio enables marketers to:

- Create marketing campaigns
- Generate AI-powered campaign content
- Publish campaign landing pages
- Capture customer leads
- Manage campaigns from a centralized dashboard

This project is being built as part of a Full Stack Software Engineer assignment.

---

## ✨ Features

### ✅ Campaign Management
- Create campaigns
- Edit campaigns
- Delete campaigns
- View all campaigns

### 🤖 AI Content Generation
- Campaign Headlines
- Ad Copy
- Landing Page Content
- Call-To-Actions
- Social Media Captions

### 📄 Landing Pages
- Hero Section
- Product Overview
- Benefits
- Testimonials
- Contact Form

### 📩 Lead Management
- Lead Capture
- Demo Requests
- Consultation Requests
- Waitlist Registration

### 📊 Dashboard
- Campaign List
- Lead Management
- Campaign Analytics
- Search Campaigns

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes
- Prisma ORM

### Database
- PostgreSQL

### AI
- Google Gemini API *(Planned)*

### Deployment
- Vercel *(Planned)*

---

## 📁 Project Structure

```
src/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   └── page.tsx
│
├── components/
│
├── lib/
│   └── prisma.ts
│
├── services/
│
└── types/

prisma/
│
├── migrations/
└── schema.prisma
```

---

## 🗄️ Database

Current database model:

### Campaign

| Field | Type |
|--------|------|
| id | String |
| campaignName | String |
| brandName | String |
| productName | String |
| campaignGoal | String |
| targetAudience | String |
| createdAt | DateTime |
| updatedAt | DateTime |

Future models:

- User
- Lead
- AIContent
- Analytics

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_campaign_studio"
```

### Run Database Migration

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📌 Development Progress

### ✅ Completed

- Next.js Setup
- PostgreSQL Setup
- Prisma ORM Integration
- Campaign Database Model
- Create Campaign API
- Get Campaign API

### 🚧 In Progress

- Campaign Dashboard
- Landing Page Builder
- AI Content Generation

### 📅 Planned

- Authentication
- Lead Capture
- Analytics Dashboard
- AI Image Generation
- Deployment

---

## 📷 Screenshots

*(Will be added during development.)*

---

## 👨‍💻 Author

**Nishant**

Software Engineer | Full Stack Developer

GitHub: [https://github.com/<your-github-username>](https://github.com/Iam-NishantChauhan)

---

## 📄 License

This project is created for evaluation purposes as part of a Full Stack Engineering assignment.
