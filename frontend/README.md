# ShortLink Frontend

This is the React + Vite + TypeScript frontend client for the ShortLink URL shortening application. It provides an intuitive, responsive interface for generating, viewing, and managing shortened URLs.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Code Quality & Formatting](#code-quality--formatting)

## Features

- Encode and decode long URLs
- View recent and full list of shortened URLs
- Copy and share generated links
- Dark/light theme toggling
- Responsive design for mobile and desktop

## Tech Stack

- **Framework:** React 19, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, CSS variables
- **UI Primitives:** Radix UI, Lucide Icons
- **Notifications:** Sonner
- **Data Fetching:** TanStack React Query
- **Utilities:** class-variance-authority, clsx

## Project Structure

```
frontend/
├─ public/               # Public assets (favicon, static files)
├─ src/
│  ├─ components/        # Reusable UI components (buttons, cards, etc.)
│  ├─ features/          # Page-level or feature-based components
│  ├─ styles/            # Global styles and CSS variable definitions
│  ├─ providers/         # React context providers (theme, query client)
│  ├─ utils/             # Utility functions and helpers
│  ├─ app.tsx            # Root application component
│  └─ main.tsx           # Entry point and render logic
├─ tailwind.config.ts    # Tailwind CSS configuration
├─ postcss.config.js     # PostCSS plugins configuration
├─ vite.config.ts        # Vite configuration
└─ README.md             # This file
```

## Environment Variables

By default, the frontend points to the backend API at `http://localhost:5500/api`. To override, create a `.env` file at `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5500/api
```

## Code Quality & Formatting

- **ESLint** enforces coding standards and best practices
- **Prettier** formats code for consistency
- **Tailwind Merge** resolves conflicts in class names
