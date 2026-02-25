# Plan : Dark mode adaptatif

> Statut : 📋 Plan | Priorité : Basse | Estimation : ~1-2 jours

## Objectif

Ajouter un mode sombre au site avec une palette chaude et sophistiquée qui met en valeur les photos food & travel. Les tons froids classiques du dark mode ne conviennent pas à un site food — on veut des bruns chauds, des terracotta assombris, du vert sage profond. Le tout avec une transition fluide et un respect des préférences système.

## Stack technique

| Outil | Rôle |
|---|---|
| **CSS Custom Properties** | Déjà en place via `@theme {}` — juste ajouter les variantes dark |
| **`prefers-color-scheme`** | Détection automatique du mode système |
| **localStorage** | Persistance du choix utilisateur |
| **Framer Motion** | Animation du toggle |
| **Tailwind dark:** | Variantes dark mode via la classe `.dark` |

## Architecture

### Stratégie : classe `.dark` sur `<html>`

Tailwind v4 supporte le dark mode via `@media (prefers-color-scheme: dark)` ou via la classe `.dark`. On utilise la **classe** pour permettre un toggle manuel qui override la préférence système.

### Flow de détection

```
1. Au chargement (avant le render, dans un <script> inline) :
   - Vérifie localStorage('theme')
   - Si 'dark' → ajoute .dark sur <html>
   - Si 'light' → ne rien faire
   - Si absent → vérifie prefers-color-scheme
     - Si dark → ajoute .dark
     - Si light → ne rien faire

2. Au toggle :
   - Bascule la classe .dark sur <html>
   - Sauvegarde dans localStorage
```

Le script inline dans `<head>` évite le flash de thème incorrect (FOIT — Flash Of Incorrect Theme).

## Palette Dark Mode

### Tokens actuels (light) → Dark

| Token | Light | Dark | Rôle |
|---|---|---|---|
| `--color-bg` | `#F7F4EF` (cream) | `#1A1612` (brun très foncé) | Fond principal |
| `--color-bg-dark` | `#EDE8E0` | `#231E19` (brun foncé) | Fond sections alternées |
| `--color-text` | `#1E2D24` | `#E8E0D6` (cream clair) | Texte principal |
| `--color-text-light` | `#5C6B5C` | `#9B8E80` (taupe) | Texte secondaire |
| `--color-primary` | `#4A7C59` (vert sage) | `#6BA882` (vert sage clair) | Boutons, accents |
| `--color-primary-dark` | `#3A6147` | `#4A7C59` | Hover |
| `--color-primary-light` | `#6BA882` | `#3A6147` | Accents légers |
| `--color-secondary` | `#B5976B` (terracotta) | `#D4A574` (terracotta clair) | Titres, highlights |
| `--color-secondary-dark` | `#8F7450` | `#B5976B` | Variante |
| `--color-accent` | `#DDD5C0` (beige) | `#2D2620` (brun moyen) | Borders, inputs |

### Principes de la palette

- **Pas de noir pur** (`#000`) : le fond est un brun très chaud `#1A1612`
- **Contraste suffisant** : WCAG AA minimum (4.5:1 pour le texte)
- **Photos** : les images food ressortent mieux sur fond sombre (effet "galerie")
- **Verre** : le glassmorphism de la navbar est encore plus beau en dark (blur sur fond sombre)

## Implémentation CSS

### Dans `globals.css`

```css
@theme {
  /* Tokens existants (light mode) */
  --color-bg: #F7F4EF;
  --color-text: #1E2D24;
  /* ... etc ... */
}

/* Dark mode overrides */
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
}

/* Transition douce entre les modes */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

html.dark {
  color-scheme: dark;
}
```

### Script anti-flash dans `layout.tsx`

```typescript
// Script inline exécuté AVANT le render React
const themeScript = `
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

// Dans le <head> de layout.tsx
<script dangerouslySetInnerHTML={{ __html: themeScript }} />
```

## Composant Toggle

### `ThemeToggle.tsx`

- Placé dans la **navbar**, à gauche du CTA "Devis gratuit"
- Icône : Soleil (☀️) ↔ Lune (🌙) avec animation de rotation/morph
- Au clic :
  1. Toggle la classe `.dark` sur `<html>`
  2. Sauvegarde dans localStorage
  3. Animation de transition (rotation 180° + scale)

### Animation du toggle

```
Light → Dark : le soleil tourne et se transforme en lune (morph SVG)
Dark → Light : la lune tourne et se transforme en soleil
```

Utiliser Framer Motion `AnimatePresence` + `layoutId` pour une transition fluide.

### Taille et position

- Desktop : icône 20x20px, dans la navbar entre les liens et le CTA
- Mobile : icône dans le menu burger

## Éléments à adapter section par section

### Navbar
- Glassmorphism : `bg-white/80` → `bg-[#1A1612]/80` (les deux avec backdrop-blur)
- Liens : couleur texte via les custom properties (déjà OK si tout utilise `text-text`)
- Logo : vérifier le contraste

### Hero
- Blob décoratif : ajuster l'opacité en dark
- Stats badges : fond `bg-white/10` → `bg-white/5` (plus subtil en dark)
- Photo : ajouter une ombre douce pour la décoller du fond

### About
- Photo : border/shadow subtile pour la séparer du fond
- Badges : vérifier le contraste fond/icône

### Collaborations
- iPhone mockup : le frame est déjà noir → parfait en dark mode
- Fond de section : vérifier la card description

### Stats
- Le gradient dramatique existant fonctionne probablement déjà en dark
- Vérifier les cards en `bg-white/10`

### Contact
- Inputs : `bg-white` → `bg-[#231E19]`, border ajustée
- Labels : couleur texte via custom properties

### Footer
- Fond sombre déjà → ajuster légèrement pour ne pas être identique au body dark
- Bouton back-to-top : vérifier la visibilité

### Trusted
- Logos : certains sont sombres → ajouter un fond léger ou inverter en dark
- Le filtre `invert` existant sur YASSA BAR devra être conditionnel

## Scrollbar en dark mode

```css
.dark ::-webkit-scrollbar-track {
  background: #1A1612;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4A7C59;
}
```

## Étapes d'implémentation

1. **Palette** : définir les tokens dark dans `globals.css` (classe `.dark`)
2. **Script anti-flash** : ajouter le script inline dans `layout.tsx`
3. **ThemeToggle** : composant avec animation + localStorage
4. **Navbar** : intégrer le toggle + adapter le glassmorphism
5. **Section par section** : passer en revue chaque composant et ajuster
6. **Inputs/formulaire** : adapter les styles du formulaire Contact
7. **Scrollbar** : adapter la scrollbar custom
8. **Images/logos** : vérifier le contraste, ajouter des ombres si nécessaire
9. **Tests** : vérifier le rendu sur tous les navigateurs + mode système
10. **Accessibilité** : vérifier les ratios de contraste WCAG AA

## Risques et points d'attention

- **Flash de thème** : le script inline dans `<head>` est indispensable pour éviter un flash blanc → noir
- **Photos** : les photos food sont prises en ambiance lumineuse — elles doivent garder leur éclat en dark mode (pas de filtre dessus)
- **Trusted logos** : certains logos sont sur fond transparent et conçus pour le light mode → prévoir un fond subtil ou un filtre conditionnel
- **Impression** : si quelqu'un imprime la page, forcer le light mode (`@media print`)
- **Tailwind v4** : vérifier que la stratégie `.dark` fonctionne bien avec le `@theme {}` block (pas de `darkMode: 'class'` config puisqu'il n'y a pas de `tailwind.config.js`)

## Critères de succès

- [ ] Le dark mode s'active automatiquement si le système est en dark
- [ ] Le toggle dans la navbar bascule instantanément
- [ ] Pas de flash blanc au chargement en dark mode
- [ ] Le choix persiste après rechargement (localStorage)
- [ ] Toutes les sections sont lisibles en dark mode
- [ ] Les photos food/travel ressortent bien sur fond sombre
- [ ] Le contraste respecte WCAG AA (4.5:1 minimum)
- [ ] La transition entre les modes est fluide (0.3s)
- [ ] Fonctionne sur Chrome, Firefox, Safari
- [ ] L'impression force le light mode
