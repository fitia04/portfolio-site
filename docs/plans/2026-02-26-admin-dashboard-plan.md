# Plan : Dashboard admin privé

> Statut : 📋 Plan | Priorité : Haute | Estimation : ~4-5 jours

## Objectif

Créer un back-office léger et intuitif pour que Fitia puisse gérer tout le contenu de son site elle-même : ajouter des spots sur la map, des bons plans, des stories, des collaborations, et mettre à jour ses stats. Plus besoin d'un développeur pour chaque modification.

## Stack technique

| Outil | Rôle |
|---|---|
| **Supabase Auth** | Authentification (magic link email) |
| **Supabase Storage** ou **R2** | Upload de médias |
| **Drizzle ORM** | Requêtes type-safe vers Supabase (PostgreSQL) |
| **Next.js App Router** | Pages `/admin/*` avec middleware de protection |
| **Tailwind CSS** | UI de l'admin (même design system que le site) |
| **Framer Motion** | Transitions et micro-interactions |

## Architecture

### Routes protégées

Toutes les pages admin sont sous `/admin/*`, protégées par un middleware Next.js.

```
/admin                  → Dashboard overview (stats rapides)
/admin/login            → Page de connexion (magic link)
/admin/spots            → CRUD spots (map interactive)
/admin/bons-plans       → CRUD bons plans
/admin/stories          → CRUD stories + slides
/admin/collaborations   → CRUD collaborations vidéo
/admin/trusted          → Gestion logos partenaires
/admin/stats            → Mise à jour manuelle des stats
/admin/media-kit        → Configuration du media kit (services, tarifs)
/admin/settings         → Paramètres généraux (bio, liens sociaux)
```

### Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Vérifie le token Supabase dans les cookies
  // Redirige vers /admin/login si non authentifié
  // Ne protège que les routes /admin/* (sauf /admin/login)
}
```

### Composants admin réutilisables

| Composant | Description |
|---|---|
| `AdminLayout.tsx` | Layout avec sidebar navigation + header |
| `AdminSidebar.tsx` | Navigation entre les sections |
| `AdminHeader.tsx` | Breadcrumb + bouton logout |
| `DataTable.tsx` | Tableau de données générique (tri, recherche, pagination) |
| `FormField.tsx` | Champ de formulaire stylisé (text, textarea, select, toggle) |
| `ImageUpload.tsx` | Upload d'image avec preview + crop |
| `VideoUpload.tsx` | Upload de vidéo avec preview |
| `MediaPicker.tsx` | Sélecteur de média existant (galerie R2) |
| `ConfirmDialog.tsx` | Modal de confirmation pour les suppressions |
| `Toast.tsx` | Notifications de succès/erreur |
| `StatusBadge.tsx` | Badge actif/inactif/brouillon |

## Authentification

### Supabase Auth avec Magic Link

- **Un seul admin** : l'email de Fitia est le seul autorisé
- **Flow** :
  1. Fitia va sur `/admin/login`
  2. Entre son email
  3. Reçoit un lien magique par email
  4. Clic sur le lien → authentifiée automatiquement
  5. Session persistante (refresh token Supabase)
- **Pas de mot de passe** : plus simple et plus sécurisé

### Sécurité

- Row Level Security (RLS) sur Supabase : seul l'admin peut écrire
- Middleware Next.js : vérifie le JWT à chaque requête admin
- Token en cookie HttpOnly (pas de localStorage)
- Rate limiting sur la page login

### Variable d'environnement

```env
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx # pour les opérations admin
ADMIN_EMAIL=fitia@example.com # email autorisé
```

## Pages admin détaillées

### Dashboard (`/admin`)

- Stats rapides : nombre de spots, bons plans, stories, collabs
- Dernières modifications (timeline)
- Alertes : token Instagram bientôt expiré, stats pas à jour, etc.
- Raccourcis vers les actions fréquentes

### Spots (`/admin/spots`)

- **Liste** : tableau avec nom, catégorie, ville, featured (toggle), date
- **Création/Édition** : formulaire avec
  - Nom, description, description courte
  - Catégorie (food / voyage / food-voyage)
  - Coordonnées (latitude/longitude) avec mini-map de preview
  - Ville, pays
  - Upload image
  - Rating (1-5 étoiles)
  - Emoji
  - Toggle "featured" (affiché sur la home)
  - Lien vers bon plan existant (select)
- **Suppression** : confirmation dialog

### Bons Plans (`/admin/bons-plans`)

- **Liste** : tableau avec destination, catégorie, prix, actif/inactif
- **Création/Édition** : formulaire avec
  - Destination, description
  - Catégorie (vol+hotel / vol seul / hôtel)
  - Prix de base / prix affiché
  - URL d'affiliation
  - Upload image
  - Toggle actif/inactif
  - Dates de validité (début/fin)

### Stories (`/admin/stories`)

- **Liste** : grille de cards avec cover, titre, nombre de slides, actif/inactif
- **Création** : titre + upload cover
- **Édition slides** : drag & drop pour réordonner
  - Ajouter un slide (image ou vidéo)
  - Caption par slide
  - Durée par slide (images)
  - Preview du slide
- **Toggle** actif/inactif

### Collaborations (`/admin/collaborations`)

- **Liste** : grille avec thumbnail, nom, actif/inactif
- **Création/Édition** :
  - Nom de la marque
  - Description
  - Upload vidéo (ou URL R2)
  - Toggle actif/inactif
  - Ordre d'affichage

### Trusted (`/admin/trusted`)

- **Liste** : grille de logos avec nom
- **Ajout** : nom + upload logo
- **Réordonner** : drag & drop
- **Supprimer** un partenaire

### Stats (`/admin/stats`)

- Affichage des stats actuelles (auto-sync Instagram)
- **Override manuel** : pouvoir corriger les stats si l'API est inexacte
- Historique des valeurs (graphe simple)
- Forcer une re-sync

### Media Kit (`/admin/media-kit`)

- **Services** : CRUD des services proposés (nom, description, prix, icône)
- **Toggle gate email** : activer/désactiver la capture d'email
- **Preview PDF** : voir à quoi ressemble le PDF généré

### Settings (`/admin/settings`)

- Bio / tagline
- Liens sociaux (Instagram, TikTok, email)
- Tokens API (Instagram, Amadeus) — champ masqué
- Image de profil

## Upload de médias

### Flow d'upload

1. L'admin sélectionne un fichier
2. Preview côté client (image ou première frame vidéo)
3. Upload vers R2 via API route signée
4. L'URL R2 est stockée dans Supabase
5. Optimisation automatique :
   - Images : resize + WebP via sharp
   - Vidéos : pas de transcoding côté serveur (l'admin doit uploader du MP4/WebM)

### API Route d'upload

```typescript
// app/api/admin/upload/route.ts
// 1. Vérifie l'auth
// 2. Génère un nom unique (uuid + extension)
// 3. Upload vers R2
// 4. Retourne l'URL publique
```

## Design de l'admin

### Principes

- **Même palette** que le site public (terracotta, vert sage, cream) mais version "utilitaire"
- **Sidebar** fixe à gauche (icônes + labels)
- **Zone de contenu** à droite avec breadcrumb
- **Responsive** : sidebar collapse en icônes sur tablette, burger sur mobile
- **Pas de framework UI externe** : Tailwind suffit pour un admin simple

### Navigation sidebar

```
📊 Dashboard
📍 Spots
✈️ Bons Plans
📸 Stories
🎬 Collaborations
🤝 Partenaires
📈 Stats
📄 Media Kit
⚙️ Paramètres
─────────
🚪 Déconnexion
```

## Étapes d'implémentation

1. **Setup Supabase Auth** : configurer magic link, RLS policies
2. **Middleware** : protection des routes `/admin/*`
3. **Login page** : `/admin/login` avec formulaire magic link
4. **AdminLayout** : sidebar + header + zone contenu
5. **Dashboard** : stats rapides + raccourcis
6. **DataTable** : composant générique de tableau
7. **FormField + ImageUpload** : composants de formulaire réutilisables
8. **CRUD Spots** : premier module complet (template pour les autres)
9. **CRUD Bons Plans** : adapter le template
10. **CRUD Stories** : avec drag & drop des slides
11. **CRUD Collaborations** : avec upload vidéo
12. **CRUD Trusted** : avec drag & drop logos
13. **Stats** : affichage + override manuel
14. **Media Kit** : gestion services + toggle gate
15. **Settings** : paramètres généraux
16. **Upload API** : route d'upload vers R2
17. **Tests manuels** : parcourir tous les flows

## Risques et points d'attention

- **Un seul admin** : pas besoin de rôles/permissions complexes — garder simple
- **Pas de WYSIWYG** : pour les descriptions, un textarea suffit (pas de rich text editor)
- **Upload limites** : Vercel a une limite de 4.5 MB par requête → pour les grosses vidéos, upload direct vers R2 avec presigned URL
- **Optimistic UI** : après une action (save, delete), mettre à jour l'UI immédiatement sans attendre la réponse serveur
- **ISR revalidation** : après chaque modification admin, déclencher un revalidate du cache public (via `revalidatePath` ou `revalidateTag`)

## Critères de succès

- [ ] Login magic link fonctionne
- [ ] Seul l'email autorisé peut se connecter
- [ ] Les routes /admin/* sont protégées
- [ ] CRUD complet pour chaque type de contenu
- [ ] Upload d'images fonctionne vers R2
- [ ] Upload de vidéos fonctionne vers R2
- [ ] Le site public reflète les changements admin (ISR revalidation)
- [ ] L'interface est utilisable sur mobile
- [ ] Aucune régression sur les performances du site public
