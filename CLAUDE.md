# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
```

## Architecture

Single-page portfolio for a French food & travel content creator. All sections live in `app/components/` and are composed in `app/page.tsx` in order: `Navbar → Hero → About → Collaborations → Discoveries → Stats → Contact → Footer`.

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
| `--color-primary` | `#C8694A` (terracotta) |
| `--color-secondary` | `#8B9B6E` (sage green) |
| `--color-bg` | `#FAF6F1` (cream) |
| `--color-text` | `#2D2418` (dark brown) |
| `--color-text-light` | `#6B5B4E` |
| `--color-accent` | `#E8D5C4` |
| `--font-serif` | Playfair Display (used for all headings via CSS) |
| `--font-sans` | Lato (body default) |

Font variables are applied via `layout.tsx` using Next.js Google Fonts (`next/font/google`). Headings use `--font-serif` — either via the global CSS rule (`h1–h4`) or inline `style={{ fontFamily: "var(--font-serif)" }}` for elements outside those tags.

All components use `"use client"` since they rely on Framer Motion animations or browser APIs.
