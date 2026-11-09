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
│       ├── assets/              # App launcher, splash, and favicon icons
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
- **PNPM**: Installed globally (`npm install -g pnpm`)
- **Backend Service**: NestJS API with PostgreSQL running on port `3000` (`http://localhost:3000/api/v1`).

---

## 3. Quick Start & Installation

If `pnpm` is not yet in your terminal's `PATH` on Windows, add it first:
```powershell
$env:PATH = "$env:APPDATA\npm;$env:PATH"
```

Install dependencies across all workspaces:
```powershell
cd isonga-connect-client
pnpm install
```

---

## 4. Running the Applications

### Step 1: Start Backend (Terminal 1)
```powershell
cd isonga_backend
npm run start:dev
```
> The API will be available at **`http://localhost:3000/api/v1`** (Swagger docs at `http://localhost:3000/api/docs`).

---

### Step 2: Start Web Application (Terminal 2)
The Next.js web application is the **Super Admin Portal**:

```powershell
# From the isonga-connect-client root:
$env:PATH = "$env:APPDATA\npm;$env:PATH"
cd isonga-connect-client
pnpm dev:web
```
*Alternatively, run from `apps/web`:*
```powershell
cd isonga-connect-client/apps/web
pnpm dev
```
> Super Admin portal runs at **`http://localhost:3001`**. Root `/` automatically redirects to `/admin/login`.

---

### Step 3: Start Mobile Application (Terminal 3)
The React Native Expo application is the **Resident & Village Chief platform**:

```powershell
$env:PATH = "$env:APPDATA\npm;$env:PATH"
cd isonga-connect-client/apps/mobile
npx expo start -c
```

Once Metro Bundler starts:
- Press **`w`** to open in the **Web Browser** (instant preview).
- Press **`a`** to open on an **Android Emulator**.
- Scan the **QR Code** using **Expo Go** on a physical Android or iOS device.

*Alternatively, run dedicated commands directly:*
```powershell
# Web browser preview directly:
pnpm --filter @isonga/mobile web

# Android emulator directly:
pnpm --filter @isonga/mobile android

# iOS simulator (macOS only):
pnpm --filter @isonga/mobile ios
```

---

## 5. Verified Test Credentials

| Role | Identifier (Phone or Email) | Password | Screen Routed |
| :--- | :--- | :--- | :--- |
| **Super Admin (Web Portal)** | `kalizaesther5@gmail.com` or `+250788999888` | `Password123!` | `/admin/dashboard` |
| **Village Chief (Mobile App)** | `+250788999888` or `kalizaesther5@gmail.com` | `Password123!` | Chief Portal (Broadcasting Console) |
| **Resident (Mobile App)** | Register with any Rwandan number (`+25078XXXXXXX`) | Custom (≥ 8 chars) | Resident Announcements Feed & Tabs |

---

## 6. Build & Type-Check Verification

```powershell
$env:PATH = "$env:APPDATA\npm;$env:PATH"
cd isonga-connect-client

# Run TypeScript checks across all workspace packages
pnpm type-check

# Build Super Admin Next.js web production bundle
pnpm build:web

# Build Expo Mobile app bundles (Web, iOS, Android)
pnpm build:mobile
```

---

## 7. Environment Variables

### Web (`apps/web/.env.local`):
```ini
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Mobile (`apps/mobile/.env`):
```ini
# Optional: defaults to auto-detecting your machine IP for Expo Go on physical phones
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 8. Independent Deployment

- **Web (Vercel)**:
  - Root Directory: `apps/web`
  - Build Command: `pnpm run build`
  - Output Directory: `.next`
- **Mobile (Expo EAS)**:
  - Inside `apps/mobile`:
    ```bash
    eas build --platform android
    eas build --platform ios
    ```
