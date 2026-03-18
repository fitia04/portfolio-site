# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
```

## Architecture

Single-page portfolio for a French food & travel content creator. All sections live in `app/components/` and are composed in `app/page.tsx` in order: `Navbar → Hero → About → Discoveries → MapPreview → Collaborations → Stats → Trusted → Contact → Footer`.

A dedicated page `/decouvertes` provides a full interactive map experience with filters and sidebar.

Navigation uses anchor links (`#about`, `#collaborations`, `#decouvertes`, `#stats`, `#contact`) — section `id` attributes must match these hrefs.

### Stack

- **Next.js 16** with App Router, **React 19**, **TypeScript**
- **Tailwind CSS v4** — configured via `@theme {}` block in `app/globals.css`, not a `tailwind.config.js` file
- **Framer Motion** for animations — entry animations use `useInView` with `{ once: true }` for scroll-triggered reveals
- **Lucide React** for icons

### Design tokens

All color and font tokens are CSS custom properties defined in the `@theme {}` block in `app/globals.css`:

| Token | Value |
|---|---|
| `--color-primary` | `#4A7C59` (green) |
| `--color-primary-dark` | `#3A6147` |
| `--color-primary-light` | `#6BA882` |
| `--color-secondary` | `#B5976B` (beige/gold) |
| `--color-secondary-dark` | `#8F7450` |
| `--color-bg` | `#F7F4EF` (cream) |
| `--color-bg-dark` | `#EDE8E0` |
| `--color-text` | `#1E2D24` (dark green-brown) |
| `--color-text-light` | `#5C6B5C` |
| `--color-accent` | `#DDD5C0` |
| `--font-serif` | Playfair Display (used for all headings via CSS) |
| `--font-sans` | Lato (body default) |

Font variables are applied via `layout.tsx` using Next.js Google Fonts (`next/font/google`). Headings use `--font-serif` — either via the global CSS rule (`h1–h4`) or inline `style={{ fontFamily: "var(--font-serif)" }}` for elements outside those tags.

All components use `"use client"` since they rely on Framer Motion animations or browser APIs.
