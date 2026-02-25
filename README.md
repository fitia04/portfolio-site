# Fitia Travel — Portfolio

Portfolio d'une créatrice de contenu food & voyages basée à Toulouse.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — config via `@theme {}` dans `globals.css`
- **Framer Motion** — animations scroll-triggered
- **Lucide React** — icônes
- **EmailJS** — formulaire de contact

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |

## Architecture

```
app/
├── components/
│   ├── Navbar.tsx          # Nav fixe + glassmorphism + menu mobile
│   ├── Hero.tsx            # Header avec stats sociales
│   ├── About.tsx           # Bio + badges thématiques
│   ├── Collaborations.tsx  # Carousel vidéo en iPhone mockup
│   ├── Stats.tsx           # Compteurs animés (Instagram, TikTok)
│   ├── Trusted.tsx         # Carousel infini logos partenaires
│   ├── Contact.tsx         # Formulaire EmailJS + phone input
│   └── Footer.tsx          # Liens + social + back-to-top
├── globals.css             # Design tokens (@theme)
├── layout.tsx              # Fonts (Playfair Display, Lato) + metadata
└── page.tsx                # Composition des sections
```

## Design tokens

| Token | Valeur | Usage |
|---|---|---|
| `--color-primary` | `#4A7C59` | Vert sage — boutons, accents |
| `--color-secondary` | `#B5976B` | Terracotta — titres, highlights |
| `--color-bg` | `#F7F4EF` | Cream — fond principal |
| `--color-text` | `#1E2D24` | Brun foncé — texte |
| `--font-serif` | Playfair Display | Titres (h1–h4) |
| `--font-sans` | Lato | Body |

## CI

GitHub Actions sur chaque push et PR vers `main` :

1. **ESLint** — lint avec tolérance warnings
2. **TypeScript** — `tsc --noEmit`
3. **Build** — build de production (après lint + typecheck)

## Roadmap

| PR | Feature | Statut |
|---|---|---|
| [#1](../../pull/1) | Migration assets Cloudflare R2 | Draft |
| [#2](../../pull/2) | Section Bons Plans + API Amadeus | Open |
| [#4](../../pull/4) | Map interactive des découvertes | Draft |
| [#5](../../pull/5) | Feed social unifié | Draft |
| [#6](../../pull/6) | Media Kit dynamique + PDF | Draft |
| [#7](../../pull/7) | Behind the Scenes / Stories | Draft |
| [#8](../../pull/8) | Dashboard admin | Draft |
| [#9](../../pull/9) | Scroll-driven animations | Draft |
| [#10](../../pull/10) | Dark mode adaptatif | Draft |
