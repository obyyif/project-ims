<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LMS Melesat Frontend — Agent Guide

## Tech Stack
- **Next.js 16.2.2** (App Router) + **React 19.2.4** + **TypeScript 5**
- **Tailwind CSS v4** (new `@theme` syntax, `@import "tailwindcss"`)
- **Axios** for HTTP (configured in `lib/api.ts`)
- **js-cookie** for auth token management

## Project Structure
- `app/(auth)/` — Login page (public)
- `app/(dashboard)/` — Protected pages (teacher/student/admin)
- `app/components/` — Shared UI components (Sidebar, TopBar, MobileNav, ErrorBoundary)
- `contexts/AuthContext.tsx` — Auth state management (sessionStorage + cookie)
- `lib/api.ts` — Axios instance with token interceptor
- `types/api.ts` — TypeScript interfaces for all API entities

## Key Patterns
1. **Auth**: Token stored in cookie (`lms_token`), user data in `sessionStorage`. Use `useAuth()` hook.
2. **API calls**: Always use `import api from "@/lib/api"`, never raw `axios`. Base URL from env.
3. **Types**: Import from `@/types/api` — never use `any` for API data.
4. **Error handling**: Wrap page content in `<ErrorBoundary>`. Use `<ApiError>`, `<LoadingSpinner>`, `<EmptyState>` from `@/app/components/ErrorBoundary`.
5. **Styling**: Tailwind v4 with custom `@theme` tokens in `globals.css`. Use `card-float` utility for elevated cards.
6. **API base**: `/api/lms` prefix. Teacher endpoints: `/teacher/*`, Student: `/student/*`.

## Backend API (selaju-system)
- Base: `http://127.0.0.1:8000/api/lms`
- Auth: POST `/login` → returns `{ token, role, user }`
- All protected routes require `Authorization: Bearer {token}`
- See `types/api.ts` for complete entity definitions

## Commit Rules
See `docs/dev/COMMIT_RULES.md` — distribute commits proportionally among team members.
