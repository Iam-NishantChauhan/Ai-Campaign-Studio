# AI Campaign Studio

AI Campaign Studio is a full-stack AI-powered marketing platform for creating campaigns, generating marketing content, publishing campaign-specific landing pages, capturing leads, and viewing campaign analytics.

[📊 View Project Presentation](./docs/AI-Campaign-Studio-Presentation.pptx)

The project demonstrates an end-to-end workflow:

```text
Landing Page
    ↓
Sign Up / Login
    ↓
Dashboard
    ↓
Create Campaign
    ↓
Generate AI Content
    ↓
Campaign Landing Page
    ↓
CTA / Lead Form
    ↓
Lead + Analytics Event
    ↓
Leads / Analytics Dashboard
```

---

## Features

### Public Experience
- Polished product landing page at `/`
- Sign Up and Login entry points
- Responsive public UI
- Campaign-specific public landing pages
- Public campaign links can be shared with visitors without requiring dashboard access

### Authentication
- User registration
- Login and logout
- JWT-based authentication
- Cookie-based session handling
- Protected APIs
- `getCurrentUser` authentication utility
- User-specific campaign access
- Sign Up → Login → Dashboard flow

### Campaign Management
- Create campaigns
- View campaigns
- Edit campaigns
- Delete campaigns
- Campaign ownership checks
- Store campaign name, brand, product, goal, target audience, and budget

### AI Content Generation
- Google Gemini integration
- Server-side AI requests
- Structured generated content
- Headline generation
- Instagram caption
- LinkedIn post
- Email subject
- Email body
- Call to action
- Persisted AI generations
- Regenerate content
- Previous-generation history
- Switch between previous and current generations

### Landing Pages
Each campaign has its own public landing page:

```text
/campaign/[id]
```

The landing page:
- Uses campaign-specific information and generated AI content
- Provides a visitor-facing campaign experience
- Contains a CTA connected to the lead form
- Can be opened separately from the dashboard
- Can be shared with users as the public campaign link

### Lead Capture
- Public visitors can submit their name and email
- Leads are connected to the correct campaign
- Lead input is validated
- Lead creation and analytics event creation happen in a database transaction
- Dashboard users can view leads belonging to their campaigns

### Analytics
- Campaign analytics events
- Lead-capture tracking
- `LEAD_CAPTURE` event creation
- Analytics dashboard
- Campaign / Leads / Analytics tabs

### Dashboard UI
The dashboard is organized into three main areas:

- **Campaigns**
  - Create
  - Edit
  - Delete
  - Generate / regenerate AI content
  - View previous generations
  - Open campaign landing page
- **Leads**
  - View captured leads
- **Analytics**
  - View campaign analytics

Additional UI features:
- Responsive campaign cards
- Create/Edit campaign dialog
- Loading states
- Error states
- Previous generation selector
- Landing-page preview/share link
- Consistent public, authentication, and dashboard styling

---

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Authentication | JWT + Cookies |
| AI | Google Gemini |
| Forms | React Hook Form |

---

# Application Flow

## Complete User Flow

```text
Public Landing Page
        │
        ├── Sign Up
        │     ↓
        │   Login
        │     ↓
        │  Dashboard
        │
        └── Login
              ↓
           Dashboard
              │
      ┌───────┼────────┐
      ↓       ↓        ↓
 Campaigns   Leads   Analytics
      │
      ├── Create / Edit / Delete
      │
      └── Generate / Regenerate AI Content
              │
              ↓
       Campaign Landing Page
              │
              ↓
          Share Link
              │
              ↓
        Public Visitor
              │
              ↓
          CTA / Lead Form
              │
              ↓
         POST /api/leads
              │
              ├── Create Lead
              └── Create Analytics Event
```

The important point is that **the campaign owner creates the campaign and shares its public landing-page link**. Visitors do not need to create a lead manually in the dashboard; they submit the form on the public landing page, and the lead is stored automatically.

---

# Project Architecture

```text
Browser
   │
   ├── Public Landing Page
   ├── Sign Up / Login
   └── Dashboard
          │
          ↓
      Next.js API
          │
     ┌────┼─────────────┐
     ↓    ↓             ↓
   Auth Campaigns       AI
     │    │             │
     └────┼─────────────┘
          ↓
       Prisma
          ↓
     PostgreSQL
```

For AI generation:

```text
Campaign
   ↓
Dashboard
   ↓
POST /api/ai/generate
   ↓
Server-side Gemini call
   ↓
Structured AI response
   ↓
AiContent record
   ↓
Dashboard
```

For lead capture:

```text
Campaign Landing Page
        ↓
     Lead Form
        ↓
POST /api/leads
        ↓
     Zod validation
        ↓
Campaign verification
        ↓
   Prisma transaction
      ↙          ↘
    Lead      AnalyticsEvent
```

---

# Project Structure

A simplified structure of the application:

```text
.
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── campaigns/
│   │   ├── ai/
│   │   ├── leads/
│   │   └── analytics/
│   │
│   ├── campaign/
│   │   └── [id]/
│   │
│   ├── dashboard/
│   │
│   ├── login/
│   │
│   ├── register/
│   │
│   └── page.tsx
│
├── components/
│   ├── CampaignCard.tsx
│   ├── CampaignList.tsx
│   ├── CreateCampaignDialog.tsx
│   ├── LeadsPanel.tsx
│   ├── AnalyticsPanel.tsx
│   └── ui/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── gemini.ts
│
├── prisma/
│   └── schema.prisma
│
├── types/
│   └── campaign.ts
│
├── validations/
│   ├── campaign.schema.ts
│   └── lead.schema.ts
│
└── README.md
```

> The dashboard UI is divided into the three functional areas **Campaigns, Leads, and Analytics**. The exact component nesting may vary as the implementation evolves.

---

# Local Development

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

Use the variable names required by the project:

```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="your_secure_secret"
```

Never commit `.env.local` or secret keys to GitHub.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Apply the development database schema

```bash
npx prisma migrate dev
```

## 6. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Database Design

The main relationships are:

```text
User
 │
 └── Campaign
       │
       ├── AiContent
       │
       ├── Lead
       │
       └── AnalyticsEvent
```

This allows users, campaigns, AI generations, leads, and analytics events to remain properly connected.

### Important Prisma concept

`AiContent[]` is a Prisma relation, not a PostgreSQL array column.

The relationship is one-to-many:

```text
Campaign
   │
   ├── AiContent #1
   ├── AiContent #2
   └── AiContent #3
```

Keeping AI generations separate preserves generation history instead of overwriting previous content.

---

# Authentication Flow

```text
Register
   ↓
Validate input
   ↓
Hash password
   ↓
Store user
   ↓
Login
   ↓
Verify credentials
   ↓
Create JWT
   ↓
Set authentication cookie
   ↓
Dashboard
```

Authentication answers:

> Who is the user?

Authorization answers:

> Is this user allowed to access this resource?

Protected campaign operations verify ownership using the authenticated user's ID.

---

# Campaign Ownership

Campaign operations do not trust a campaign ID by itself.

The server verifies that the requested campaign belongs to the authenticated user before allowing protected operations such as:

- Update
- Delete
- AI generation
- User-specific retrieval

This prevents one user from accessing or modifying another user's campaign by changing an ID in the request.

---

# AI Design

The browser does **not** call Gemini directly.

Instead:

```text
React
  ↓
Next.js API
  ↓
Gemini
```

This keeps the Gemini API key on the server.

Generated content is structured into fields such as:

```text
headline
instagramCaption
linkedinPost
emailSubject
emailBody
callToAction
```

Structured data makes the response easier to validate, persist, query, and display.

---

# Lead + Analytics Transaction

When a visitor submits a lead:

1. Validate the request.
2. Verify the campaign.
3. Create the lead.
4. Create a `LEAD_CAPTURE` analytics event.
5. Commit both operations together.

Using a transaction prevents the system from storing one operation while failing the other.

---

# API Overview

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Campaigns

```text
GET    /api/campaigns
POST   /api/campaigns
PUT    /api/campaigns/[id]
DELETE /api/campaigns/[id]
```

## AI

```text
POST /api/ai/generate
```

## Leads

```text
POST /api/leads
GET  /api/leads
```

---

# Error Handling

The application handles errors at multiple levels:

- Client-side form validation
- API request validation
- Authentication checks
- Campaign ownership checks
- Database errors
- AI generation failures
- Loading states
- User-facing error messages

Zod is used for important request validation before data is persisted.

---

# Security Considerations

- Never expose `GEMINI_API_KEY` to client-side code.
- Keep Gemini calls server-side.
- Never commit `.env.local`.
- Authenticate protected APIs.
- Verify campaign ownership before protected campaign mutations.
- Scope lead queries through campaigns owned by the authenticated user.
- Validate incoming request bodies.
- Avoid returning sensitive server-side error details to users.

---

# Testing Checklist

### Authentication

- [ ] Open `/`
- [ ] Click Sign Up
- [ ] Create an account
- [ ] Confirm redirect to Login
- [ ] Login
- [ ] Confirm redirect to Dashboard
- [ ] Logout
- [ ] Confirm protected dashboard behavior

### Campaigns

- [ ] Create campaign
- [ ] Edit campaign
- [ ] Delete campaign
- [ ] Verify campaign ownership

### AI

- [ ] Generate AI content
- [ ] Generate another version
- [ ] Verify previous generations
- [ ] Switch between generations
- [ ] Confirm current content remains visible

### Landing Page

- [ ] Open `/campaign/[id]`
- [ ] Verify campaign-specific content
- [ ] Confirm the landing page can be shared
- [ ] Open the link as a visitor
- [ ] Click the CTA
- [ ] Submit the lead form

### Leads

- [ ] Open Leads tab
- [ ] Verify submitted lead appears
- [ ] Test invalid name
- [ ] Test invalid email

### Analytics

- [ ] Open Analytics tab
- [ ] Verify analytics data loads
- [ ] Confirm lead capture is reflected

### UI

- [ ] Test desktop
- [ ] Test mobile
- [ ] Check loading states
- [ ] Check error states
- [ ] Check dialogs
- [ ] Check browser console

---

# Key Engineering Decisions

### Why Next.js?

Next.js allows the project to combine the React frontend and server-side API logic in one full-stack application.

### Why PostgreSQL + Prisma?

The application has relational data:

```text
User → Campaign → AiContent
                 → Lead
                 → AnalyticsEvent
```

PostgreSQL fits this relational model, while Prisma provides typed database access.

### Why JWT cookies?

JWT cookies allow the server to verify authentication while keeping the token away from normal client-side application state.

### Why store AI content separately?

A campaign can have multiple AI generations. A separate `AiContent` model preserves that history and allows the UI to switch between generations.

### Why not call Gemini from React?

The Gemini API key must remain server-side. The frontend calls the application's API instead.

### Why use a transaction for lead capture?

Lead creation and its analytics event represent one business action, so they should succeed or fail together.

---

# Future Improvements

Possible future enhancements include:

- Campaign performance charts
- Advanced analytics filters
- Pagination for large lead lists
- Search and filtering
- Campaign statuses such as Draft / Active / Completed
- Richer landing-page customization
- Image generation for campaigns
- Email notifications
- Role-based access control
- Automated unit/integration/end-to-end testing
- Rate limiting
- Scheduled campaign publishing

These are future improvements; the current application already provides the core end-to-end campaign workflow.

---

# Interview Questions

## Authentication

1. Why JWT instead of server-side sessions?
2. What is the difference between authentication and authorization?
3. Why hash passwords with bcrypt?
4. Why store JWT in a cookie?
5. How does `getCurrentUser()` work?
6. How do protected APIs enforce authorization?

## Database / Prisma

1. Why is `AiContent` a separate model?
2. Is `AiContent[]` a PostgreSQL array?
3. Where is the foreign key stored?
4. How does the Campaign → AiContent relation work?
5. Why check campaign ownership before update/delete?
6. Why use a Prisma transaction for lead + analytics creation?

## AI / System Design

1. Why call Gemini from the server instead of React?
2. How do you protect the Gemini API key?
3. Why use structured JSON instead of plain text?
4. How do you handle malformed AI responses?
5. How would you reduce AI cost and latency?
6. How would you scale AI generation for many concurrent users?

## Full-Stack

1. Explain the complete request flow.
2. How does data move from React to PostgreSQL?
3. How would you prevent unauthorized campaign access?
4. How would you handle concurrent AI generation requests?
5. How would you scale lead retrieval?
6. What would you test first?
7. What would you improve in a second version?

---

# Project Summary

**AI Campaign Studio** demonstrates an end-to-end full-stack workflow:

```text
Landing Page
      ↓
Sign Up / Login
      ↓
Dashboard
      ↓
Campaign Management
      ↓
AI Content Generation
      ↓
Public Campaign Landing Page
      ↓
Lead Capture
      ↓
Analytics
```

The project combines frontend development, API design, authentication, authorization, relational database modeling, AI integration, transactions, lead capture, analytics, and responsive UI into one application.

---

## Author

**Nishant**

AI Campaign Studio — Full-Stack Portfolio Project
