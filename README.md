# Isonga Connect Client Monorepo

> **Tagline:** Your community. Your updates.  
> Monorepo housing the **Next.js 16 Web Application** (Super Admin Portal) and the **React Native / Expo Mobile Application** (Resident & Local Chief Platform), powered by **PNPM Workspaces** and **Turborepo**.

---

## 1. Monorepo Architecture

```text
isonga-connect-client/
├── apps/
│   ├── web/                     # @isonga/web - Next.js 16 Super Admin Portal
│   │   ├── app/                 # Next.js App Router (Super Admin restricted)
│   │   ├── components/          # Web UI components & layout
│   │   ├── lib/                 # Web API clients & state
│   │   └── package.json
│   │
│   └── mobile/                  # @isonga/mobile - React Native / Expo 52 Application
│       ├── src/                 # Screens (Resident & Village Chief), API, Theme
│       ├── App.tsx              # Mobile navigation and root provider
│       ├── index.js             # Monorepo entry point
│       ├── metro.config.js      # Monorepo Metro bundler config
│       └── package.json
│
├── packages/
│   ├── shared/                  # @isonga/shared - Cross-Platform Core
│   │   ├── src/
│   │   │   ├── types/           # User, Admin, Area, Announcement, Notification models
│   │   │   ├── constants/       # Rwandan phone regex, categories, priorities
│   │   │   └── utils/           # Validation and formatting utilities
│   │   └── package.json
│   │
│   └── config/                  # @isonga/config - Shared Configurations
│       └── tsconfig.base.json   # Base TypeScript compiler settings
│
├── package.json                 # Workspace root package scripts & Turbo config
├── pnpm-workspace.yaml          # PNPM workspace definition
├── turbo.json                   # Turborepo task pipeline
└── .gitignore
```

---

## 2. Prerequisites

- **Node.js**: `v20.x` or `v22.x`
- **PNPM**: `v10.x` or `v12.x` (`npm install -g pnpm`)
- **Backend Service**: Running NestJS API (`http://localhost:3000/api/v1`) with PostgreSQL.

---

## 3. Quick Start & Installation

Install dependencies across all workspace packages:

```bash
cd isonga-connect-client
pnpm install
```

---

## 4. Running the Applications

### A. Run All Apps in Parallel (Turbo)
```bash
# Starts both web and mobile simultaneously
pnpm dev
```

### B. Run Web Application Only (Super Admin Portal)
```bash
# From workspace root
pnpm dev:web

# Or from apps/web directly
cd apps/web
pnpm dev
```
> Web portal runs on **`http://localhost:3001`**. Root `/` directs to `/admin/login`.

### C. Run Mobile Application (Expo / React Native)
```bash
# Web browser preview (Fastest)
pnpm --filter @isonga/mobile web

# Expo Go (Scan QR code with physical phone)
pnpm --filter @isonga/mobile start

# Android Emulator
pnpm --filter @isonga/mobile android

# iOS Simulator (macOS only)
pnpm --filter @isonga/mobile ios
```

---

## 5. Build & Type-Check Verification

```bash
# Type-check everything
pnpm type-check

# Build both applications
pnpm build

# Target specific packages
pnpm build:web      # Next.js optimized production build
pnpm build:mobile   # Expo export for Web, Android, and iOS
```

---

## 6. Environment Variables

### Web (`apps/web/.env.local`):
```ini
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Mobile (`apps/mobile/.env`):
```ini
# Defaults to auto-resolving local host IP for physical device testing
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 7. Independent Deployment

- **Web (Vercel)**:
  - Root Directory: `apps/web`
  - Build Command: `pnpm run build`
  - Output Directory: `.next`
- **Mobile (EAS / Expo)**:
  - Run EAS commands inside `apps/mobile`: `eas build --platform android` or `eas build --platform ios`.

