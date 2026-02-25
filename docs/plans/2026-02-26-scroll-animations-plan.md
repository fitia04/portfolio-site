# Plan : Animations scroll-driven entre sections

> Statut : 📋 Plan | Priorité : Moyenne | Estimation : ~1-2 jours

## Objectif

Transformer l'expérience de navigation du site avec des animations cinématiques déclenchées par le scroll. L'objectif est un effet "site premium" immédiat — subtil mais perceptible — qui donne une sensation de fluidité et de soin. Zéro JS dans la boucle de scroll pour garder les 60fps.

## Stack technique

| Outil | Rôle |
|---|---|
| **CSS Scroll-Driven Animations** | Animations liées au scroll (API native, GPU-accelerated) |
| **Framer Motion `useScroll`** | Animations plus complexes (parallax, morph) |
| **CSS `view()` timeline** | Trigger basé sur la visibilité d'un élément |
| **`prefers-reduced-motion`** | Respecter les préférences d'accessibilité |

## Principe : CSS natif d'abord, Framer Motion en dernier recours

En 2026, les CSS scroll-driven animations sont supportées par tous les navigateurs majeurs (Chrome, Edge, Firefox, Safari 18+). Elles sont :
- **GPU-accelerated** : pas de layout/paint, uniquement compositing
- **Zero JS** : rien dans le main thread
- **Performantes** : 60fps garantis même sur mobile

Framer Motion ne sera utilisé que pour les cas que CSS ne peut pas couvrir (animations basées sur la vélocité du scroll, morphing de forme, etc.).

## Animations par section

### Hero

| Élément | Animation | Type |
|---|---|---|
| Texte titre | Parallax léger (-10% vs scroll) | CSS scroll-driven |
| Photo de Fitia | Parallax inverse (+5% vs scroll) | CSS scroll-driven |
| Blob décoratif | Scale 1 → 1.3 en quittant le viewport | CSS scroll-driven |
| Stats badges | Fade-out progressif en scrollant | CSS scroll-driven |
| Scroll indicator | Déjà animé (bounce infini) | Existant |

### About

| Élément | Animation | Type |
|---|---|---|
| Photo | Parallax subtil + reveal progressif (clip-path) | CSS scroll-driven |
| Texte bio | Fade-in + slide-right au scroll | CSS `view()` |
| Badges | Stagger scale-in (un par un) | CSS `view()` + `animation-delay` |
| Titre highlight | Le soulignement terracotta s'anime de gauche à droite | CSS `view()` |

### Collaborations (Carousel)

| Élément | Animation | Type |
|---|---|---|
| Titre | Fade-in standard | CSS `view()` |
| iPhone mockups | Scale 0.9 → 1 quand le carousel entre dans le viewport | CSS `view()` |
| Background | Léger gradient shift au scroll | CSS scroll-driven |

### Stats

| Élément | Animation | Type |
|---|---|---|
| Background gradient | Parallax (le gradient bouge plus lentement que le scroll) | CSS scroll-driven |
| Blobs décoratifs | Rotation lente liée au scroll (pas au temps) | CSS scroll-driven |
| Cartes | Stagger slide-up | CSS `view()` |
| Compteurs | Déjà animés avec useInView | Existant (Framer Motion) |

### Trusted

| Élément | Animation | Type |
|---|---|---|
| Titre | Fade-in | CSS `view()` |
| Carousel logos | Déjà animé (scroll infini CSS) | Existant |
| Texte partenariat | Fade-in delay | CSS `view()` |

### Contact

| Élément | Animation | Type |
|---|---|---|
| Section entière | Fade-in slide-up | CSS `view()` |
| Formulaire inputs | Stagger apparition (un par un, top to bottom) | CSS `view()` |
| CTA button | Scale spring quand visible | Framer Motion (spring) |

## Implémentation CSS

### Classes utilitaires

Créer des classes réutilisables dans `globals.css` :

```css
/* Fade in quand l'élément entre dans le viewport */
.scroll-fade-in {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

/* Slide up + fade in */
.scroll-slide-up {
  animation: slide-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

/* Parallax léger (à mettre sur un wrapper) */
.scroll-parallax-slow {
  animation: parallax-slow linear both;
  animation-timeline: scroll();
}

/* Stagger delay utility */
.scroll-delay-1 { animation-delay: 0ms; }
.scroll-delay-2 { animation-delay: 100ms; }
.scroll-delay-3 { animation-delay: 200ms; }
.scroll-delay-4 { animation-delay: 300ms; }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes parallax-slow {
  from { transform: translateY(-5%); }
  to { transform: translateY(5%); }
}
```

### Intégration avec les composants existants

Les composants utilisent déjà Framer Motion avec `useInView` + `once: true`. La migration se fait progressivement :

1. **Remplacer les animations simples** (fade-in, slide-up) par les classes CSS
2. **Garder Framer Motion** pour les animations complexes (spring, stagger dépendant de l'état)
3. **Ajouter le parallax** sur les éléments décoratifs (blobs, images)

## Accessibilité

### `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .scroll-fade-in,
  .scroll-slide-up,
  .scroll-parallax-slow {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

Toutes les animations sont désactivées si l'utilisateur préfère un mouvement réduit. Les éléments s'affichent directement dans leur état final.

## Performance

### Pourquoi CSS scroll-driven > JS scroll listeners

| | CSS Scroll-Driven | JS (Framer Motion useScroll) |
|---|---|---|
| Thread | Compositor (GPU) | Main thread |
| FPS | 60fps garanti | Peut drop si JS occupé |
| Battery | Minimal | Consomme CPU |
| Bundle | 0 KB | Framer Motion déjà inclus |

### Mesures

- Avant/après : comparer le Lighthouse Performance score
- Vérifier dans DevTools → Performance → pas de "Long Tasks" pendant le scroll
- Tester sur un device mobile bas de gamme (throttle CPU 4x)

## Étapes d'implémentation

1. **Classes CSS** : ajouter les keyframes et classes utilitaires dans `globals.css`
2. **Hero** : ajouter parallax sur texte, photo et blob
3. **About** : migrer les animations Framer Motion vers CSS `view()`
4. **Stats** : parallax sur le gradient et les blobs
5. **Contact** : stagger sur les inputs
6. **Autres sections** : appliquer les fade-in/slide-up là où c'est pertinent
7. **Accessibilité** : ajouter la media query `prefers-reduced-motion`
8. **Clean up** : retirer les `useInView` Framer Motion remplacés par CSS
9. **Tests** : vérifier sur Chrome, Firefox, Safari, mobile

## Risques et points d'attention

- **Safari 18** : vérifier le support de `animation-timeline: view()` — si le support n'est pas complet, garder Framer Motion en fallback
- **Subtilité** : les animations doivent être subtiles (5-10% de mouvement max pour le parallax). Trop de mouvement = nausée + amateur
- **Pas d'animation sur le carousel** : le carousel a déjà son propre système d'animation, ne pas interférer
- **Mobile** : le parallax peut sembler weird au touch scroll → réduire l'amplitude sur mobile ou désactiver
- **Conflit Framer Motion** : attention à ne pas avoir une animation CSS ET une animation Framer Motion sur le même élément

## Critères de succès

- [ ] Le parallax Hero fonctionne (texte et image bougent à des vitesses différentes)
- [ ] Les éléments apparaissent au scroll (fade-in, slide-up)
- [ ] Les stagger fonctionnent (badges About, inputs Contact)
- [ ] 60fps constant pendant le scroll (vérifier DevTools)
- [ ] `prefers-reduced-motion` désactive toutes les animations
- [ ] Pas de régression de performance (Lighthouse > 90)
- [ ] Fonctionne sur Chrome, Firefox, Safari
- [ ] Les animations sont subtiles et premium, pas tape-à-l'œil
