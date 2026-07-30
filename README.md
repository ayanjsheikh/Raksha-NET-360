# RakshaNet 360

AI-powered health & emergency response platform — frontend.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS · shadcn-style UI primitives ·
Lucide React · Framer Motion · Recharts · React Router · React Hook Form ·
Leaflet + OpenStreetMap

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to `http://localhost:5173`).

```bash
npm run build     # production build
npm run preview   # preview the production build locally
```

No backend, no environment variables, and no extra configuration required.
All data in this batch is static/dummy data used to demonstrate the UI.

## What's included in this batch

- Project scaffold: Vite + React 19 + TypeScript, path alias `@/ -> src/`
- Tailwind theme tokens matching the RakshaNet palette, radii, shadows, and
  motion tokens (see `tailwind.config.js` and `src/index.css`)
- Reusable UI primitives in `src/components/ui` (Button, Card, Input, Label)
  built shadcn-style with `class-variance-authority` + `tailwind-merge`
- Shared components in `src/components/shared`: `Navbar` (public site,
  scroll-aware, mobile menu), `Sidebar` (desktop app shell nav), `BottomNav`
  (mobile app shell nav with a raised SOS button), `Footer`, `Logo`,
  `AuthLayout` (split branding/form layout for auth pages), and the landing
  page sections (`Hero`, `FeaturesSection`, `HowItWorksSection`,
  `TestimonialsSection`, `CTASection`)
- Pages: **Landing**, **Login**, **Register** (React Hook Form validation,
  password visibility toggle, inline errors, loading states)
- `AuthContext` — dummy authentication state (no backend) shared via React
  Context, used by Login/Register/Sidebar
- Route constants and nav item definitions in `src/constants/navigation.ts`
- A lightweight "Coming soon" placeholder for routes not yet built
  (Profile Setup, and everything under `/app/*`) so the app runs end-to-end
  without dead links

## Folder structure

```
src/
  components/
    ui/        shadcn-style primitives (Button, Card, Input, Label, ...)
    shared/     Navbar, Sidebar, BottomNav, Footer, Hero, sections, ...
  pages/        Landing, Login, Register, ComingSoon
  layouts/      PublicLayout (navbar + footer wrapper)
  hooks/        (reserved for upcoming pages)
  context/      AuthContext
  types/        shared TypeScript types
  constants/    navigation + route constants
  data/         dummy content (features, testimonials, how-it-works)
  utils/        cn() class merge helper
```

## Coming up next (not yet built, per project instructions)

Profile Setup, Dashboard, Health, Emergency SOS, Emergency Map, Women
Safety, Child Module, Elderly Module, Rural Mode, Profile, Settings — will
be added in the next steps.
