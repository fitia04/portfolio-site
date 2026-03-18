# Dark Mode Adaptatif — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un dark mode chaud et adaptatif au portfolio, avec bascule auto (system preference) + toggle manuel persisté en localStorage.

**Architecture:** Overrider les CSS custom properties dans une classe `.dark` sur `<html>`. Migrer toutes les couleurs hard-codées des composants vers les classes sémantiques Tailwind (`bg-bg`, `text-text`, `bg-primary`, etc.) qui mappent vers ces variables. Un script inline anti-flash dans `<head>` applique la classe avant le render React.

**Tech Stack:** Tailwind CSS v4 `@theme {}`, CSS custom properties, Framer Motion (toggle animation), localStorage, `prefers-color-scheme`

**Contrainte CSS critique :** Le bloc `.dark {}` DOIT être placé APRÈS `@import "tailwindcss"` et le bloc `@theme {}` dans `globals.css`. C'est la spécificité CSS qui fait que `.dark` override les valeurs de `@theme`. Si un refactoring déplace ces blocs, le dark mode cassera silencieusement.

**Choix de transition :** Seul `html` a une transition sur `background-color` et `color` (0.3s). Les éléments enfants changent instantanément. C'est un choix délibéré : ajouter `transition` sur tous les `*` causerait des problèmes de performance (repaints massifs sur chaque élément du DOM).

---

## Chunk 1: Fondation CSS + Infrastructure

### Task 1: Tokens dark mode dans globals.css

**Files:**
- Modify: `app/globals.css`

L'idée : les composants utilisent des classes comme `bg-bg`, `text-text`, `bg-primary` etc. (générées par Tailwind v4 à partir du `@theme {}`). En ajoutant un bloc `.dark` qui override les custom properties, toutes ces classes switchent automatiquement.

On ajoute aussi un token `--color-surface` pour les fonds de cards/formulaires (actuellement `bg-white`).

- [ ] **Step 1: Ajouter le token `--color-surface` et les overrides dark**

Dans `app/globals.css`, ajouter `--color-surface` dans `@theme {}`, puis le bloc `.dark` avec tous les overrides :

```css
@theme {
  --color-primary: #4A7C59;
  --color-primary-dark: #3A6147;
  --color-primary-light: #6BA882;
  --color-secondary: #B5976B;
  --color-secondary-dark: #8F7450;
  --color-bg: #F7F4EF;
  --color-bg-dark: #EDE8E0;
  --color-text: #1E2D24;
  --color-text-light: #5C6B5C;
  --color-accent: #DDD5C0;
  --color-surface: #FFFFFF;
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Lato", Arial, sans-serif;
}

.dark {
  --color-bg: #1A1612;
  --color-bg-dark: #231E19;
  --color-text: #E8E0D6;
  --color-text-light: #9B8E80;
  --color-primary: #6BA882;
  --color-primary-dark: #4A7C59;
  --color-primary-light: #3A6147;
  --color-secondary: #D4A574;
  --color-secondary-dark: #B5976B;
  --color-accent: #2D2620;
  --color-surface: #231E19;
}
```

- [ ] **Step 2: Ajouter les transitions et le color-scheme**

```css
html {
  scroll-behavior: smooth;
  transition: background-color 0.3s ease, color 0.3s ease;
}

html.dark {
  color-scheme: dark;
}
```

- [ ] **Step 3: Adapter les styles phone-input pour le dark mode**

Migrer les hex hard-codées vers des `var()` :

```css
.phone-input {
  border: 1px solid var(--color-accent);
  background-color: var(--color-bg);
  color: var(--color-text);
}
.phone-input:focus-within {
  border-color: var(--color-primary);
}
.phone-input .PhoneInputInput {
  color: var(--color-text);
}
```

- [ ] **Step 4: Ajouter les styles dark pour la scrollbar**

```css
/* La scrollbar utilise déjà var(--color-bg) et var(--color-primary) — OK */
```

(Déjà bon, les tokens changent automatiquement.)

- [ ] **Step 5: Ajouter `@media print` pour forcer le light mode**

```css
@media print {
  html.dark {
    --color-bg: #F7F4EF;
    --color-bg-dark: #EDE8E0;
    --color-text: #1E2D24;
    --color-text-light: #5C6B5C;
    --color-primary: #4A7C59;
    --color-primary-dark: #3A6147;
    --color-primary-light: #6BA882;
    --color-secondary: #B5976B;
    --color-secondary-dark: #8F7450;
    --color-accent: #DDD5C0;
    --color-surface: #FFFFFF;
    color-scheme: light;
  }
}
```

- [ ] **Step 6: Vérifier que le build passe**

Run: `npm run build`
Expected: Build success

- [ ] **Step 7: Commit**

```bash
git add app/globals.css
git commit -m "feat(dark-mode): tokens dark + surface token + phone-input vars"
```

---

### Task 2: Script anti-flash + layout.tsx

**Files:**
- Modify: `app/layout.tsx`

Le script inline s'exécute AVANT le render React pour éviter un flash blanc → noir.

- [ ] **Step 1: Ajouter le script anti-flash dans `<head>`**

Dans `app/layout.tsx`, ajouter dans `<head>` après le script JSON-LD :

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()`,
  }}
/>
```

- [ ] **Step 2: Vérifier que le build passe**

Run: `npm run build`
Expected: Build success

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(dark-mode): script anti-flash dans layout.tsx"
```

---

### Task 3: Composant ThemeToggle

**Files:**
- Create: `app/components/ThemeToggle.tsx`

Toggle soleil/lune avec animation Framer Motion. Gère localStorage + classe `.dark` sur `<html>`.

- [ ] **Step 1: Créer le composant ThemeToggle**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-full flex items-center justify-center text-text-light hover:text-primary transition-colors duration-300"
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={dark ? "moon" : "sun"}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
```

- [ ] **Step 2: Vérifier que le build passe**

Run: `npm run build`
Expected: Build success

- [ ] **Step 3: Commit**

```bash
git add app/components/ThemeToggle.tsx
git commit -m "feat(dark-mode): composant ThemeToggle avec animation"
```

---

## Chunk 2: Migration des composants (hex → classes sémantiques)

Chaque composant migre ses couleurs hard-codées vers les classes Tailwind sémantiques.

**Mapping de référence :**

| Hard-codé | Classe Tailwind |
|---|---|
| `bg-[#F7F4EF]` | `bg-bg` |
| `bg-[#EDE8E0]` / `backgroundColor: "#EDE8E0"` | `bg-bg-dark` |
| `bg-white` (cards/surfaces) | `bg-surface` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#5C6B5C]` | `text-text-light` |
| `text-[#4A7C59]` / `bg-[#4A7C59]` | `text-primary` / `bg-primary` |
| `bg-[#3A6147]` / `hover:bg-[#3A6147]` | `bg-primary-dark` / `hover:bg-primary-dark` |
| `text-[#6BA882]` | `text-primary-light` |
| `text-[#B5976B]` / `bg-[#B5976B]` | `text-secondary` / `bg-secondary` |
| `bg-[#DDD5C0]` / `border-[#DDD5C0]` | `bg-accent` / `border-accent` |

### Task 4: Navbar — intégrer ThemeToggle + migrer couleurs

**Files:**
- Modify: `app/components/Navbar.tsx`

- [ ] **Step 1: Ajouter l'import ThemeToggle**

```tsx
import ThemeToggle from "./ThemeToggle";
```

- [ ] **Step 2: Migrer toutes les couleurs hard-codées**

Remplacements dans les className :

| Avant | Après |
|---|---|
| `bg-[#F7F4EF]/95` | `bg-bg/95` |
| `border-[#DDD5C0]` | `border-accent` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#5C6B5C]` | `text-text-light` |
| `hover:text-[#4A7C59]` | `hover:text-primary` |
| `bg-[#4A7C59]` | `bg-primary` |
| `hover:bg-[#3A6147]` | `hover:bg-primary-dark` |
| `bg-[#F7F4EF]` (mobile menu) | `bg-bg` |
| `bg-[#4A7C59]` (underline) | `bg-primary` |

- [ ] **Step 3: Placer le ThemeToggle dans la navbar**

Desktop : entre les liens et le CTA :

```tsx
{/* Desktop links */}
<ul className="hidden md:flex items-center gap-8">
  {/* ... liens existants ... */}
</ul>

{/* Theme toggle + CTA */}
<div className="hidden md:flex items-center gap-4">
  <ThemeToggle />
  <a href="#contact" className="...">
    <FileText size={14} />
    Devis gratuit
  </a>
</div>
```

Mobile : dans le menu burger, avant le CTA :

```tsx
<li>
  <div className="flex items-center gap-2">
    <ThemeToggle />
    <span className="text-sm text-text-light">Mode sombre</span>
  </div>
</li>
```

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: Build success

- [ ] **Step 5: Commit**

```bash
git add app/components/Navbar.tsx
git commit -m "feat(dark-mode): navbar — toggle + migration couleurs sémantiques"
```

---

### Task 5: Hero — migrer couleurs

**Files:**
- Modify: `app/components/Hero.tsx`

- [ ] **Step 1: Migrer toutes les couleurs**

| Avant | Après |
|---|---|
| `bg-[#F7F4EF]` | `bg-bg` |
| `bg-[#B5976B]` (blob, dot, divider) | `bg-secondary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#1E2D24]/40` | `text-text/40` |
| `text-[#5C6B5C]/60` | `text-text-light/60` |
| `text-[#1E2D24]/30` | `text-text/30` |
| `hover:text-[#1E2D24]/60` | `hover:text-text/60` |
| `bg-[#4A7C59]` | `bg-primary` |
| `hover:bg-[#3A6147]` | `hover:bg-primary-dark` |

- [ ] **Step 2: Build check**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "feat(dark-mode): hero — migration couleurs sémantiques"
```

---

### Task 6: About — migrer couleurs

**Files:**
- Modify: `app/components/About.tsx`

- [ ] **Step 1: Migrer toutes les couleurs**

| Avant | Après |
|---|---|
| `bg-[#F7F4EF]` | `bg-bg` |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#B5976B]` | `text-secondary` |
| `text-[#5C6B5C]` | `text-text-light` |
| `bg-[#DDD5C0]` (badges) | `bg-accent` |

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/About.tsx
git commit -m "feat(dark-mode): about — migration couleurs sémantiques"
```

---

### Task 7: Collaborations — migrer couleurs

**Files:**
- Modify: `app/components/Collaborations.tsx`

- [ ] **Step 1: Migrer les couleurs**

| Avant | Après |
|---|---|
| `style={{ backgroundColor: "#EDE8E0" }}` | `className="... bg-bg-dark"` (supprimer le style inline) |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#5C6B5C]` | `text-text-light` |
| `bg-[#1E2D24]` (nav buttons) | `bg-text` |
| `hover:bg-[#4A7C59]` | `hover:bg-primary` |
| `bg-[#4A7C59]` (dot actif) | `bg-primary` |
| `bg-[#DDD5C0]` (dots inactifs) | `bg-accent` |

Note : l'iPhone mockup garde ses couleurs hard-codées (`#1a1a1a`, `#000`, `#3a3a3a`) car c'est un device frame toujours noir.

Les textes label/description sous le mockup :

| Avant | Après |
|---|---|
| `text-[#1E2D24]` (label) | `text-text` |
| `text-[#5C6B5C]` (description) | `text-text-light` |

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/Collaborations.tsx
git commit -m "feat(dark-mode): collaborations — migration couleurs sémantiques"
```

---

### Task 8: Stats — garder le gradient, migrer les détails

**Files:**
- Modify: `app/components/Stats.tsx`

Le gradient est déjà sombre (`#1E2D24` → `#B5976B`). Le texte est `text-white` sur fond sombre. Très peu de changements nécessaires.

- [ ] **Step 1: Migrer les couleurs qui utilisent des tokens**

| Avant | Après |
|---|---|
| `text-[#6BA882]` (tag) | `text-primary-light` |

Le reste (`text-white`, `bg-white/10`, gradient inline) reste tel quel — c'est un design sur fond sombre qui fonctionne dans les deux modes.

Les blobs décoratifs :
| Avant | Après |
|---|---|
| `bg-[#4A7C59]/20` | `bg-primary/20` |
| `bg-[#B5976B]/20` | `bg-secondary/20` |

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/Stats.tsx
git commit -m "feat(dark-mode): stats — migration couleurs sémantiques"
```

---

### Task 9: Trusted — migrer couleurs + logos dark

**Files:**
- Modify: `app/components/Trusted.tsx`

- [ ] **Step 1: Migrer les couleurs**

| Avant | Après |
|---|---|
| `bg-white` (section) | `bg-surface` |
| `text-[#1E2D24]` | `text-text` |
| `from-white to-transparent` (fade edges) | `from-surface to-transparent` |
| `from-white to-transparent` (fade droite) | `from-surface to-transparent` |

- [ ] **Step 2: Rendre le filtre logo conditionnel au dark mode**

Le logo YASSA BAR a `filter: brightness(0)` pour le rendre noir en light mode. En dark mode, il faut `brightness(1) invert(1)` ou `brightness(0) invert(1)` pour le rendre blanc.

Approche CSS : utiliser une classe conditionnelle basée sur le token. Plus simple : utiliser `filter: brightness(0)` en light et `filter: brightness(0) invert(1)` en dark.

Ajouter dans le style conditionnel :

```tsx
style={
  "invert" in logo && logo.invert
    ? { filter: "brightness(0) var(--logo-invert, )" }
    : undefined
}
```

Plus simple : on change l'inline style pour utiliser une classe CSS. Dans `globals.css` ajouter :

```css
.logo-invert {
  filter: brightness(0);
}
.dark .logo-invert {
  filter: brightness(0) invert(1);
}
```

Et dans le composant, remplacer le style inline par `className="logo-invert"`.

- [ ] **Step 3: Build check + Commit**

```bash
git add app/components/Trusted.tsx app/globals.css
git commit -m "feat(dark-mode): trusted — migration couleurs + logos adaptatifs"
```

---

### Task 10: Contact — migrer couleurs

**Files:**
- Modify: `app/components/Contact.tsx`

- [ ] **Step 1: Migrer toutes les couleurs**

| Avant | Après |
|---|---|
| `bg-[#F7F4EF]` (section) | `bg-bg` |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#5C6B5C]` | `text-text-light` |
| `bg-white` (form card) | `bg-surface` |
| `border-[#DDD5C0]` | `border-accent` |
| `bg-[#F7F4EF]` (inputs) | `bg-bg` |
| `focus:border-[#4A7C59]` | `focus:border-primary` |
| `bg-[#4A7C59]` (submit) | `bg-primary` |
| `hover:bg-[#3A6147]` | `hover:bg-primary-dark` |
| `disabled:hover:bg-[#4A7C59]` | `disabled:hover:bg-primary` |

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/Contact.tsx
git commit -m "feat(dark-mode): contact — migration couleurs sémantiques"
```

---

### Task 11: Footer — migrer couleurs

**Files:**
- Modify: `app/components/Footer.tsx`

- [ ] **Step 1: Migrer toutes les couleurs**

| Avant | Après |
|---|---|
| `style={{ backgroundColor: "#EDE8E0" }}` | `className="... bg-bg-dark"` (supprimer le style inline) |
| `bg-[#1E2D24]` (back-to-top) | `bg-text` |
| `hover:bg-[#4A7C59]` | `hover:bg-primary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#5C6B5C]` | `text-text-light` |
| `border-[#DDD5C0]` | `border-accent` |
| `bg-white` (social icons) | `bg-surface` |
| `hover:text-[#4A7C59]` | `hover:text-primary` |
| `hover:border-[#4A7C59]` | `hover:border-primary` |

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/Footer.tsx
git commit -m "feat(dark-mode): footer — migration couleurs sémantiques"
```

---

### Task 12: BonsPlans — migrer couleurs

**Files:**
- Modify: `app/components/BonsPlans.tsx`

Note : ce composant n'est pas importé dans `page.tsx` actuellement, mais on le migre pour cohérence et usage futur.

- [ ] **Step 1: Migrer toutes les couleurs**

| Avant | Après |
|---|---|
| `bg-[#F7F4EF]` | `bg-bg` |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#5C6B5C]` | `text-text-light` |
| `bg-white` (cards) | `bg-surface` |
| `border-[#DDD5C0]` | `border-accent` |
| `border-[#EDE8E0]` | `border-bg-dark` |

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/BonsPlans.tsx
git commit -m "feat(dark-mode): bons-plans — migration couleurs sémantiques"
```

---

### Task 13: Discoveries — migrer couleurs

**Files:**
- Modify: `app/components/Discoveries.tsx`

Note : ce composant n'est pas importé dans `page.tsx` actuellement, mais on le migre pour cohérence.

- [ ] **Step 1: Migrer toutes les couleurs**

| Avant | Après |
|---|---|
| `bg-[#F7F4EF]` | `bg-bg` |
| `text-[#4A7C59]` | `text-primary` |
| `text-[#1E2D24]` | `text-text` |
| `text-[#5C6B5C]` | `text-text-light` |
| `text-[#B5976B]` | `text-secondary` |
| `bg-white` (cards) | `bg-surface` |
| `bg-[#DDD5C0]` (filter buttons inactifs) | `bg-accent` |
| `fill-[#4A7C59]` | `fill-primary` |

Les gradients inline sur les cards (de type `from-[#1E2D24]`) restent tels quels — ce sont des overlays sur images qui fonctionnent dans les deux modes.

- [ ] **Step 2: Build check + Commit**

```bash
git add app/components/Discoveries.tsx
git commit -m "feat(dark-mode): discoveries — migration couleurs sémantiques"
```

---

## Chunk 3: Vérification finale

### Task 14: Build final + lint

**Files:** Aucun (vérification uniquement)

- [ ] **Step 1: Build complet**

Run: `npm run build`
Expected: Build success, 0 erreurs

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 0 erreurs

- [ ] **Step 3: Vérification visuelle rapide**

Ouvrir le site dans un navigateur et vérifier :
- Toggle fonctionne (clic → bascule immédiate)
- Pas de flash blanc en dark mode au rechargement
- Toutes les sections lisibles en dark
- Photos food ressortent bien sur fond sombre
- Glassmorphism navbar OK en dark
- Formulaire contact lisible
- Logos partenaires visibles

---

## Résumé des fichiers

| Fichier | Action |
|---|---|
| `app/globals.css` | Modifier — tokens dark, surface, phone-input vars, logo-invert |
| `app/layout.tsx` | Modifier — script anti-flash |
| `app/components/ThemeToggle.tsx` | Créer — toggle avec animation |
| `app/components/Navbar.tsx` | Modifier — intégrer toggle + couleurs sémantiques |
| `app/components/Hero.tsx` | Modifier — couleurs sémantiques |
| `app/components/About.tsx` | Modifier — couleurs sémantiques |
| `app/components/Collaborations.tsx` | Modifier — couleurs sémantiques + supprimer style inline |
| `app/components/Stats.tsx` | Modifier — couleurs sémantiques (minimal) |
| `app/components/Trusted.tsx` | Modifier — couleurs sémantiques + logo conditionnel |
| `app/components/Contact.tsx` | Modifier — couleurs sémantiques |
| `app/components/Footer.tsx` | Modifier — couleurs sémantiques + supprimer style inline |
| `app/components/BonsPlans.tsx` | Modifier — couleurs sémantiques (pas dans page.tsx, cohérence) |
| `app/components/Discoveries.tsx` | Modifier — couleurs sémantiques (pas dans page.tsx, cohérence) |
