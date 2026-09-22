# EcoBlue Environmental Services Ltd. — Corporate Web Application (Next.js)

> **"Professional, Reliable, Sustainable Waste Management Solutions"**  
> Corporate web application for **EcoBlue Environmental Services Ltd.**, an environmental services, waste management, recycling, and sustainability company headquartered in Port Harcourt, Rivers State, Nigeria. Built on **Next.js (App Router)** with **TypeScript**, component-driven architecture, and a brand-curated vanilla CSS design system.

---

## 1. Corporate Identity & Legal Framework

- **Company Name:** EcoBlue Environmental Services Ltd.
- **Legal Framework:** Incorporated under the Companies and Allied Matters Act 2020 (CAMA 2020)
- **Head Office:** Port Harcourt, Rivers State, Nigeria
- **Business Sector:** Environmental Services, Waste Management, Recycling & Sustainability Solutions
- **Email:** [info@ecoblueenvironmental.com](mailto:info@ecoblueenvironmental.com)
- **Customer & Dispatch Line:** 08061193218
- **Operational Fleet:** Modern fleet of advanced waste management vehicles equipped with high-efficiency hydraulic compactor systems and GPS tracking.

---

## 2. Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript / React 19
- **Design System & Styling:** Vanilla Modern CSS3 (CSS Variables, Flexbox, CSS Grid, clamp() fluid typography, no Tailwind/Bootstrap dependency)
- **Data & Persistence Layer:** SSR-Safe Browser `localStorage` repository (`src/lib/storage.ts`) + REST API routes (`src/app/api/leads/route.ts`)
- **Typography:** Google Fonts (`Plus Jakarta Sans` for headings, `Inter` for body & UI)
- **Iconography:** Resolution-independent inline SVG (Lucide/Feather format)
- **SEO & Metadata:** Native Next.js `Metadata` API + Schema.org `WasteManagementService` JSON-LD structured data

---

## 3. Project Directory Structure

```
ECOBLUE/
├── public/                     # Static assets served at root path
│   ├── images/                 # Corporate logos, fleet, and transformation photography
│   │   ├── logo.png            # Official EcoBlue emblem & corporate typography
│   │   ├── logo-transparent.png # High-res transparent emblem
│   │   ├── fleet-city-trucks.jpg # Hydraulic compactor fleet
│   │   ├── street-before.jpg   # Before intervention photo
│   │   ├── street-after.jpg    # After intervention photo
│   │   └── ...
│   ├── robots.txt              # Search engine crawler permissions
│   └── sitemap.xml             # XML sitemap covering all routes
│
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   │   ├── layout.tsx          # Global layout (Navbar, Footer, ToastProvider, ModalProvider)
│   │   ├── page.tsx            # Homepage (Hero, Divisions, Before/After Slider, CTA)
│   │   ├── about/page.tsx      # Corporate Profile, Vision, Mission & Core Values
│   │   ├── chairmans-message/page.tsx # Executive Chairman's Mandate
│   │   ├── services/page.tsx   # 4 Environmental Divisions & Consultations
│   │   ├── community-impact/page.tsx # Case Studies with Interactive Comparison Sliders
│   │   ├── partnerships/page.tsx # 6 Strategic Tracks + Proposal Submission Form
│   │   ├── careers/page.tsx    # Workplace Culture & Candidate Application Form
│   │   ├── consultants/page.tsx # Technical Advisory Network & Registration Form
│   │   ├── contact/page.tsx    # Port Harcourt HQ Coordinates & Direct Inquiry Form
│   │   ├── admin/page.tsx      # Staff Admin Management Console & CSV Exporter
│   │   └── api/
│   │       └── leads/route.ts  # REST API endpoint (GET / POST lead records)
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Sticky header, desktop dropdowns & mobile drawer
│   │   ├── Footer.tsx          # Corporate footer, CAMA notice, newsletter subscribe
│   │   ├── QuoteModal.tsx      # Universal consultation dialog with service pre-fill
│   │   ├── BeforeAfterSlider.tsx # Drag-and-touch environmental comparison slider
│   │   └── Toast.tsx           # Floating toast notification manager
│   │
│   ├── context/
│   │   └── ModalContext.tsx    # Global consultation dialog state provider
│   │
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces (Quotes, Leads, Enums)
│   │   └── storage.ts          # Client persistence engine & seed data repository
│   │
│   └── styles/                 # Pure Vanilla CSS Design System
│       ├── variables.css       # Brand tokens (Oceanic Navy, Eco Green, radii, shadows)
│       ├── main.css            # Base typography, header, mobile drawer, layout
│       ├── components.css      # Cards, modals, comparison sliders, badges
│       └── admin.css           # Admin dashboard grid, data tables, modals
│
├── _legacy_html/               # Archived static HTML pages for reference
├── next.config.mjs             # Next.js configuration (unoptimized images, tracing root)
├── tsconfig.json               # TypeScript compiler configuration
├── package.json                # Project dependencies & operational scripts
├── .gitignore                  # Git exclusions (.next/, node_modules/, etc.)
└── README.md                   # Project documentation
```

---

## 4. Key Application Features

1. **Brand Aesthetic & Corporate Standards:**
   - Exact logo-extracted color palette: Primary Eco Green (`#2E9A3C` / `#419740`), Deep Oceanic Navy (`#0B4261`), Dark Navy (`#062C43`), and Clean Tint Background (`#F4F8F6`).
   - Official EcoBlue PNG logo integrated into header, mobile drawer, corporate footer, and admin portal.
   - Smooth transitions, sticky navigation header, and slide-out mobile drawer.

2. **Universal Consultation Dialog (`QuoteModal.tsx`):**
   - Accessible from any page via global React context (`openQuoteModal()`).
   - Pre-fills requested service when triggered from service cards.
   - Validates client fields and immediately logs requests to storage with visual toast confirmation.

3. **Interactive Environmental Comparison (`BeforeAfterSlider.tsx`):**
   - Touch- and mouse-draggable slider handle allowing users to [view urban transformation](src/app/community-impact/page.tsx):
     - Littered public roads &rarr; Restored, clean corridors.
     - Unmanaged dump sites &rarr; Cleared, sanitized spaces.

4. **Staff Admin Console (`/admin`):**
   - Protected staff authentication screen (configured via server-side environment variables).
   - Real-time overview metrics: Total Requests, Pending Review, Quotes, and Inquiries.
   - Tabbed management across:
     - **Quote Requests** (`QUO-...`)
     - **Career Applications** (`APP-...`)
     - **Consultant Rosters** (`CST-...`)
     - **General Inquiries** (`INQ-...`)
     - **Partnership Proposals** (`PRT-...`)
   - Multi-field search, status filter (`Pending`, `Reviewed`, `Contacted`, `Completed`), [record view modal](src/app/admin/page.tsx), and one-click **CSV export**.

5. **API Route Architecture (`/api/leads`):**
   - Ready-to-connect REST API endpoint supporting `GET` and `POST` for lead capture and database integration.

---

## 5. How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.17+ or 20+)
- npm (comes with Node.js)

### Development Server
Run the local Next.js development server:

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal) in your browser.

### Production Build
Test and run the optimized production bundle:

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 6. Staff Admin Portal Access

- **Portal Route:** `/admin`
- **Authentication:** Configured securely via server-side environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in `.env.local`).
- **Security Protections:** Enforces server-side HMAC-SHA256 session cookies, IP-based brute-force rate limiting, timing-attack resistance, and crawler `noindex` directives.

---

## 7. Content Compliance Notice

In strict adherence to company guidelines:
- All statutory details reflect official corporate records (CAMA 2020).
- Fleet descriptions focus specifically on modern **hydraulic compactor vehicles**.
- No fictitious client names, fabricated government contracts, or invented numerical statistics have been used. Placeholders are clearly marked for the EcoBlue administrative team to update as needed.

---

## 8. License

&copy; 2026 EcoBlue Environmental Services Ltd. All Rights Reserved.
