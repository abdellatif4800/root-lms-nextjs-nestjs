# Root_LMS ⚡

> A cyberpunk-themed, full-stack Learning Management System built as a Turborepo monorepo — featuring tutorials, roadmaps, quizzes, and progress tracking with a terminal-aesthetic UI.

**Live Demo for web:** [rootlms.vercel.app](https://rootlms.vercel.app)

**Live Demo for dashboard:** [rootlms-dashboard.vercel.app](https://rootlms-dashboard.vercel.app)

---

## ✦ Features

### Public (`lms-web`)

- **Tutorial Library** — Browse all published tutorials with filtering by category, level, status, and access type (FREE / PAID)
- **Roadmaps** — Visual, node-based learning path viewer built with ReactFlow
- **Tutorial Reader** — MDX-powered unit content renderer with a collapsible units sidebar
- **Interactive Quizzes** — Assess knowledge after completing tutorial units with real-time scoring
- **Subscription & Payments** — Stripe-integrated pricing plans (PLUS/PRO) to unlock premium tutorials
- **Progress Tracking** — Per-unit completion tracking with animated progress bars per tutorial

### Admin (`lms-dashboard`)

- **Tutorial Editor** — Create and edit tutorials with full metadata (name, description, level, category, thumbnail, publish status, price)
- **Roadmap Editor** — Drag-and-drop node graph editor to build learning roadmaps by linking tutorials
- **Unit Management** — Create and order learning units with MDX editing support
- **Quiz Builder** — Create assessments for tutorial units
- **Publish Control** — Toggle tutorials between Draft and Live status

### UI/UX

- **Cyberpunk / Terminal aesthetic** — Custom design system with `Orbitron` + `JetBrains Mono` fonts, cut-corner clip-paths, teal/emerald/purple glow accents, scanline overlays, and animated grid backgrounds
- **Dark / Light theme** — Full theme toggle with CSS variable-driven theming
- **Fully responsive** — Mobile-first layout with overlay sidebars, hamburger nav, and adaptive grids
- **Skeleton loading states** — Shimmer skeletons matching real card layouts

---

## ✦ Tech Stack

### Monorepo

| Tool                | Purpose                                 |
| ------------------- | --------------------------------------- |
| **Turborepo**       | Monorepo build system with task caching |
| **pnpm workspaces** | Package management                      |
| **TypeScript**      | End-to-end type safety                  |

### Frontend Apps (`apps/lms-web`, `apps/lms-dashboard`)

| Tool                            | Purpose                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| **Next.js 15** (App Router)     | React framework, server components, server actions                |
| **React 19**                    | UI library                                                        |
| **Tailwind CSS v4**             | Utility-first styling with custom `@theme` design tokens          |
| **Redux Toolkit**               | Global client state (auth, tutorial filters, roadmap graph)       |
| **TanStack Query**              | Server state, caching, and prefetching                            |
| **ReactFlow (`@xyflow/react`)** | Interactive node-graph editor for roadmaps                        |
| **next-mdx-remote**             | MDX content rendering                                             |
| **Stripe**                      | Payment processing and checkout sessions                          |
| **next-themes**                 | Dark/light mode management                                        |

### Backend (`apps/lms-api`)

| Tool                     | Purpose                         |
| ------------------------ | ------------------------------- |
| **NestJS**               | Node.js server framework        |
| **GraphQL** (Code First) | API layer via `@nestjs/graphql` |
| **TypeORM**              | ORM for database access         |
| **PostgreSQL**           | Primary database                |
| **JWT + Cookies**        | Authentication                  |
| **Stripe SDK**           | Subscription management         |

### Shared Packages (`packages/`)

| Package                 | Contents                                                                      |
| ----------------------- | ----------------------------------------------------------------------------- |
| `@repo/ui`              | Shared React components (TutorialsPage, UnitsList, ContentArea, Pricing, etc) |
| `@repo/gql`             | GraphQL queries, mutations, and TanStack Query hooks                          |
| `@repo/reduxSetup`      | Redux store, slices (auth, tutorial, roadmap)                                 |
| `@repo/mdxSetup`        | MDX components and serialization utilities                                    |
| `@repo/reactFlowSetup`  | ReactFlow configuration, custom nodes, and edge types                         |
| `@repo/tailwind-config` | Shared Tailwind v4 configuration and global styles                            |

---

## ✦ Project Structure

```
root-lms/
├── apps/
│   ├── lms-web/                # Main learner platform
│   ├── lms-dashboard/          # Admin management platform
│   └── lms-api/                # NestJS GraphQL API
├── packages/
│   ├── ui/                     # Shared React UI components
│   ├── gql/                    # GraphQL client + API hooks
│   ├── reduxSetup/             # Global Redux state management
│   ├── mdxSetup/               # MDX rendering and editor config
│   ├── reactFlowSetup/         # Flow-based graph components
│   └── tailwind-config/        # Shared design system and styles
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## ✦ Getting Started

### Prerequisites

- Node.js `>=18`
- pnpm `>=9`
- PostgreSQL database

### Installation

```bash
# Clone the repo
git clone https://github.com/abdellatif4800/root-lms.git
cd root-lms

# Install dependencies
pnpm install
```

### Environment Variables

Create `.env` files in the respective app directories:

**`apps/lms-web/.env.local`**

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**`apps/lms-api/.env`**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/root_lms
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
PORT=3000
```

### Development

```bash
# Run all apps and packages in parallel
pnpm dev

# Run a specific application
pnpm --filter lms-web dev
```

The web app runs on `http://localhost:3000` (by default with API) or as configured via Turbo.

---

## ✦ License

MIT
