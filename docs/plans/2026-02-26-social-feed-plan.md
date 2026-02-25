# Plan : Feed social unifié en temps réel

> Statut : 📋 Plan | Priorité : Moyenne | Estimation : ~2-3 jours

## Objectif

Créer un mur de contenu qui agrège les derniers posts Instagram et TikTok de Fitia, avec les vraies stats (likes, vues, commentaires), affiché dans le design du site. Les marques voient la qualité du contenu et l'engagement sans quitter le site. La communauté retrouve du contenu toujours frais.

## Stack technique

| Outil | Rôle |
|---|---|
| **Instagram Graph API** | Récupération des posts + stats Instagram |
| **TikTok Display API** | Récupération des vidéos TikTok (ou scraping léger) |
| **Next.js API Routes** | Proxy + cache des appels API |
| **ISR (revalidate)** | Cache côté serveur, refresh toutes les heures |
| **Framer Motion** | Animations masonry, hover effects |
| **Supabase** | Cache persistant des posts (fallback si API down) |

## Architecture

### Section sur la home

La section Feed s'insère entre **Stats** et **Trusted** dans `page.tsx` :

```
Navbar → Hero → About → Map → Collaborations → Stats → **Feed Social** → Trusted → BonsPlans → Contact → Footer
```

Pas de page dédiée pour l'instant — le feed est une section de la home qui montre les 6-9 derniers posts avec un lien "Voir plus sur Instagram/TikTok".

### Composants

| Composant | Description |
|---|---|
| `SocialFeed.tsx` | Section home : grille masonry des derniers posts |
| `SocialPost.tsx` | Card d'un post (image/vidéo, stats, plateforme) |
| `SocialStats.tsx` | Badge avec likes/vues/commentaires |
| `PlatformBadge.tsx` | Badge Instagram ou TikTok (icône + couleur) |
| `app/api/social-feed/route.ts` | API route : fetch + merge + cache des posts |

### Flow de données

```
Instagram Graph API ──┐
                      ├──→ API Route (/api/social-feed) ──→ Cache ISR 1h ──→ SocialFeed.tsx
TikTok Display API ───┘                                        │
                                                                ↓
                                                        Supabase (fallback)
```

## Data model

### Table `social_posts` (cache Supabase)

```typescript
export const socialPosts = pgTable('social_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  platformId: text('platform_id').notNull(), // ID du post sur la plateforme
  platform: text('platform', { enum: ['instagram', 'tiktok'] }).notNull(),
  type: text('type', { enum: ['image', 'video', 'carousel'] }).notNull(),
  caption: text('caption'),
  mediaUrl: text('media_url').notNull(),
  thumbnailUrl: text('thumbnail_url'), // pour les vidéos
  permalink: text('permalink').notNull(), // lien vers le post original
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  views: integer('views'), // TikTok + Reels uniquement
  publishedAt: timestamp('published_at').notNull(),
  fetchedAt: timestamp('fetched_at').defaultNow(),
});
```

## API Instagram Graph

### Setup requis

1. Créer une Facebook App (developers.facebook.com)
2. Ajouter le produit "Instagram Graph API"
3. Générer un Long-Lived Token (60 jours, à renouveler)
4. Endpoints utilisés :
   - `GET /me/media` — liste des posts
   - `GET /{media-id}` — détails d'un post (likes, comments)
   - Fields : `id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count`

### Variables d'environnement

```env
INSTAGRAM_ACCESS_TOKEN=xxx
INSTAGRAM_USER_ID=xxx
TIKTOK_ACCESS_TOKEN=xxx # si Display API disponible
```

## API TikTok

### Options

1. **TikTok Display API** (officielle) : accès limité, demande d'approbation
2. **Embed oEmbed** : `https://www.tiktok.com/oembed?url=VIDEO_URL` — gratuit, pas de stats
3. **Fallback manuel** : stocker les URLs TikTok dans Supabase, embed natif

Recommandation : commencer avec l'embed oEmbed + stats manuelles dans Supabase, migrer vers Display API quand disponible.

## UX détaillée

### Layout Masonry

- **Desktop** : 3 colonnes, posts de tailles variées (images carrées, vidéos verticales)
- **Tablette** : 2 colonnes
- **Mobile** : 2 colonnes compactes

### Interactions

- **Hover sur image** : overlay sombre avec stats (likes ❤️, commentaires 💬)
- **Hover sur vidéo** : auto-play muted (preview 3-5 secondes)
- **Clic** : ouvre le post original sur Instagram/TikTok (nouvel onglet)
- **Badge plateforme** : petit badge Instagram (gradient) ou TikTok (noir) en haut à droite

### Header de section

- Titre : "Mon contenu" ou "En ce moment"
- Sous-titre : stats globales en live ("3 400 followers Instagram · 3 067 followers TikTok")
- Toggle optionnel : "Tout" / "Instagram" / "TikTok"

## Animations

- **Entrée** : les cards apparaissent en stagger du centre vers l'extérieur (scale + fade)
- **Hover image** : overlay slide-up avec backdrop-blur léger
- **Hover vidéo** : scale subtle (1.02) + play de la preview
- **Loading** : skeleton shimmer pendant le fetch

## Performance

- **ISR** : les posts sont fetch côté serveur, mis en cache pendant 1h (revalidate: 3600)
- **Images** : utiliser les thumbnails Instagram (pas les full-res) pour les cards
- **Vidéos** : ne charger que le poster (thumbnail), auto-play uniquement au hover
- **Lazy loading** : la section n'est visible que quand on scroll → IntersectionObserver
- **Fallback** : si l'API est down, Supabase a les derniers posts cachés

## Étapes d'implémentation

1. **Setup Instagram Graph API** : app Facebook, token, tester les endpoints
2. **API Route** : `/api/social-feed` avec fetch Instagram + cache
3. **Table Supabase** : `social_posts` pour le cache persistant
4. **SocialFeed** : section home avec layout masonry
5. **SocialPost** : card avec hover effects et stats
6. **TikTok** : intégration oEmbed ou Display API
7. **Merge + tri** : combiner les deux sources, trier par date
8. **Animations** : stagger, hover, skeleton loading
9. **Responsive** : 3 → 2 → 2 colonnes
10. **Monitoring** : alerte si le token Instagram expire bientôt

## Risques et points d'attention

- **Token Instagram** : expire tous les 60 jours, nécessite un système de renouvellement (cron ou alerte email)
- **TikTok API** : accès restreint, le fallback oEmbed ne donne pas les stats → prévoir des stats manuelles
- **Rate limits** : Instagram = 200 requêtes/heure par token, largement suffisant avec ISR
- **CORS vidéos** : les vidéos Instagram ne peuvent pas être servies directement → utiliser les thumbnails + lien vers le post
- **Politique Meta** : respecter les guidelines d'affichage (attribution, pas de modification du contenu)

## Critères de succès

- [ ] Les 6-9 derniers posts Instagram s'affichent sur la home
- [ ] Les stats (likes, commentaires) sont visibles au hover
- [ ] Le layout masonry est responsive
- [ ] Le fallback fonctionne si l'API est down
- [ ] Le cache ISR fonctionne (pas d'appel API à chaque visite)
- [ ] Les vidéos ont une preview au hover
- [ ] Le lien ouvre le post original sur la bonne plateforme
- [ ] Lighthouse Performance > 90
