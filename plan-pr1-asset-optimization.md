# PR1 — Asset Optimization & Cloudflare R2

## Objectif

Sortir tous les médias (vidéos + images) du repo git, les héberger sur Cloudflare R2, et nettoyer l'historique git. Le repo passe de **504 MB → ~5 MB**.

---

## Étapes

### 1. Compresser les vidéos

Les 5 vidéos sont en `.mov` (codec Apple ProRes probable), ~245 MB total. On les convertit en **MP4 (H.264)** avec ffmpeg sans perte de qualité perceptible :

```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -c:a aac -movflags +faststart output.mp4
```

- `-crf 23` : qualité quasi identique, taille divisée par ~5-10x
- `-movflags +faststart` : streaming progressif (important pour le web)
- Objectif : passer de ~245 MB → ~30-50 MB total

Aussi générer des versions **WebM (VP9)** comme fallback moderne :

```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### 2. Optimiser les images

- Convertir les JPEG/PNG en **WebP** (meilleure compression)
- Les logos SVG vides (`nala-studio.svg`, `yassa-bar.svg`) → soit les remplir soit les supprimer
- Objectif : réduire de ~1 MB → ~300 KB

### 3. Setup Cloudflare R2

#### Côté Cloudflare

- Créer un bucket R2 (ex: `fitia-portfolio-assets`)
- Configurer un **custom domain** ou utiliser le domaine public R2 (ex: `assets.fitiatravel.com`)
- Activer l'accès public sur le bucket
- Politique CORS pour autoriser le domaine du site

#### Upload des assets

- Upload les vidéos compressées + images optimisées dans le bucket
- Structure dans R2 :
  ```
  /videos/
    papilles-cocktails.mp4
    herea-boutique.mp4
    dubu-photobooth.mp4
    dart-gil-cafe.mp4
    la-friche-gourmande.mp4
  /images/
    hero.webp
    about.webp
    /logos/
      herea-boutique.webp
      la-friche-gourmande.webp
      ...
  ```

### 4. Mettre à jour le code

#### Ajouter une config pour les URLs des assets

Créer un fichier de config centralisé (ex: `lib/assets.ts`) :

```typescript
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '';

export function assetUrl(path: string): string {
  return `${ASSETS_BASE_URL}/${path}`;
}
```

Variable d'env dans `.env` :
```
NEXT_PUBLIC_ASSETS_URL=https://assets.fitiatravel.com
```

#### Mettre à jour les composants

- `Hero.tsx` : remplacer les chemins `/images/...` par `assetUrl('images/...')`
- `About.tsx` : idem
- `Collaborations.tsx` : remplacer les chemins `/videos/...` par `assetUrl('videos/...')`
- `Trusted.tsx` : logos → `assetUrl('images/logos/...')`
- Utiliser `<source>` avec MP4 + WebM pour les vidéos

#### Mettre à jour next.config.ts

Ajouter le domaine R2 dans la config images si on utilise `next/image` :

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.fitiatravel.com',
      },
    ],
  },
};
```

### 5. Supprimer les médias du repo

- Supprimer `public/videos/` et les images migrées de `public/images/`
- Garder les SVG utilitaires (`favicon.ico`, etc.)
- Mettre à jour `.gitignore` :
  ```
  # Media assets (hosted on R2)
  public/videos/
  ```

### 6. Nettoyer l'historique git

> ⚠️ Cette étape réécrit tout l'historique (les hashes de commit changent). C'est une opération destructive et irréversible.

#### Avant : coordination avec les collaborateurs

1. Prévenir ta pote : "je nettoie l'historique git ce soir, push tout ce que t'as avant [heure]"
2. S'assurer que toutes les branches / PR en cours sont mergées ou pushées
3. Vérifier qu'il n'y a pas de worktrees actifs ailleurs

#### Exécution

```bash
# Installer git-filter-repo
pip install git-filter-repo

# Supprimer les vidéos + images migrées de tout l'historique
git filter-repo --path public/videos/ --invert-paths

# Compresser la base git
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

#### Après : re-sync des collaborateurs

1. Ta pote doit **supprimer sa copie locale et re-cloner** le repo (c'est le plus safe)
2. Message type : "c'est bon, re-clone le repo depuis GitHub, l'ancien dossier tu peux le supprimer"
3. Vérifier que le repo remote fait bien ~5 MB

Résultat attendu : `.git` passe de **256 MB → ~5 MB**.

---

## Checklist

- [ ] Installer ffmpeg si pas disponible
- [ ] Compresser les 5 vidéos en MP4 (H.264)
- [ ] Générer les versions WebM (optionnel)
- [ ] Optimiser les images en WebP
- [ ] Créer le bucket R2 sur Cloudflare
- [ ] Configurer le domaine custom + CORS
- [ ] Upload les assets compressés sur R2
- [ ] Créer `lib/assets.ts` avec helper `assetUrl()`
- [ ] Ajouter `NEXT_PUBLIC_ASSETS_URL` dans `.env`
- [ ] Mettre à jour Hero, About, Collaborations, Trusted
- [ ] Mettre à jour `next.config.ts` (remotePatterns)
- [ ] Supprimer les médias de `public/`
- [ ] Mettre à jour `.gitignore`
- [ ] Tester le build (`npm run build`)
- [ ] Tester en local que les vidéos/images chargent depuis R2
- [ ] Prévenir ta pote avant le nettoyage historique
- [ ] Nettoyer l'historique git (filter-repo)
- [ ] Force push
- [ ] Confirmer à ta pote qu'elle peut re-cloner

---

## Risques

- **Force push** : réécrit l'historique → ta pote devra re-cloner après (un message avant + un message après, c'est tout)
- **CORS** : si mal configuré, les vidéos ne chargeront pas cross-origin
- **Fallback** : garder un fallback local en dev (variable d'env vide → chemins relatifs)
