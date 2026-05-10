# 🌍 Traveloop — Personalized Travel Planning Made Easy

<div align="center">

![Traveloop](https://img.shields.io/badge/Traveloop-Travel%20Planning-3B82F6?style=for-the-badge&logoColor=white)

**Dream it. Plan it. Live it.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth-v5-7C3AED?style=flat-square)](https://authjs.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)

<p align="center">
  <a href="https://link.excalidraw.com/l/65VNwvy7c4X/22o30WE3bE4">
    <img src="https://img.shields.io/badge/🎨 UI Mockup-View on Excalidraw-F24E1E?style=for-the-badge" />
  </a>
</p>

</div>

---

## 👥 Team Syntax Sorcery

| # | Name | Role |
|---|------|------|
| 01 | Aditya Raulji | Team Leader & Full Stack Developer |
| 02 | Pathan Yasar Khan | Full Stack Developer |
| 03 | Rijans Patoliya | Backend Developer |
| 04 | Ridham Patel | Frontend Developer |

> 🏆 Built for **Odoo × Parul University Hackathon** — Virtual Round (8 Hours Coding)
> 📍 Mentor: Aditi Patel (`adip@odoo.com`) | 🎓 Parul University, Vadodara

---

## 📖 Table of Contents

1. [🎯 Executive Summary & Vision](#-executive-summary--vision)
2. [🚨 Problem Statement](#-problem-statement)
3. [✨ Feature Matrix — All 14 Screens](#-feature-matrix--all-14-screens)
4. [🏗️ System Architecture & Data Flow](#-system-architecture--data-flow)
5. [🗄️ Database Schema (Prisma / PostgreSQL)](#-database-schema)
6. [🔄 User Journey Flowcharts](#-user-journey-flowcharts)
7. [📡 API Reference](#-api-reference)
8. [📁 Project Structure](#-project-structure)
9. [📥 Setup & Installation](#-setup--installation)
10. [🔒 Security Architecture](#-security-architecture)
11. [🗺️ Roadmap](#-roadmap)

---

## 🎯 Executive Summary & Vision

**Traveloop** is a next-generation, personalized travel planning platform built to transform the way individuals plan and experience travel. The platform bridges the gap between the chaos of scattered browser tabs, manual spreadsheets, and disconnected note apps — and replaces it with a single, intelligent, end-to-end solution.

The overarching vision is to become the go-to platform where users can:
- **Dream** — discover global cities and activities
- **Design** — build day-wise multi-city itineraries
- **Organize** — track budgets, packing lists, and trip notes
- **Share** — publish itineraries publicly and connect with a travel community

### Core Problems Solved

| Problem | Traveloop Solution |
|---------|-------------------|
| Fragmented planning across multiple apps | Single unified platform for all trip planning |
| No automatic budget tracking | Per-section budget breakdown with charts |
| Can't share trip plans easily | Auto-generated public share links per trip |
| Generic travel guides | Searchable city & activity database with cost indices |
| Forgetting what to pack | Per-trip packing checklist with categories |
| No community or inspiration feed | Full social community with posts, likes & comments |

---

## 🚨 Problem Statement

> *This project was built for the **Traveloop** problem statement provided at the Odoo × Parul University Hackathon.*

### The Challenge

Build a complete, user-centric travel planning application that:

- Allows users to **create customized multi-city itineraries** with travel dates, activities, and budgets
- Implements **relational database design** to store user-specific trips, stops, activities, and expenses
- Provides **dynamic UI** that adapts to each user's trip flow
- Enables **budget estimation** and cost breakdowns automatically
- Supports **sharing trip plans** publicly or with friends
- Delivers a **responsive, clean UI** with consistent design and intuitive navigation

### Hackathon Requirements — All Met ✅

| Requirement | Status | How We Met It |
|-------------|--------|---------------|
| Real-time / dynamic data | ✅ | All data fetched live from PostgreSQL via API routes |
| Responsive & clean UI | ✅ | Tailwind CSS, mobile-first design, Framer Motion animations |
| Robust input validation | ✅ | Zod schema validation on all forms |
| Intuitive navigation | ✅ | Sidebar nav, breadcrumbs, contextual buttons |
| Version control (Git) | ✅ | Multiple contributors, proper branching |
| Relational database | ✅ | 15+ Prisma models with FK relations & cascades |
| No static JSON in production | ✅ | Seeded DB with live API endpoints |

---

## ✨ Feature Matrix — All 14 Screens

### 🔐 1. Login / Signup Screen
**Purpose:** Entry point for authentication and account creation.

- Email & password login with bcrypt-hashed credentials
- Signup with name, username, email, password
- Zod-validated forms — no empty or malformed submissions
- NextAuth v5 session management with secure cookies
- Auto-redirect to dashboard after login

---

### 🏠 2. Dashboard / Home Screen
**Purpose:** Central hub showing trip overview, regions to explore, and quick actions.

- Full-width hero banner — *"Where To Next?"*
- **5 Region cards** (Asia, Europe, Americas, Africa, Oceania) — click to filter cities
- My Trips preview grid with cover images and date ranges
- "Plan New Trip" quick action button
- Stagger-animated entry using Framer Motion

---

### 📋 3. My Trips (Trip List) Screen
**Purpose:** Manage all planned, ongoing, and completed trips.

- Trips auto-grouped into **Ongoing / Upcoming / Completed** based on real dates
- Live **progress bar** for ongoing trips (Day X of Y, days remaining)
- **"Starting Soon"** badge for trips within 7 days, **"Tomorrow! 🎉"** badge for next-day trips
- Shows cities visited, countries, activity count, and total budget per card
- Actions: **View**, **Edit**, **Share**, **Duplicate**, **Delete** (with confirmation dialog)
- Group by **Status** or **Destination** — search by trip name or city

---

### ➕ 4. Create Trip Screen
**Purpose:** Initiate a new personalized trip plan.

- Trip name, start & end dates (date picker)
- Trip description
- Cover photo upload via **Cloudinary**
- Optional public/private toggle
- Saved instantly to PostgreSQL — redirects to itinerary builder

---

### 🗺️ 5. Itinerary Builder Screen
**Purpose:** Interactive day-wise trip construction.

- **Add Stops** — search and select cities from the database
- Assign arrival & departure dates per stop
- **Add Activities** to each stop — from the global activity database
- Create **custom sections** (Hotel, Transport, Food, Activity, General)
- Attach **budget** to each section (unit cost × quantity)
- **Drag-and-drop** reordering via DnD Kit
- Schedule activities with specific times and dates

---

### 📅 6. Itinerary View Screen
**Purpose:** Review the full trip in a structured, readable timeline.

- Day-wise layout grouped by city
- Activity blocks with estimated cost and scheduled time
- City headers with country flags
- Full trip summary at a glance

---

### 🔍 7. City Search Screen
**Purpose:** Discover and explore global destinations.

- Search bar with real-time filtering
- City cards with **country flag**, **region**, **cost index** (1–5), and **popularity**
- Filter by region (Asia, Europe, Americas, Africa, Middle East, Oceania)
- **"Add to Trip"** button — instantly creates a new Stop in the selected trip

---

### 🎯 8. Activity Search Screen
**Purpose:** Browse and add experiences to trip stops.

- Filter by **Activity Type**: Sightseeing, Food & Dining, Adventure, Culture, Shopping, Nightlife, Nature, Wellness, Family, Sports
- Filter by estimated cost and duration
- Each card shows name, description, cost, and images
- **Save Activity** to profile wishlist or **Add to Stop** directly

---

### 💰 9. Trip Budget & Cost Breakdown Screen
**Purpose:** Full financial picture of the trip.

- Total planned budget vs. estimated actual spend
- Category breakdown: **Transport, Hotel, Activities, Food, Miscellaneous**
- **Pie chart** and **bar chart** via Recharts
- Per-section billing details (e.g., "4 nights × ₹2,000 = ₹8,000")
- Auto-calculated totals with tax support (18% GST configurable)
- Invoice generation with share token

---

### 🧳 10. Packing Checklist Screen
**Purpose:** Never forget what to pack.

- Add, remove, and check off items per trip
- **Categories**: Clothing, Documents, Electronics, Toiletries, Medicine, Snacks, Accessories
- Mark items as **Packed** or **Priority**
- Progress tracking — see what's left vs. what's done
- Shareable via separate checklist share token
- Reset checklist for reuse on future trips

---

### 🔗 11. Shared / Public Itinerary View Screen
**Purpose:** Share trip plans publicly.

- Every trip auto-generates a **unique public URL** via `shareToken`
- Toggle trip to "Public" — anyone with the link can view
- Read-only view: day-wise layout, cities, activities, costs
- **"Copy Trip"** — clone itinerary to your own account
- Social media sharing support

---

### 📝 12. Trip Notes / Journal Screen
**Purpose:** Quick note-taking tied to trips or stops.

- Add notes per **trip** or per **stop**
- Title, content, timestamp on every note
- **Pin** notes or mark as **Important**
- Sorted by date — newest first
- Linked day number within the trip for context

---

### 👤 13. User Profile / Settings Screen
**Purpose:** Manage personal data and preferences.

- Edit name, photo (Cloudinary upload), email, phone, city, country
- Language preference setting
- View **saved cities** and **saved activities** wishlist
- Delete account with confirmation
- All changes validated and saved to PostgreSQL

---

### 🛡️ 14. Admin / Analytics Dashboard
**Purpose:** Platform-wide monitoring for administrators.

- Accessible only to users with `isAdmin: true`
- Platform statistics: total users, total trips, popular cities, activity trends
- User management tools — view, audit, manage accounts
- Full **AdminLog** audit trail — every action logged with metadata
- Charts and tables for user engagement data

---

### 🌍 Bonus — Community Feed
**Purpose:** Travel social network built into the platform.

- Share travel experiences as posts with **Cloudinary images**
- Tag destinations, write captions
- **Like** and **Comment** (slide-out comment panel)
- **Infinite scroll** with pagination
- Search by destination — real-time filtering
- **Trending Destinations** strip
- **Sort** by Newest or Most Liked
- Share directly from a completed trip to the feed

---

## 🏗️ System Architecture & Data Flow

Traveloop uses **Next.js 16 App Router** as a unified full-stack framework — the frontend (React 19), backend (API Routes), and middleware all live in a single deployable codebase. PostgreSQL is the single source of truth, accessed entirely through Prisma ORM.

```mermaid
graph TB
    subgraph "Client Layer (React 19 + Next.js 16)"
        UI[User Interface - Pages & Components]
        FM[Framer Motion Animations]
        RC[Recharts - Budget Visualization]
        DND[DnD Kit - Drag & Drop]
    end

    subgraph "Next.js App Router (Full-Stack)"
        MW[Middleware - Auth Guard]
        AR[API Routes - REST Endpoints]
        SA[Server Actions]
        NA[NextAuth v5 - Session Management]
    end

    subgraph "External Services"
        CL[Cloudinary - Image Storage]
    end

    subgraph "Data Layer"
        PR[Prisma ORM - Type-Safe Queries]
        PG[(PostgreSQL - Primary Database)]
    end

    UI --> MW
    MW --> AR
    AR --> NA
    AR --> PR
    PR --> PG
    UI --> CL
    SA --> PR

    style UI fill:#3B82F6,color:#fff
    style PG fill:#336791,color:#fff
    style CL fill:#3448C5,color:#fff
    style NA fill:#7C3AED,color:#fff
    style PR fill:#2D3748,color:#fff
```

### Request Lifecycle

```
Browser → Next.js Middleware (auth check) → Page/API Route
→ Prisma Query → PostgreSQL → JSON Response → React UI Update
```

---

## 🗄️ Database Schema

The entire database is defined in `prisma/schema.prisma` with **15+ models**, **proper foreign key relations**, and **cascading deletes**. Below are the key domain schemas.

### 1. Identity & Auth Schema

```mermaid
erDiagram
    USER ||--o{ TRIP : "owns"
    USER ||--o{ COMMUNITY_POST : "creates"
    USER ||--o{ SAVED_ACTIVITY : "saves"
    USER ||--o{ SAVED_CITY : "saves"
    USER ||--o{ ACCOUNT : "has OAuth"
    USER ||--o{ SESSION : "has sessions"

    USER {
        string id PK
        string username UK
        string firstName
        string lastName
        string email UK
        string password "bcrypt hashed"
        string profileImage "Cloudinary URL"
        string language "default: en"
        boolean isAdmin "default: false"
        datetime createdAt
        datetime updatedAt
    }
```

### 2. Trip & Itinerary Schema

```mermaid
erDiagram
    TRIP ||--o{ STOP : "has stops"
    TRIP ||--o{ SECTION : "has sections"
    TRIP ||--o| BUDGET : "has overall budget"
    TRIP ||--o{ PACKING_ITEM : "has checklist"
    TRIP ||--o{ TRIP_NOTE : "has notes"
    STOP ||--o{ STOP_ACTIVITY : "has activities"
    SECTION ||--o{ SECTION_BUDGET : "has budgets"

    TRIP {
        string id PK
        string userId FK
        string name
        string description
        datetime startDate
        datetime endDate
        string coverImage "Cloudinary URL"
        boolean isPublic
        string shareToken UK "auto-generated"
        string checklistShareToken UK
        float taxPercent "default: 18.0"
    }

    STOP {
        string id PK
        string tripId FK
        string cityId FK
        int order "for drag-drop ordering"
        datetime startDate
        datetime endDate
    }

    SECTION {
        string id PK
        string tripId FK
        int order
        string title
        string sectionType "TRAVEL | HOTEL | FOOD | ACTIVITY | GENERAL"
        boolean isPlanned
    }

    SECTION_BUDGET {
        string id PK
        string sectionId FK
        string category "TRANSPORT | HOTEL | ACTIVITY | FOOD | STAY | MISC"
        float amount
        float unitCost
        int quantity
        string billingDetails
    }
```

### 3. City & Activity (Master Data) Schema

```mermaid
erDiagram
    CITY ||--o{ ACTIVITY : "contains"
    CITY ||--o{ STOP : "referenced in"
    CITY ||--o{ SAVED_CITY : "saved by users"
    ACTIVITY ||--o{ STOP_ACTIVITY : "added to stops"
    ACTIVITY ||--o{ SAVED_ACTIVITY : "saved by users"

    CITY {
        string id PK
        string name
        string country
        string countryFlag
        string region "Asia | Europe | Americas | Africa | etc"
        int costIndex "1=budget to 5=expensive"
        int popularity
        string imageUrl
        string description
    }

    ACTIVITY {
        string id PK
        string name
        string cityId FK
        string type "SIGHTSEEING | FOOD | ADVENTURE | CULTURE | SHOPPING | etc"
        float estimatedCost
        string duration "e.g. 2 hours"
        float durationHours
        string imageUrl
        string[] images "multiple Cloudinary URLs"
        int popularity
    }
```

### 4. Community Schema

```mermaid
erDiagram
    COMMUNITY_POST ||--o{ COMMUNITY_LIKE : "receives"
    COMMUNITY_POST ||--o{ COMMUNITY_COMMENT : "receives"
    USER ||--o{ COMMUNITY_LIKE : "gives"
    USER ||--o{ COMMUNITY_COMMENT : "writes"

    COMMUNITY_POST {
        string id PK
        string userId FK
        string tripId FK "optional"
        string content
        string[] images "Cloudinary URLs"
        string destination "e.g. Bali, Indonesia"
        int likesCount
        int commentsCount
        datetime createdAt
    }
```

### 5. Packing & Notes Schema

```mermaid
erDiagram
    TRIP ||--o{ PACKING_ITEM : "contains"
    TRIP ||--o{ TRIP_NOTE : "contains"
    STOP ||--o{ TRIP_NOTE : "linked to"

    PACKING_ITEM {
        string id PK
        string tripId FK
        string name
        string category "CLOTHING | DOCUMENTS | ELECTRONICS | TOILETRIES | MEDICINE | SNACKS | ACCESSORIES | OTHER"
        boolean isPacked
        boolean isPriority
    }

    TRIP_NOTE {
        string id PK
        string tripId FK
        string stopId FK "optional - per stop"
        string title
        string content
        int linkedDay "day number in trip"
        boolean isImportant
        boolean isPinned
        datetime createdAt
    }
```

---

## 🔄 User Journey Flowcharts

### Workflow 1: Creating & Sharing a Complete Trip

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Traveloop UI
    participant API as Next.js API Routes
    participant DB as PostgreSQL / Prisma
    participant CDN as Cloudinary

    User->>UI: Sign Up / Login
    UI->>API: POST /api/auth (NextAuth)
    API->>DB: Create/fetch User record
    DB-->>UI: Session established

    User->>UI: Click "Plan New Trip"
    UI->>UI: Fill trip form (name, dates, cover photo)
    UI->>CDN: Upload cover image
    CDN-->>UI: Return image URL
    UI->>API: POST /api/trips
    API->>DB: Create Trip + auto-generate shareToken
    DB-->>UI: Return new Trip ID

    User->>UI: Open Itinerary Builder
    User->>UI: Search and add City Stops
    UI->>API: GET /api/cities?search=...
    API->>DB: Query cities table
    DB-->>UI: Return matching cities
    UI->>API: POST /api/trips/:id/stops
    API->>DB: Create Stop with cityId, order

    User->>UI: Add Activities to each Stop
    UI->>API: GET /api/activities?cityId=...
    API->>DB: Query activities table
    UI->>API: POST /api/stops/:id/activities
    API->>DB: Create StopActivity record

    User->>UI: Open Budget Screen
    UI->>API: GET /api/trips/:id/budget
    API->>DB: Aggregate SectionBudgets
    DB-->>UI: Return cost breakdown JSON

    User->>UI: Toggle "Make Public"
    UI->>API: PATCH /api/trips/:id
    API->>DB: Set isPublic = true
    User->>UI: Copy public share link
    Note over User,UI: shareToken used in URL /share/:token
```

### Workflow 2: Trip Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: User creates trip (no dates set)
    Draft --> Upcoming: Start & end dates assigned
    Upcoming --> StartingSoon: Trip starts within 7 days
    StartingSoon --> Tomorrow: Trip starts tomorrow
    Tomorrow --> Ongoing: Trip start date = today
    Ongoing --> Completed: Trip end date passed
    Completed --> [*]

    Upcoming --> Ongoing: Date crosses startDate
    Draft --> Ongoing: Backdated trip created
    Ongoing --> [*]: Trip deleted
    Upcoming --> [*]: Trip deleted
```

### Workflow 3: Community Post Lifecycle

```mermaid
flowchart TD
    Start([User opens Community Tab]) --> Load
    Load[Fetch posts from /api/community with pagination] --> Feed
    Feed[Render paginated post feed]
    Feed --> Actions{User action?}

    Actions -- Like Post --> LikeAPI[POST /api/community/:id/like]
    LikeAPI --> UpdateCount[Increment likesCount in DB]
    UpdateCount --> Feed

    Actions -- Comment --> CommentSheet[Open slide-out comment panel]
    CommentSheet --> SubmitComment[POST /api/community/:id/comments]
    SubmitComment --> Feed

    Actions -- Share Experience --> Dialog[Open ShareExperienceDialog]
    Dialog --> FillForm[Write content, upload images via Cloudinary]
    FillForm --> PostAPI[POST /api/community]
    PostAPI --> DB[(Save to community_posts)]
    DB --> NewPost[Prepend post to feed]
    NewPost --> Feed

    Actions -- Load More --> Pagination[Increment page param]
    Pagination --> Load
```

---

## 📡 API Reference

All API routes are under `/api/`. Protected routes require a valid NextAuth session cookie.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Register new user account | Public |
| `POST` | `/api/auth/[...nextauth]` | NextAuth login / OAuth handlers | Public |
| `GET` | `/api/auth/session` | Get current session user | Public |

### Trips (`/api/trips`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/trips` | Fetch all trips for current user | 🔒 Session |
| `POST` | `/api/trips` | Create new trip | 🔒 Session |
| `GET` | `/api/trips/:id` | Get single trip with stops & budget | 🔒 Session |
| `PATCH` | `/api/trips/:id` | Update trip details (name, dates, public) | 🔒 Session |
| `DELETE` | `/api/trips/:id` | Delete trip (cascades all stops, notes, budget) | 🔒 Session |
| `POST` | `/api/trips/:id/duplicate` | Clone a trip with all its stops and activities | 🔒 Session |

### Cities (`/api/cities`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/cities` | Search cities — query: `?search=`, `?region=` | 🔒 Session |
| `GET` | `/api/cities/:id` | Get single city with its activities | 🔒 Session |

### Activities (`/api/activities`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/activities` | Browse activities — query: `?cityId=`, `?type=` | 🔒 Session |
| `POST` | `/api/activities/:id/save` | Save activity to user wishlist | 🔒 Session |

### Community (`/api/community`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/community` | Paginated feed — query: `?page=`, `?q=`, `?sortBy=` | 🔒 Session |
| `POST` | `/api/community` | Create new community post | 🔒 Session |
| `DELETE` | `/api/community/:id` | Delete own post | 🔒 Session |
| `POST` | `/api/community/:id/like` | Toggle like on a post | 🔒 Session |
| `GET` | `/api/community/:id/comments` | Fetch comments for a post | 🔒 Session |
| `POST` | `/api/community/:id/comments` | Add comment to a post | 🔒 Session |

### Public Routes (`/api/public`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/public/trips/:shareToken` | Get public read-only itinerary by token | Public |
| `POST` | `/api/public/trips/:shareToken/copy` | Clone a public trip to your account | 🔒 Session |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/stats` | Platform-wide statistics | 🔒 Admin |
| `GET` | `/api/admin/users` | All users with trip data | 🔒 Admin |
| `DELETE` | `/api/admin/users/:id` | Delete a user account | 🔒 Admin |

### AI (`/api/ai`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/ai/suggest` | AI-powered trip suggestions | 🔒 Session |

---

## 📁 Project Structure

```bash
traveloop/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/page.jsx        # Login page
│   │   └── signup/page.jsx       # Signup page
│   │
│   ├── (dashboard)/              # Protected dashboard route group
│   │   ├── layout.jsx            # Dashboard shell with Navbar
│   │   ├── dashboard/page.js     # Home — regions, recent trips
│   │   ├── trips/
│   │   │   ├── page.js           # My Trips list — grouped by status
│   │   │   ├── create/page.js    # Create trip form
│   │   │   └── [id]/
│   │   │       ├── itinerary/page.js   # Itinerary builder
│   │   │       ├── view/page.js        # Itinerary read view
│   │   │       ├── budget/page.js      # Budget breakdown + charts
│   │   │       ├── packing/page.js     # Packing checklist
│   │   │       ├── notes/page.js       # Trip notes / journal
│   │   │       └── invoice/page.js     # Invoice generator
│   │   ├── search/
│   │   │   └── cities/page.js    # City search & discovery
│   │   ├── community/page.jsx    # Social community feed
│   │   └── profile/page.js       # User profile & settings
│   │
│   ├── (public)/                 # Public unauthenticated routes
│   │   ├── share/[token]/page.js # Public itinerary view
│   │   └── u/[username]/page.js  # Public user profile
│   │
│   ├── (admin)/                  # Admin-only route group
│   │   └── admin/page.jsx        # Admin analytics dashboard
│   │
│   ├── api/                      # Next.js API Routes (Backend)
│   │   ├── auth/                 # NextAuth handlers
│   │   ├── trips/                # Trip CRUD + duplicate
│   │   ├── cities/               # City search & detail
│   │   ├── activities/           # Activity browser & save
│   │   ├── community/            # Posts, likes, comments
│   │   ├── public/               # Share token lookups
│   │   ├── user/                 # Profile updates
│   │   ├── admin/                # Admin stats & management
│   │   └── ai/                   # AI suggestions
│   │
│   ├── globals.css               # Tailwind CSS global styles
│   └── layout.js                 # Root layout with providers
│
├── components/
│   ├── layout/
│   │   └── Navbar.jsx            # Responsive sidebar navigation
│   ├── shared/
│   │   └── PageTopBar.jsx        # Reusable search/filter/sort bar
│   ├── community/
│   │   ├── CommunityPostCard.jsx # Post card with like/comment
│   │   ├── CommentSheet.jsx      # Slide-out comments panel
│   │   ├── ShareExperienceDialog.jsx # Post creation dialog
│   │   ├── TrendingDestinations.jsx  # Trending strip
│   │   └── CommunityFilters.jsx  # Feed filters
│   ├── search/                   # City & activity search components
│   ├── providers/                # Context providers (Session, Toast)
│   └── ui/                       # Shadcn UI primitives (Button, Input, etc.)
│
├── lib/
│   ├── prisma.js                 # Prisma singleton client
│   ├── cloudinary.js             # Cloudinary SDK config
│   ├── admin-auth.js             # Admin authorization helper
│   └── utils.js                  # Shared utility functions
│
├── prisma/
│   ├── schema.prisma             # Full database schema — 15+ models
│   ├── seed.js                   # Database seeder (cities, activities)
│   └── migrations/               # Auto-generated SQL migration history
│
├── auth.config.js                # NextAuth configuration
├── auth.js                       # NextAuth instance
├── middleware.js                 # Route protection middleware
├── next.config.mjs               # Next.js configuration
├── vercel.json                   # Vercel deployment config
└── package.json                  # Dependencies & scripts
```

---

## 📥 Setup & Installation

### Prerequisites

- **Node.js** v18+ 
- **PostgreSQL** — local or cloud (Neon.tech / Supabase recommended)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com) (free tier works)

### Step-by-Step Setup

**1. Clone the repository**
```bash
git clone https://github.com/aditya-raulji/Traveloop--Odoo-Hackthon.git
cd Traveloop--Odoo-Hackthon/traveloop
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the `traveloop/` directory:
```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/traveloop"

# NextAuth
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**4. Initialize the database**
```bash
npx prisma generate        # Generate Prisma client
npx prisma db push         # Sync schema to PostgreSQL
npx prisma db seed         # Seed cities and activities data
```

**5. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build production bundle (`prisma generate` + `next build`) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma visual DB browser |

### Common Issues

**Q: "PrismaClientKnownRequestError: Unique constraint failed"**  
*A: You may be seeding duplicate data. Run `npx prisma db push --force-reset` then re-seed.*

**Q: "Cloudinary upload returns 401 Unauthorized"**  
*A: Double-check your `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env`.*

**Q: "NextAuth session not persisting"**  
*A: Ensure `AUTH_SECRET` is set and `NEXTAUTH_URL` matches your running port exactly.*

---

## 🔒 Security Architecture

| Layer | Implementation |
|-------|---------------|
| **Password Hashing** | bcrypt with salt rounds — passwords never stored in plain text |
| **Session Management** | NextAuth v5 — signed JWT-based sessions with expiry |
| **Route Protection** | Next.js Middleware checks session before rendering any dashboard page |
| **Admin Guard** | `isAdmin` boolean checked server-side on all `/api/admin/*` routes |
| **Input Validation** | Zod schemas validate all form inputs before DB write |
| **SQL Injection** | Impossible — Prisma uses fully parameterized queries |
| **XSS Protection** | React's built-in DOM escaping + no `dangerouslySetInnerHTML` |
| **Media Security** | All uploads go through Cloudinary — no local file storage |
| **CORS** | Next.js same-origin API by default — no cross-origin exposure |
| **Cascade Deletes** | Prisma `onDelete: Cascade` ensures orphaned data is never left behind |

---

## 🗺️ Roadmap

### ✅ Phase 1 — Hackathon Build (Completed)
- [x] Full authentication system (signup, login, sessions)
- [x] Multi-city itinerary builder with drag-and-drop
- [x] Budget tracking with category breakdown and charts
- [x] Packing checklist with categories and priority flags
- [x] Trip notes / journal with per-stop linking
- [x] Public share links with read-only itinerary view
- [x] Community feed with likes, comments, infinite scroll
- [x] City and activity search with filters
- [x] Admin dashboard with audit logs
- [x] Cloudinary media uploads throughout
- [x] 15+ Prisma models with proper relational DB design

### 🚧 Phase 2 — Post-Hackathon Enhancements
- [ ] **AI Trip Suggestions** — Gemini-powered personalized destination recommendations
- [ ] **Google Maps Integration** — Visual route mapping between stops
- [ ] **Flight & Hotel Price Lookup** — API integration for real cost estimates
- [ ] **Collaborative Planning** — Invite friends to co-edit an itinerary
- [ ] **Mobile App** — React Native port for offline access
- [ ] **Email Notifications** — Trip reminders, packing alerts

### 🚀 Phase 3 — Scale
- [ ] **Multi-language Support** — i18n for regional markets
- [ ] **Currency Conversion** — Real-time exchange rates in budget view
- [ ] **Offline Mode** — PWA with service worker caching
- [ ] **Travel Analytics** — Personal stats across all trips (countries visited, total spend, etc.)

---

## 🎨 UI Mockup & Design

The UI was designed before development using **Excalidraw** for wireframing and rapid prototyping.

> 🔗 **View Mockup:** [Excalidraw Prototype](https://link.excalidraw.com/l/65VNwvy7c4X/22o30WE3bE4)

**Design System Highlights:**
- **Typography:** Bold, uppercase, italic — neobrutalist aesthetic
- **Color:** Black borders, blue accents (`#3B82F6`), white backgrounds
- **Shadows:** Offset box-shadows (`6px 6px 0px rgba(0,0,0,1)`) — tactile card feel
- **Animations:** Framer Motion stagger animations, hover lifts, scale transitions
- **Icons:** Lucide React — consistent icon library throughout

---

<div align="center">

Built with 💙 in 8 hours for the **Odoo × Parul University Hackathon**

**Team Syntax Sorcery**
**Aditya Raulji • Pathan Yasar Khan • Rijans Patoliya • Ridham Patel**

*Mentor: Aditi Patel | adip@odoo.com*

---

*© 2026 Team Syntax Sorcery. All rights reserved.*

</div>
