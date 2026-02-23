# PR2 — Page Bons Plans + Section Home

## Objectif

Ajouter une page dédiée `/bons-plans` qui affiche les bons plans voyage fetchés depuis une API externe, et une section sur la home qui en montre 3 avec un CTA vers la page complète.

---

## Étapes

### 1. Analyser l'existant

Le composant `BonsPlans.tsx` et la route API `/api/bons-plans` existent déjà mais ne sont pas utilisés. L'API fetch un Google Sheet CSV. Le composant a un fallback avec 6 deals en dur.

**Décisions à prendre :**
- Garder l'API Google Sheet ou passer sur une autre source ? (Le user mentionne "API externe")
- Design de la page complète vs la section home (3 items)

### 2. Section Bons Plans sur la Home

#### Position dans la page

Insérer entre **Trusted** et **Contact** (après les logos partenaires, avant le formulaire) :

```
Navbar → Hero → About → Collaborations → Stats → Trusted → **BonsPlansPreview** → Contact → Footer
```

#### Composant `BonsPlansPreview.tsx`

- Titre de section style existant ("Mes Bons Plans Voyage" ou similaire)
- Grid 3 colonnes (1 col mobile, 3 col desktop)
- Affiche les 3 premiers bons plans
- Chaque card : image, destination, prix, catégorie badge, description courte
- CTA en bas : "Voir tous les bons plans →" qui redirige vers `/bons-plans`
- Animations Framer Motion `useInView({ once: true })` comme les autres sections
- `id="bons-plans"` pour la navigation anchor

#### Mettre à jour la Navbar

Ajouter un lien "Bons Plans" dans la navigation :
- Desktop : entre "Stats" et "Contact"
- Mobile : idem dans le menu hamburger
- Href : `#bons-plans` (sur la home) ou `/bons-plans` (page dédiée) → à décider

### 3. Page `/bons-plans`

#### Route

Créer `app/bons-plans/page.tsx` — page App Router classique.

#### Layout de la page

- Header avec titre + description
- Filtres par catégorie (Tous, Voyage, Food, etc.)
- Grid responsive de cards (1/2/3 colonnes)
- Pagination ou infinite scroll si beaucoup de bons plans
- CTA retour vers la home

#### Réutiliser / refactorer BonsPlans.tsx

Le composant existant `BonsPlans.tsx` a déjà :
- Le fetch vers `/api/bons-plans`
- Un fallback avec 6 deals
- Un grid responsive
- Des cards avec image, catégorie, description

On peut :
1. Extraire la logique de fetch + les types dans un fichier partagé (`lib/bons-plans.ts`)
2. Extraire le composant Card (`BonPlanCard.tsx`)
3. `BonsPlansPreview` (home) utilise le même Card mais limité à 3
4. `app/bons-plans/page.tsx` utilise le même Card mais affiche tout + filtres

### 4. API / Data fetching

#### Option A : Garder l'API Google Sheet existante

- La route `app/api/bons-plans/route.ts` existe déjà
- Fetch CSV depuis Google Sheet, parse, cache 1h
- Simple mais dépend d'un Google Sheet public + env var `GOOGLE_SHEET_ID`

#### Option B : API externe (à préciser)

- Le user mentionne une "API externe" → à clarifier quelle source
- Adapter la route API ou fetch directement côté client/serveur

#### Data fetching strategy

- **Page `/bons-plans`** : Server Component, fetch côté serveur (SEO friendly)
- **Section home `BonsPlansPreview`** : Client Component (Framer Motion), fetch côté client avec `useEffect` ou passer les data en props depuis un parent Server Component

### 5. Types partagés

```typescript
// lib/types.ts ou lib/bons-plans.ts
export interface BonPlan {
  destination: string;
  country: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  href: string;
  image: string;
}
```

### 6. Mettre à jour la navigation

- `Navbar.tsx` : ajouter lien "Bons Plans"
- `app/page.tsx` : ajouter `<BonsPlansPreview />` entre Trusted et Contact
- `Footer.tsx` : ajouter lien vers `/bons-plans` si pertinent

---

## Checklist

- [ ] Créer `lib/bons-plans.ts` (types + fetch helper)
- [ ] Créer `BonPlanCard.tsx` (composant card réutilisable)
- [ ] Créer `BonsPlansPreview.tsx` (section home, 3 cards + CTA)
- [ ] Créer `app/bons-plans/page.tsx` (page complète)
- [ ] Refactorer/supprimer l'ancien `BonsPlans.tsx`
- [ ] Mettre à jour `Navbar.tsx` (lien Bons Plans)
- [ ] Mettre à jour `app/page.tsx` (ajouter BonsPlansPreview)
- [ ] Mettre à jour `Footer.tsx` (lien page)
- [ ] Adapter la route API si besoin (`app/api/bons-plans/route.ts`)
- [ ] Tester responsive (mobile/tablet/desktop)
- [ ] Tester les animations Framer Motion
- [ ] Tester le build (`npm run build`)
- [ ] Vérifier la navigation anchor + page routing

---

## Questions ouvertes

1. **Source de données** : on garde le Google Sheet ou tu as une autre API en tête ?
2. **Design des cards** : reprendre le style existant de `BonsPlans.tsx` ou nouveau design aligné avec le reste du site ?
3. **Navbar** : le lien "Bons Plans" pointe vers `#bons-plans` (section home) ou `/bons-plans` (page dédiée) ?
4. **Images des bons plans** : elles viennent d'où ? URLs externes dans l'API ou hébergées sur R2 aussi ?
