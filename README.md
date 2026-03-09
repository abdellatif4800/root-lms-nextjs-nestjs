# Root_LMS ⚡

> A cyberpunk-themed, full-stack Learning Management System built as a Turborepo monorepo — featuring tutorials, roadmaps, and progress tracking with a terminal-aesthetic UI.

**Live Demo for web:** [rootlms.vercel.app](https://rootlms.vercel.app)

**Live Demo for dashboard:** [rootlms-dashboard.vercel.app](https://rootlms-dashboard.vercel.app)

---

## ✦ Features

### Public

- **Tutorial Library** — Browse all published tutorials with filtering by category, level, status, and keyword search
- **Roadmaps** — Visual, node-based learning path viewer built with ReactFlow
- **Tutorial Reader** — MDX-powered unit content renderer with a collapsible units sidebar
- **Progress Tracking** — Per-unit completion tracking with animated progress bars per tutorial

### Admin

- **Tutorial Editor** — Create and edit tutorials with full metadata (name, description, level, category, thumbnail, publish status)
- **Roadmap Editor** — Drag-and-drop node graph editor to build learning roadmaps by linking tutorials
- **Unit Management** — Create and order learning units within tutorials
- **Publish Control** — Toggle tutorials between Draft and Live status

### UI/UX

- **Cyberpunk / Terminal aesthetic** — Custom design system with `Orbitron` + `JetBrains Mono` fonts, cut-corner clip-paths, teal/emerald/purple glow accents, scanline overlays, and animated grid backgrounds
- **Dark / Light theme** — Full theme toggle with CSS variable-driven theming
- **Fully responsive** — Mobile-first layout with overlay sidebars, hamburger nav, and adaptive grids
- **Skeleton loading states** — Shimmer skeletons matching real card layouts
- **Portal dropdowns** — User menu and filter panels rendered via `createPortal` to escape layout stacking contexts

---

## ✦ Tech Stack

### Monorepo

| Tool                | Purpose                                 |
| ------------------- | --------------------------------------- |
| **Turborepo**       | Monorepo build system with task caching |
| **pnpm workspaces** | Package management                      |
| **TypeScript**      | End-to-end type safety                  |

### Frontend (`apps/web`)

| Tool                            | Purpose                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| **Next.js 15** (App Router)     | React framework, server components, server actions                |
| **React 19**                    | UI library                                                        |
| **Tailwind CSS v4**             | Utility-first styling with custom `@theme` design tokens          |
| **Redux Toolkit**               | Global state (auth, tutorial filters, roadmap graph)              |
| **TanStack Query**              | Server state, caching, and prefetching                            |
| **ReactFlow (`@xyflow/react`)** | Interactive node-graph editor for roadmaps                        |
| **next-mdx-remote**             | MDX content rendering (serialized server-side via server actions) |
| **next-themes**                 | Dark/light mode                                                   |

### Backend (`apps/server`)

| Tool                     | Purpose                         |
| ------------------------ | ------------------------------- |
| **NestJS**               | Node.js server framework        |
| **GraphQL** (Code First) | API layer via `@nestjs/graphql` |
| **TypeORM**              | ORM for database access         |
| **PostgreSQL**           | Primary database                |
| **JWT + Cookies**        | Authentication                  |
| **Vercel**               | Deployment                      |

### Shared Packages

| Package                | Contents                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/ui`             | All React components (TutorialsPage, TutorialCard, UnitsList, ContentArea, ProgressPageContent, RoadmapViewer, Navbar, Sidebar, etc.) |
| `@repo/gql`            | GraphQL queries, mutations, and TanStack Query hooks                                                                                  |
| `@repo/reduxSetup`     | Redux store, slices (auth, tutorial, roadmap)                                                                                         |
| `@repo/mdxSetup`       | MDX components and serialization utilities                                                                                            |
| `@repo/reactFlowSetup` | ReactFlow configuration, custom nodes, and edge types                                                                                 |

---

## ✦ Project Structure

```
next-graphql-elearning/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   └── app/
│   │       ├── (pages)/
│   │       │   ├── tutorials/
│   │       │   │   ├── list/       # Tutorial browser
│   │       │   │   ├── [tutorialId]/   # Tutorial reader
│   │       │   │   └── tutorialEditor/ # Admin editor
│   │       │   ├── roadmaps/       # Roadmap list
│   │       │   │   └── [roadmapId]/    # Roadmap viewer
│   │       │   └── progress/       # User progress dashboard
│   │       └── layout.tsx          # Root layout with MainLayout
│   └── server/                 # NestJS GraphQL API
├── packages/
│   ├── ui/                     # Shared React components
│   ├── gql/                    # GraphQL client + queries
│   ├── reduxSetup/             # Redux store and slices
│   ├── mdxSetup/               # MDX rendering utilities
│   └── reactFlowSetup/         # ReactFlow graph components
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## ✦ Getting Started

### Prerequisites

- Node.js `>=18`
- pnpm `>=8`
- PostgreSQL database

### Installation

```bash
# Clone the repo
git clone https://github.com/abdellatif4800/next-graphql-elearning.git
cd next-graphql-elearning

# Install dependencies
pnpm install
```

### Environment Variables

Create `.env` files in both `apps/web` and `apps/server`:

**`apps/web/.env.local`**

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
```

**`apps/server/.env`**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/root_lms
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Development

```bash
# Run all apps and packages in parallel
pnpm dev

# Run only the frontend
pnpm --filter web dev

# Run only the backend
pnpm --filter server dev
```

The web app runs on `http://localhost:3000` and the GraphQL API on `http://localhost:3001/graphql`.

### Build

```bash
pnpm build
```

---

## ✦ GraphQL API Highlights

| Operation                                | Description                                                      |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `tutorials(filters)`                     | List tutorials with optional publish/level/category/name filters |
| `tutorialById(id)`                       | Get a single tutorial with its units                             |
| `unitsByTutorialId(id)`                  | Get all units for a tutorial                                     |
| `unitById(id)`                           | Get a single unit with MDX content                               |
| `roadmaps`                               | List all roadmaps                                                |
| `roadmap(id)`                            | Get roadmap with nodes and edges                                 |
| `unitProgressByUser(userId, tutorialId)` | Get unit completion records                                      |
| `tutorialsInProgressByUser(userId)`      | Get all tutorials a user has started                             |
| `createUnitProgress(input)`              | Upsert a unit completion record                                  |
| `login / logout`                         | JWT auth via HTTP-only cookies                                   |

---

## ✦ Design System

The UI uses a custom cyberpunk / terminal aesthetic defined in `shared-styles.css` and Tailwind's `@theme` block:

- **Fonts:** `Orbitron` (headings/digital displays) · `JetBrains Mono` (body/terminal text)
- **Colors:** `teal-glow` · `emerald-glow` · `purple-glow` · `surface-950/900/800/700`
- **Shadows:** `shadow-card` (4px hard offset) · `shadow-glow-teal/emerald/purple`
- **Shapes:** `clip-path` cut-corner polygons on cards, buttons, and panels
- **Motion:** `fadeSlideIn` stagger animations · `shimmer` skeleton sweeps · intersection-observer animated progress bars

---

## ✦ License

MIT
