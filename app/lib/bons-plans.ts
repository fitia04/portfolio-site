// ── Types ────────────────────────────────────────────────────────────────────

export interface BonPlan {
  destination: string;
  country: string;
  countryCode: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  href: string;
  image: string;
  departureCity: string;
  nights: number;
  hotelStars: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts an ISO 3166-1 alpha-2 country code to its emoji flag
 * using Unicode regional indicator symbols.
 */
export function countryFlag(code: string): string {
  const upper = code.toUpperCase();
  return [...upper]
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join("");
}

// ── Destination images ──────────────────────────────────────────────────────

export const DESTINATION_IMAGES: Record<string, string> = {
  Marrakech:
    "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop",
  Lisbonne:
    "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=400&fit=crop",
  "Séville":
    "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600&h=400&fit=crop",
  Barcelone:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
  Naples:
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop",
  Istanbul:
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop",
  Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop",
  Porto:
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop",
  "Athènes":
    "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=400&fit=crop",
  Prague:
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600&h=400&fit=crop",
  Budapest:
    "https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=600&h=400&fit=crop",
  Amsterdam:
    "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop",
  Dublin:
    "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600&h=400&fit=crop",
  Berlin:
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop",
  Copenhague:
    "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&h=400&fit=crop",
  Vienne:
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&h=400&fit=crop",
  Milan:
    "https://images.unsplash.com/photo-1520440229-6469a149ac59?w=600&h=400&fit=crop",
  Cracovie:
    "https://images.unsplash.com/photo-1558489580-faa74691fdc5?w=600&h=400&fit=crop",
  Tunis:
    "https://images.unsplash.com/photo-1572204097183-e1ab140342ed?w=600&h=400&fit=crop",
  Dubrovnik:
    "https://images.unsplash.com/photo-1555990538-1e8c8402d7ac?w=600&h=400&fit=crop",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";

/**
 * Returns the curated Unsplash image for a destination,
 * falling back to a generic travel photo.
 */
export function getDestinationImage(city: string): string {
  return DESTINATION_IMAGES[city] ?? DEFAULT_IMAGE;
}

// ── Description templates ───────────────────────────────────────────────────

const DESCRIPTION_TEMPLATES = [
  (city: string, nights: number, stars: number) =>
    `Vol depuis ${city}, ${nights} nuits en hôtel ${stars}\u2605 en centre-ville.`,
  (_city: string, nights: number, stars: number) =>
    `Escapade ${nights + 1} jours \u2014 vol A/R et hébergement ${stars}\u2605 au c\u0153ur de la ville.`,
  (city: string, nights: number, stars: number) =>
    `Vol A/R depuis ${city}, ${nights} nuits en hôtel ${stars}\u2605 avec petit-déjeuner.`,
  (city: string, nights: number, stars: number) =>
    `Depuis ${city} \u2014 vol direct et ${nights} nuits dans un ${stars}\u2605 idéalement situé.`,
];

/**
 * Deterministic hash from a string — used to pick templates consistently
 * for the same destination so descriptions stay stable across renders.
 */
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates an elegant French description for a deal,
 * picking a template based on a stable seed derived from the destination name.
 */
export function generateDescription(
  destination: string,
  departureCity: string,
  nights: number,
  stars: number,
): string {
  const index = stableHash(destination) % DESCRIPTION_TEMPLATES.length;
  return DESCRIPTION_TEMPLATES[index](departureCity, nights, stars);
}

// ── Title templates ─────────────────────────────────────────────────────────

const TITLE_TEMPLATES = [
  (dest: string) => `Week-end à ${dest}`,
  (dest: string) => `Escapade à ${dest}`,
  (dest: string) => `Séjour à ${dest}`,
  (dest: string) => `${dest} en liberté`,
];

/**
 * Generates a title for a deal using a stable seed.
 */
export function generateTitle(destination: string): string {
  const index = stableHash(destination) % TITLE_TEMPLATES.length;
  return TITLE_TEMPLATES[index](destination);
}

// ── IATA → French city name mapping ─────────────────────────────────────────

export const IATA_TO_CITY: Record<string, string> = {
  // French origins
  CDG: "Paris",
  ORY: "Paris",
  TLS: "Toulouse",
  LYS: "Lyon",
  MRS: "Marseille",
  NCE: "Nice",
  BOD: "Bordeaux",
  // European destinations
  RAK: "Marrakech",
  LIS: "Lisbonne",
  SVQ: "Séville",
  BCN: "Barcelone",
  NAP: "Naples",
  IST: "Istanbul",
  FCO: "Rome",
  OPO: "Porto",
  ATH: "Athènes",
  PRG: "Prague",
  BUD: "Budapest",
  AMS: "Amsterdam",
  DUB: "Dublin",
  BER: "Berlin",
  CPH: "Copenhague",
  VIE: "Vienne",
  MXP: "Milan",
  KRK: "Cracovie",
  TUN: "Tunis",
  DBV: "Dubrovnik",
};

// ── Fallback deals ──────────────────────────────────────────────────────────

export const FALLBACK_DEALS: BonPlan[] = [
  {
    destination: "Marrakech",
    country: "Maroc",
    countryCode: "MA",
    title: "Escapade à Marrakech",
    description:
      "Vol A/R depuis Paris, 4 nuits en hôtel 4\u2605 avec petit-déjeuner.",
    price: 249,
    originalPrice: 399,
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/pari/raka?adultsv2=1",
    image: DESTINATION_IMAGES["Marrakech"],
    departureCity: "Paris",
    nights: 4,
    hotelStars: 4,
  },
  {
    destination: "Lisbonne",
    country: "Portugal",
    countryCode: "PT",
    title: "Séjour à Lisbonne",
    description:
      "Vol depuis Paris, 3 nuits en hôtel 3\u2605 en centre-ville.",
    price: 189,
    originalPrice: 329,
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/pari/lisb?adultsv2=1",
    image: DESTINATION_IMAGES["Lisbonne"],
    departureCity: "Paris",
    nights: 3,
    hotelStars: 3,
  },
  {
    destination: "Séville",
    country: "Espagne",
    countryCode: "ES",
    title: "Week-end à Séville",
    description:
      "Escapade 3 jours \u2014 vol A/R et hébergement 3\u2605 au c\u0153ur de la ville.",
    price: 175,
    originalPrice: 299,
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/pari/sevq?adultsv2=1",
    image: DESTINATION_IMAGES["Séville"],
    departureCity: "Paris",
    nights: 2,
    hotelStars: 3,
  },
  {
    destination: "Barcelone",
    country: "Espagne",
    countryCode: "ES",
    title: "Barcelone en liberté",
    description:
      "Depuis Paris \u2014 vol direct et 3 nuits dans un 4\u2605 idéalement situé.",
    price: 199,
    originalPrice: 349,
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/pari/bcn?adultsv2=1",
    image: DESTINATION_IMAGES["Barcelone"],
    departureCity: "Paris",
    nights: 3,
    hotelStars: 4,
  },
  {
    destination: "Naples",
    country: "Italie",
    countryCode: "IT",
    title: "Escapade à Naples",
    description:
      "Vol A/R depuis Lyon, 3 nuits en hôtel 3\u2605 avec petit-déjeuner.",
    price: 169,
    originalPrice: 289,
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/lys/nap?adultsv2=1",
    image: DESTINATION_IMAGES["Naples"],
    departureCity: "Lyon",
    nights: 3,
    hotelStars: 3,
  },
  {
    destination: "Istanbul",
    country: "Turquie",
    countryCode: "TR",
    title: "Séjour à Istanbul",
    description:
      "Vol depuis Paris, 4 nuits en hôtel 4\u2605 en centre-ville.",
    price: 279,
    originalPrice: 449,
    category: "Vol + Hôtel",
    href: "https://www.skyscanner.fr/transport/vols/pari/ista?adultsv2=1",
    image: DESTINATION_IMAGES["Istanbul"],
    departureCity: "Paris",
    nights: 4,
    hotelStars: 4,
  },
];
