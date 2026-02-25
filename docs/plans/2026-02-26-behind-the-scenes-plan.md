# Plan : Section Behind the Scenes / Stories

> Statut : 📋 Plan | Priorité : Basse | Estimation : ~2-3 jours

## Objectif

Créer un format "Stories" sur le site web qui montre les coulisses des shoots photo, des collaborations et des voyages de Fitia. Contenu exclusif qu'on ne retrouve pas sur les réseaux sociaux — une raison pour la communauté de revenir régulièrement sur le site.

## Stack technique

| Outil | Rôle |
|---|---|
| **Cloudflare R2** | Stockage des médias (images + vidéos courtes) |
| **Supabase** | Métadonnées des stories (titre, médias, ordre) |
| **Drizzle ORM** | Requêtes type-safe |
| **Framer Motion** | Transitions entre slides, gestures swipe |
| **Next.js** | Page dédiée + section preview home |

## Architecture

### Section preview sur la home

Un aperçu des dernières stories sous forme de cercles cliquables (style Instagram) inséré entre les sections existantes :

```
... → Stats → **Stories Preview** → Trusted → ...
```

### Page dédiée (optionnelle)

Si le volume de stories le justifie, une page `/behind-the-scenes` avec toutes les stories en grille.

### Composants

| Composant | Description |
|---|---|
| `StoriesPreview.tsx` | Section home : cercles des dernières stories |
| `StoryCircle.tsx` | Cercle avatar avec gradient border (style IG) |
| `StoryViewer.tsx` | Viewer plein écran (modal/overlay) |
| `StorySlide.tsx` | Un slide individuel (image ou vidéo) |
| `StoryProgress.tsx` | Barre de progression en haut |
| `app/api/stories/route.ts` | API route pour fetch les stories |

## Data model (Supabase + Drizzle)

### Table `stories`

```typescript
export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  coverUrl: text('cover_url').notNull(), // image de couverture (cercle)
  isActive: boolean('is_active').default(true),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Table `story_slides`

```typescript
export const storySlides = pgTable('story_slides', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyId: uuid('story_id').references(() => stories.id, { onDelete: 'cascade' }).notNull(),
  type: text('type', { enum: ['image', 'video'] }).notNull(),
  mediaUrl: text('media_url').notNull(), // URL R2
  caption: text('caption'), // texte overlay optionnel
  duration: integer('duration').default(5), // secondes (images), auto pour vidéos
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## UX détaillée

### Stories Preview (home)

- Rangée horizontale de cercles scrollables (6-8 max)
- Chaque cercle = cover de la story avec gradient border terracotta/vert sage
- Titre sous le cercle (ex: "Shoot Herea", "Coulisses Dart Gil", "Toulouse food tour")
- Scroll horizontal au swipe/drag sur mobile
- Clic = ouvre le StoryViewer en overlay plein écran

### StoryViewer (plein écran)

- **Overlay sombre** couvrant toute la page
- **Slide actuel** centré : image ou vidéo en format portrait (9:16)
- **Progress bars** en haut : une barre par slide, la barre active se remplit progressivement
- **Navigation** :
  - Tap côté gauche = slide précédent
  - Tap côté droit = slide suivant
  - Swipe gauche/droite = story précédente/suivante
  - Tap progress bar = jump à un slide spécifique
- **Auto-advance** : images = 5s, vidéos = durée de la vidéo
- **Pause** : long press ou hover (desktop)
- **Fermeture** : swipe down, bouton X, ou touche Escape
- **Caption** : texte overlay en bas avec fond gradient transparent

### Gestion dans l'admin

- Créer une story (titre + cover)
- Ajouter des slides (upload image/vidéo, caption, réordonner)
- Activer/désactiver une story
- Réordonner les stories

## Animations

- **Cercles preview** : stagger fade-in au scroll (useInView)
- **Ouverture viewer** : scale du cercle vers plein écran (shared layout animation Framer Motion)
- **Transition slides** : crossfade rapide (150ms)
- **Progress bar** : animation linéaire fluide
- **Fermeture** : slide-down + fade
- **Swipe stories** : momentum-based avec spring physics

## Performance

- **Lazy loading** : les médias des slides ne se chargent que quand le viewer est ouvert
- **Preload** : le slide suivant est preloadé en arrière-plan
- **Vidéos** : compressées en H.264/WebM, max 15s, stockées sur R2
- **Images** : optimisées via Next.js Image, format WebP
- **Viewer** : rendu dans un Portal React (hors du DOM principal)

## Formats de contenu suggérés

| Type de story | Exemple |
|---|---|
| **Shoot collab** | Coulisses du shooting avec une marque |
| **Food tour** | Visite d'un marché/quartier food |
| **Voyage** | Moments off-camera d'un trip |
| **Process créatif** | Du brief à la publication |
| **Day in my life** | Journée type de créatrice |
| **Spot reveal** | Découverte d'un nouveau restaurant |

## Étapes d'implémentation

1. **Tables Supabase** : `stories` + `story_slides`
2. **Schema Drizzle** : définir les tables + migrations
3. **StoriesPreview** : section home avec cercles
4. **StoryViewer** : overlay plein écran avec navigation
5. **StorySlide** : rendu image/vidéo + caption
6. **StoryProgress** : barres de progression animées
7. **Gestures** : swipe, tap zones, long press pause
8. **Auto-advance** : timer avec pause/resume
9. **Responsive** : plein écran sur tous les devices
10. **Admin** : CRUD stories et slides (dépend PR dashboard)

## Risques et points d'attention

- **Poids vidéos** : limiter à 15s max et compresser avant upload → documenter les specs dans l'admin
- **Mobile** : le swipe horizontal peut confliter avec la navigation du navigateur → utiliser preventDefault correctement
- **Accessibilité** : prévoir un bouton play/pause visible, ne pas auto-play les vidéos avec son
- **SEO** : le contenu des stories n'est pas indexable (overlay JS) → ajouter des balises meta pour la page dédiée si elle existe
- **Volume** : au début Fitia n'aura que 3-4 stories, le composant doit bien fonctionner avec peu de contenu

## Critères de succès

- [ ] Les cercles de preview s'affichent sur la home
- [ ] Le viewer s'ouvre en plein écran au clic
- [ ] La navigation (tap, swipe) fonctionne
- [ ] L'auto-advance fonctionne (images + vidéos)
- [ ] Les progress bars s'animent correctement
- [ ] Le swipe down ferme le viewer
- [ ] Les vidéos se lisent sans problème
- [ ] Le responsive fonctionne (mobile et desktop)
- [ ] Le contenu est gérable depuis l'admin
