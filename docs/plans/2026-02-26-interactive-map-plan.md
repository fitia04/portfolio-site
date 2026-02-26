# Plan : Map interactive des découvertes

> Statut : 📋 Plan | Priorité : Haute | Estimation : ~3-4 jours

## Objectif

Créer une section interactive avec une carte du monde montrant tous les spots food & voyages visités par Fitia. Double usage : la communauté explore visuellement les destinations, les marques voient la portée géographique.

## Stack technique

| Outil | Rôle |
|---|---|
| **MapLibre GL JS** | Rendu de la carte (open source, gratuit, fork de Mapbox) |
| **react-map-gl** | Wrapper React pour MapLibre |
| **Supabase** | Stockage des spots (table `spots`) |
| **Drizzle ORM** | Requêtes type-safe |
| **Framer Motion** | Animations des popups et transitions |
| **Supercluster** | Clustering côté client pour les performances |

## Architecture

### Nouvelle section sur la home

La section Map s'insère entre **About** et **Collaborations** dans `page.tsx` :

```
Navbar → Hero → About → **Map** → Collaborations → Stats → Trusted → BonsPlans → Contact → Footer
```

Section id : `#decouvertes` (réutilise l'anchor existant dans la navbar).

### Page dédiée `/decouvertes`

Une page complète avec la carte en grand + liste des spots filtrables + recherche.

### Composants

| Composant | Description |
|---|---|
| `MapPreview.tsx` | Section home : carte avec 5-6 pins featured + CTA "Explorer toutes mes découvertes" |
| `app/decouvertes/page.tsx` | Server Component, SEO, fetch initial des spots |
| `app/decouvertes/MapPageClient.tsx` | Client component : carte plein écran + sidebar filtres |
| `MapPin.tsx` | Pin custom animé (icône différente selon catégorie) |
| `SpotPopup.tsx` | Popup riche : photo, nom, catégorie, note, extrait review |
| `SpotCard.tsx` | Card dans la liste mobile/sidebar |
| `MapFilters.tsx` | Filtres par catégorie + barre de recherche |

## Data model (Supabase + Drizzle)

### Table `spots`

```typescript
export const spots = pgTable('spots', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(), // pour les popups
  category: text('category', { enum: ['food', 'voyage', 'food-voyage'] }).notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  imageUrl: text('image_url').notNull(), // URL R2
  rating: integer('rating'), // 1-5 optionnel
  emoji: text('emoji'), // emoji représentatif
  isFeatured: boolean('is_featured').default(false), // affiché sur la home
  bonPlanId: uuid('bon_plan_id').references(() => bonsPlans.id), // lien optionnel
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

## UX détaillée

### Section home (MapPreview)

- Carte statique stylisée (pas de zoom/drag pour ne pas bloquer le scroll)
- 5-6 pins featured avec animation d'apparition staggered
- Hover sur un pin = mini tooltip avec nom + emoji
- CTA : "Explorer toutes mes découvertes →" vers `/decouvertes`
- Fond intégré au design du site (coins arrondis, ombre douce)

### Page dédiée

**Desktop** :
- Layout : carte 70% + sidebar 30%
- Sidebar : filtres en haut, liste scrollable de SpotCards en dessous
- Clic sur un pin → fly-to animation + popup + highlight dans la sidebar
- Clic sur une card sidebar → fly-to sur la carte

**Mobile** :
- Vue par défaut : liste de SpotCards (plus pratique au touch)
- Toggle "Voir la carte" : carte plein écran avec bottom sheet au clic sur un pin
- Swipe sur le bottom sheet pour voir les détails

### Filtres

- Toggles : "Food" / "Voyages" / "Tout"
- Recherche par nom de lieu ou ville
- Optionnel : filtre par pays (dropdown)

## Animations

- **Pins** : apparition avec scale spring (0 → 1) staggered par distance au centre
- **Fly-to** : transition douce entre les destinations (durée 1.5s, ease-out)
- **Popup** : slide-up + fade avec Framer Motion
- **Clusters** : animation de split/merge quand on zoom
- **Section home** : la carte fade-in au scroll (useInView, once: true)

## Performance

- **Chargement lazy** : MapLibre chargé dynamiquement (`next/dynamic` avec ssr: false)
- **Tiles** : utiliser un style gratuit (Carto Positron, thème clair qui match le design)
- **Clustering** : Supercluster côté client, pas de requête serveur au zoom
- **Images** : thumbnails en 200x200 pour les popups, chargées depuis R2
- **ISR** : les spots sont fetch côté serveur avec revalidation toutes les heures
- **Bundle** : MapLibre = ~200KB gzipped, chargé uniquement quand la section est visible

## Étapes d'implémentation

1. **Setup Supabase** : créer la table `spots`, seed avec 10-15 spots de démonstration
2. **Schema Drizzle** : définir le schema + migration
3. **MapPreview** : section home avec carte statique et pins featured
4. **Page dédiée** : layout desktop avec carte interactive + sidebar
5. **SpotPopup + SpotCard** : composants de détail
6. **Filtres** : catégorie + recherche
7. **Responsive** : adaptation mobile avec liste + bottom sheet
8. **Animations** : fly-to, pins staggered, popups
9. **Lien BonsPlans** : connecter les spots aux bons plans existants
10. **Admin** : CRUD spots dans le dashboard admin (dépend de la PR dashboard)

## Risques et points d'attention

- **Poids du bundle** : MapLibre est lourd (~200KB), le lazy loading est indispensable
- **Mobile** : le drag de la carte peut confliter avec le scroll de la page → la carte ne doit PAS être draggable sur la home, seulement sur la page dédiée
- **Tiles gratuites** : Carto/Stadia sont gratuits mais ont des limites de requêtes — surveiller l'usage
- **Géocodage** : les coordonnées doivent être saisies dans l'admin (pas de géocodage auto pour éviter une API de plus)

## Critères de succès

- [ ] La carte s'affiche sur la home avec les spots featured
- [ ] La page /decouvertes permet d'explorer tous les spots
- [ ] Les filtres food/voyage fonctionnent
- [ ] Le fly-to anime entre les destinations
- [ ] Le responsive fonctionne (liste mobile, carte desktop)
- [ ] Le chargement est lazy (pas de MapLibre dans le bundle initial)
- [ ] Les spots sont gérables depuis le dashboard admin
- [ ] Lighthouse Performance > 90 sur la home malgré la carte
