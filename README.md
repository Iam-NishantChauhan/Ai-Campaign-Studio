AI Campaign Studio — Project Context for Codex

1. Project Overview

AI Campaign Studio is a full-stack AI-powered marketing platform.

The goal is to let authenticated users create marketing campaigns and use Google Gemini to generate campaign content such as:

Headlines

Instagram captions

LinkedIn posts

Email subjects

Email bodies

Calls to action

Planned future features:

AI content regeneration/history

AI-powered campaign landing pages

Lead capture

Leads dashboard

Analytics

Deployment/polish

IMPORTANT: Read this file before making changes. Inspect the existing code before editing it. Do not recreate features that are already implemented.

2. Tech Stack

Next.js

React

TypeScript

Tailwind CSS

PostgreSQL

Prisma ORM

JWT authentication

Cookie-based authentication

Google Gemini API

@google/genai version 2.12.0

The project uses the Next.js App Router.

3. Current Project Structure / Important Areas

Relevant areas include:

app/ — Next.js App Router pages and API routes

components/ — frontend components

lib/auth.ts — current-user authentication helper

lib/jwt.ts — JWT creation/verification

lib/prisma.ts — Prisma singleton

lib/utils.ts — utility functions

lib/gemini.ts — Gemini integration

prisma/schema.prisma — database schema

Do not assume exact filenames beyond the ones explicitly listed above. Inspect the repository before modifying files.

4. Authentication — COMPLETED

Authentication has already been implemented.

Flow:

Signup:

User submits signup form.

Password is hashed.

User is stored in PostgreSQL.

Login verifies credentials.

JWT is generated.

JWT is stored in a cookie named token.

Protected APIs use getCurrentUser().

Current lib/auth.ts behavior:

Reads cookies using Next.js cookies().

Gets token.

If no token, returns null.

Verifies token using verifyToken().

Finds user with Prisma.

Returns:

id

name

email

Invalid/missing authentication returns null.

Important:
Do not unnecessarily redesign the authentication system.

Existing auth-related functionality includes:

Signup

Login

JWT

Cookie-based token

getCurrentUser()

/api/auth/me

Logout

5. Campaign Functionality — COMPLETED

Campaign CRUD foundation is already implemented.

Existing functionality:

Create campaign

Get campaigns

Delete campaign

Dashboard campaign list

Campaign cards

Campaign data includes:

id

campaignName

brandName

productName

campaignGoal

targetAudience

budget

userId

createdAt

updatedAt

Campaign ownership/security is important.

Protected campaign queries should verify the campaign belongs to the authenticated user, e.g.:

where: {
  id: campaignId,
  userId: user.id
}

Do not remove ownership checks.

6. Database Relationship

The intended relationship is:

User
|
| one-to-many
v
Campaign
|
| one-to-many
v
AiContent

Important Prisma concept:

aiContents AiContent[] in the Campaign model is a Prisma relation field. It is NOT an array column in PostgreSQL.

The actual relationship is implemented by the foreign key campaignId in the AiContent table.

Example conceptually:

Campaign table:

C1 = Nike Summer Sale

AiContent table:

A1, campaignId = C1

A2, campaignId = C1

A3, campaignId = C1

One campaign can therefore have multiple AI generations.

7. Current Prisma AI Model — COMPLETED

The AI model was originally named AIContent and was renamed to AiContent for cleaner Prisma Client usage.

The current model should be verified in prisma/schema.prisma, but its intended structure is:

model AiContent {
  id                 String   @id @default(cuid())
  headline           String
  instagramCaption   String
  linkedinPost       String
  emailSubject       String
  emailBody          String
  callToAction       String

  campaignId         String
  campaign           Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

  createdAt          DateTime @default(now())
}

Campaign has:

aiContents AiContent[]

A migration was successfully created/applied for AI content, and the model was subsequently renamed to AiContent.

Prisma Client version currently in use:
6.19.3

DO NOT upgrade Prisma to v7 unless explicitly requested. A major version upgrade was shown as available, but it was intentionally not performed because development is in progress.

8. Gemini Integration — COMPLETED

Google Gemini has been successfully connected.

Installed SDK:

@google/genai@2.12.0

A Gemini service file exists:

lib/gemini.ts

The service uses GoogleGenAI and reads the API key from an environment variable.

The API key must NEVER be exposed to the browser/client.

The frontend should call our Next.js backend API, not Gemini directly.

Gemini is instructed to return structured JSON:

{
  "headline": "",
  "instagramCaption": "",
  "linkedinPost": "",
  "emailSubject": "",
  "emailBody": "",
  "callToAction": ""
}

A successful Gemini test was completed.

Example successful response:

{
  "headline": "Unlock Your Fastest Summer Yet",
  "instagramCaption": "...",
  "linkedinPost": "...",
  "emailSubject": "Flash Sale: Your new personal best is waiting",
  "emailBody": "...",
  "callToAction": "Shop The Sale"
}

There was an earlier 404 because gemini-2.5-flash was unavailable to new users. Do not assume that model is usable. Inspect the current lib/gemini.ts for the currently working model configuration.

9. AI Test Endpoint — HISTORICAL / TESTING

A temporary test route was created during Gemini integration:

app/api/test-ai/route.ts

It was used to confirm that Gemini could successfully generate structured content.

The important milestone is that Gemini generation worked successfully.

Do not build new product functionality around the temporary test route unless it still exists and there is a reason to keep it.

The real product endpoint is:

POST /api/ai/generate

10. Real AI Generate API — CURRENT WORK

A real API route has been created:

app/api/ai/generate/route.ts

Its intended flow is:

Call getCurrentUser().

Reject unauthenticated users with 401.

Read campaignId from the request body.

Validate that campaignId exists.

Find the campaign belonging to the authenticated user.

Send campaign information to generateCampaignContent().

Receive structured Gemini output.

Save it into AiContent with campaignId.

Return the saved AI content.

Conceptual implementation:

const user = await getCurrentUser();

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { campaignId } = await req.json();

const campaign = await prisma.campaign.findFirst({
  where: {
    id: campaignId,
    userId: user.id,
  },
});

if (!campaign) {
  return NextResponse.json(
    { error: "Campaign not found" },
    { status: 404 }
  );
}

const aiResult = await generateCampaignContent(
  campaign.campaignName,
  campaign.brandName,
  campaign.productName,
  campaign.campaignGoal,
  campaign.targetAudience
);

const savedContent = await prisma.aiContent.create({
  data: {
    ...aiResult,
    campaignId: campaign.id,
  },
});

The earlier TypeScript issue around user possibly being null was fixed.

The Prisma Client issue around aiContent was also fixed.

CURRENT TASK: Verify the real AI endpoint and connect it to the frontend.

11. Exact Current Stopping Point

The project was paused for approximately one month.

The exact next feature is:

CampaignCard -> Generate AI button

The intended UI flow:

Campaign Card
      |
      v
[ Generate AI ]
      |
      v
Loading state
      |
      v
POST /api/ai/generate
      |
      v
Gemini
      |
      v
Save AiContent
      |
      v
Display generated content

The frontend integration was started but not completed.

Do not skip directly to landing pages, leads, analytics, or deployment.

FIRST finish and verify:

Generate AI button in CampaignCard.

Send campaignId.

Handle loading state.

Handle API errors.

Receive generated content.

Verify row is saved in AiContent.

Display AI content in the UI.

12. Dashboard Refactor Warning

A previous refactor attempted to move authentication/user handling into DashboardHeader.

After that refactor, the dashboard stopped loading with no obvious browser error.

The changes were reverted and the dashboard became visible again.

IMPORTANT:
Do NOT repeat that DashboardHeader authentication refactor unless explicitly requested.

Preserve the currently working dashboard architecture.

13. Planned Roadmap — AFTER CURRENT AI UI WORK

Phase 1 — Finish AI Generation UI

Generate AI button

Loading state

API call

Error handling

Display generated content

Copy buttons if useful

Phase 2 — AI History / Regeneration

One campaign should support multiple AiContent records.

Features:

Generate

Regenerate

View previous generations

Compare generations if useful

Do not overwrite previous AI generations by default.

Phase 3 — Campaign Landing Page

Create a campaign landing page based on campaign/AI content.

Potential flow:

Campaign
-> AI content
-> Landing page
-> CTA / lead form

Use safe React rendering. Do not inject arbitrary AI-generated HTML into the page without sanitization.

Phase 4 — Lead Capture

Create a Lead model related to Campaign.

Potential fields:

id

campaignId

name

email

createdAt

Then create an API for lead submission.

Phase 5 — Leads Dashboard

Show leads associated with the user's campaigns.

Phase 6 — Analytics

Potential metrics:

Campaign views

Leads

Conversion rate

AI generations

Do not over-engineer analytics before the core MVP works.

Phase 7 — UI Polish

Loading states

Empty states

Error states

Responsive design

Better AI content presentation

Copy-to-clipboard

Regenerate controls

Phase 8 — Deployment

Deployment strategy can be decided after the application is stable.

14. Security Rules

Always preserve these principles:

Never expose GEMINI_API_KEY to client-side code.

Gemini calls must happen server-side.

Protected APIs must authenticate users.

Campaign operations must verify ownership.

Do not trust a campaignId from the client without checking user ownership.

Validate request bodies.

Do not expose sensitive server errors directly to users.

Do not weaken existing JWT/cookie security just to make a feature work.

15. Coding Style / Workflow

When modifying the project:

Read the relevant existing files first.

Understand current implementation before editing.

Make the smallest change necessary.

Do not rewrite working features unnecessarily.

Preserve existing authentication and campaign behavior.

Reuse existing utilities and services.

Keep Gemini calls inside lib/gemini.ts or an appropriate server-side service.

Keep API routes focused on request validation, authorization, orchestration, and response.

Use TypeScript types.

Test after each meaningful change.

Do NOT:

Replace the entire project architecture.

Upgrade major dependencies without asking.

Introduce a new authentication library without a clear reason.

Expose API keys.

Delete existing working features.

16. Interview / Presentation Requirements

A final interview/project PPT is planned.

The PPT should explain:

Project overview

Problem statement

Features

Architecture

Tech stack

Database design

Authentication flow

JWT flow

Campaign CRUD

Authorization/user ownership

Gemini integration

Prompt design

Structured JSON generation

AI persistence

Prisma relationships

Why AiContent[] is a relation and not a PostgreSQL array column

Why AI content is stored separately from Campaign

Why frontend does not call Gemini directly

Security considerations

AI cost/latency considerations

Future improvements

Interview questions discussed so far include:

Authentication

Why JWT?

Authentication vs authorization?

Why bcrypt?

Why cookies?

How does getCurrentUser work?

How are protected APIs implemented?

Database / Prisma

Why separate AiContent from Campaign?

How does aiContents AiContent[] work?

Is AiContent[] an array column in PostgreSQL?

How is the foreign key stored?

Why use findFirst() when checking campaign ownership?

Gemini / AI

Why create lib/gemini.ts?

Why structured JSON instead of plain text?

Why not call Gemini directly from React?

How do you protect the Gemini API key?

Why persist generated AI content?

How can AI API usage/cost be reduced?

Keep adding good interview questions as the implementation progresses.

17. Current Progress Snapshot

Completed:

Project setup

PostgreSQL

Prisma

Campaign schema

Campaign CRUD

Dashboard

Signup

Login

JWT

Cookie authentication

getCurrentUser

Protected APIs

Campaign ownership checks

Gemini SDK

Gemini API connection

Structured AI response

AiContent model

AiContent migration

Real AI generation API code

Current:

Frontend Generate AI integration

End-to-end verification of /api/ai/generate

AI content display

Not yet completed:

AI history/regeneration

Landing page generation

Leads

Leads dashboard

Analytics

Final UI polish

Deployment

Final interview PPT
