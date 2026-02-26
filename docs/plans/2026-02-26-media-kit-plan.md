# Plan : Media Kit dynamique + génération PDF

> Statut : 📋 Plan | Priorité : Haute | Estimation : ~3-4 jours

## Objectif

Créer une page `/media-kit` professionnelle qui affiche les statistiques de Fitia en temps réel et permet aux marques de télécharger un PDF brandé toujours à jour. Plus besoin de refaire un Canva tous les mois — les chiffres se mettent à jour automatiquement.

## Stack technique

| Outil | Rôle |
|---|---|
| **Supabase** | Stockage des stats, historique, leads |
| **Drizzle ORM** | Requêtes type-safe |
| **Instagram Graph API** | Stats live (followers, engagement) |
| **@react-pdf/renderer** | Génération PDF côté serveur |
| **Framer Motion** | Animations de la page |
| **Next.js API Routes** | Endpoint de génération PDF + sync stats |

## Architecture

### Page `/media-kit`

Page publique accessible depuis la navbar (CTA secondaire) et le footer.

- **Server Component** pour le SEO (les marques cherchent "fitia media kit" sur Google)
- **Client Components** pour les animations et interactions

### Composants

| Composant | Description |
|---|---|
| `app/media-kit/page.tsx` | Server Component, SEO, fetch stats initiales |
| `app/media-kit/MediaKitClient.tsx` | Client component principal |
| `MediaKitHero.tsx` | Header avec photo + bio courte + CTA téléchargement |
| `StatsOverview.tsx` | Grille de stats avec compteurs animés |
| `AudienceSection.tsx` | Demographics : âge, genre, localisation (charts) |
| `ContentShowcase.tsx` | Meilleurs posts avec stats |
| `CollabHistory.tsx` | Logos des marques partenaires (réutilise les données Trusted) |
| `ServicesGrid.tsx` | Formats proposés avec descriptions et tarifs optionnels |
| `DownloadCTA.tsx` | Bouton téléchargement + formulaire email optionnel |
| `app/api/media-kit/pdf/route.ts` | Endpoint génération PDF |
| `app/api/media-kit/sync/route.ts` | Cron job sync des stats |
| `MediaKitPDF.tsx` | Template React-PDF pour le document |

## Data model (Supabase + Drizzle)

### Table `creator_stats`

```typescript
export const creatorStats = pgTable('creator_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  platform: text('platform', { enum: ['instagram', 'tiktok'] }).notNull(),
  followers: integer('followers').notNull(),
  engagementRate: doublePrecision('engagement_rate'), // en pourcentage
  avgLikes: integer('avg_likes'),
  avgComments: integer('avg_comments'),
  avgViews: integer('avg_views'), // vidéos
  monthlyReach: integer('monthly_reach'),
  monthlyImpressions: integer('monthly_impressions'),
  recordedAt: timestamp('recorded_at').defaultNow(),
});
```

### Table `audience_demographics`

```typescript
export const audienceDemographics = pgTable('audience_demographics', {
  id: uuid('id').defaultRandom().primaryKey(),
  platform: text('platform', { enum: ['instagram', 'tiktok'] }).notNull(),
  // Tranches d'âge (pourcentages)
  age13_17: doublePrecision('age_13_17').default(0),
  age18_24: doublePrecision('age_18_24').default(0),
  age25_34: doublePrecision('age_25_34').default(0),
  age35_44: doublePrecision('age_35_44').default(0),
  age45Plus: doublePrecision('age_45_plus').default(0),
  // Genre (pourcentages)
  genderFemale: doublePrecision('gender_female').default(0),
  genderMale: doublePrecision('gender_male').default(0),
  // Top pays (JSON)
  topCountries: jsonb('top_countries'), // [{ country: "FR", percentage: 75 }, ...]
  // Top villes (JSON)
  topCities: jsonb('top_cities'), // [{ city: "Toulouse", percentage: 25 }, ...]
  recordedAt: timestamp('recorded_at').defaultNow(),
});
```

### Table `media_kit_leads`

```typescript
export const mediaKitLeads = pgTable('media_kit_leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  company: text('company'),
  downloadedAt: timestamp('downloaded_at').defaultNow(),
});
```

## UX détaillée

### Page Media Kit

**Layout vertical** (scroll one-pager premium) :

1. **Hero** : Photo de Fitia + nom + tagline + "Food & Voyages Creator basée à Toulouse" + bouton "Télécharger le Media Kit PDF"
2. **Stats Overview** : 4-6 cards avec compteurs animés
   - Followers Instagram (avec évolution ↑ vs mois dernier)
   - Followers TikTok
   - Taux d'engagement moyen
   - Vues moyennes par vidéo
   - Reach mensuel
   - Nombre de collaborations
3. **Audience** : Charts visuels (pas des graphes complexes — des barres horizontales stylisées)
   - Répartition par âge (barres)
   - Genre (donut simplifié)
   - Top 5 pays (barres avec drapeaux emoji)
   - Top 5 villes
4. **Contenu** : 4-6 meilleurs posts (les plus performants) avec stats
5. **Collaborations** : Logos des marques en grille (réutilise les données de Trusted)
6. **Services** : Cards avec les formats proposés
   - 📸 Shooting photo
   - 🎬 Reels / TikTok
   - 📣 Stories sponsorisées
   - 📝 Article / Review
   - 🎁 Unboxing
   - Chaque card : description + fourchette de prix optionnelle
7. **CTA final** : "Travaillons ensemble" + lien vers #contact + bouton PDF

### Formulaire de téléchargement (optionnel)

- Modal au clic sur "Télécharger"
- Champs : Email (requis) + Nom de l'entreprise (optionnel)
- Le PDF se télécharge après soumission
- L'email est stocké dans `media_kit_leads`
- Option : Fitia peut désactiver le gate dans l'admin

### PDF généré

- Format A4 portrait, 2-3 pages
- Page 1 : Hero + Stats + Audience
- Page 2 : Meilleurs contenus + Collaborations
- Page 3 : Services + Contact
- Design : couleurs du site (terracotta, vert sage, cream)
- Inclut la date de génération ("Données à jour au 26 février 2026")

## Synchronisation des stats

### Cron job automatique

Route API `/api/media-kit/sync` appelée par un cron Vercel (tous les jours à 6h) :

1. Fetch les stats Instagram Graph API (followers, engagement, reach)
2. Fetch les demographics Instagram (âge, genre, pays, villes)
3. Insert une nouvelle ligne dans `creator_stats` (historique)
4. Insert/update `audience_demographics`

### Variables d'environnement

```env
INSTAGRAM_ACCESS_TOKEN=xxx
INSTAGRAM_USER_ID=xxx
CRON_SECRET=xxx # sécuriser le cron
```

### `vercel.json`

```json
{
  "crons": [
    { "path": "/api/media-kit/sync", "schedule": "0 6 * * *" }
  ]
}
```

## Animations

- **Compteurs** : AnimatedNumber (réutilise le composant de Stats.tsx) au scroll
- **Barres demographics** : animation width de 0% → valeur avec spring
- **Cards services** : stagger fade-in + slide-up
- **Logos collabs** : même animation que Trusted
- **CTA PDF** : hover avec scale + shadow elevation

## Performance

- **Server Component** : la page est pré-rendue côté serveur (ISR revalidate 1h)
- **PDF** : généré côté serveur via API route (pas de @react-pdf dans le bundle client)
- **Charts** : pas de librairie de charts lourde — barres CSS pures avec animations
- **Images** : optimisées via Next.js Image depuis R2

## Étapes d'implémentation

1. **Tables Supabase** : `creator_stats`, `audience_demographics`, `media_kit_leads`
2. **Schema Drizzle** : définir les tables + migrations
3. **Sync API** : route `/api/media-kit/sync` + intégration Instagram Graph API
4. **Page Media Kit** : layout avec toutes les sections
5. **StatsOverview** : compteurs animés avec données live
6. **AudienceSection** : barres et donuts CSS
7. **Autres sections** : CollabHistory, ServicesGrid, ContentShowcase
8. **PDF** : template React-PDF + route de génération
9. **Download flow** : modal email + téléchargement
10. **Cron Vercel** : configuration du job quotidien
11. **Admin** : gestion des services/tarifs dans le dashboard (dépend PR dashboard)

## Risques et points d'attention

- **Instagram Graph API** : le token Long-Lived expire tous les 60 jours → système de renouvellement nécessaire
- **Demographics** : nécessite un compte Instagram Business/Creator (Fitia l'a probablement déjà)
- **PDF lourd** : @react-pdf peut être lent si trop d'images → limiter à 2-3 pages
- **RGPD** : si capture d'email, mention légale + possibilité de suppression
- **TikTok stats** : l'API est limitée, certaines stats devront être saisies manuellement dans l'admin

## Critères de succès

- [ ] La page /media-kit affiche les stats à jour
- [ ] Les compteurs s'animent au scroll
- [ ] Les demographics sont visuellement clairs (barres + donut)
- [ ] Le PDF se génère et se télécharge correctement
- [ ] Le PDF est brandé aux couleurs du site
- [ ] Le cron de sync fonctionne quotidiennement
- [ ] Le formulaire de lead capture stocke les emails
- [ ] La page est indexable par Google (SEO)
- [ ] Lighthouse Performance > 90
