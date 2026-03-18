export const creatorInfo = {
  name: "Fitia",
  tagline: "Food & Voyages Creator basée à Toulouse",
  bio: "Créatrice de contenu passionnée par la gastronomie et les voyages. Je partage mes découvertes culinaires et mes aventures avec une communauté engagée depuis plus de 5 ans.",
  photo: "/images/fitia-hero.jpg",
  email: "contact@fitia.fr",
  instagram: "https://www.instagram.com/fitia_travel",
  tiktok: "https://www.tiktok.com/@fitia_travel",
};

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  description: string;
  trend?: string;
}

export const stats: StatItem[] = [
  {
    label: "Abonnés Instagram",
    value: 3400,
    suffix: "",
    icon: "instagram",
    description: "Communauté engagée, taux d'engagement moyen de 6,2%",
    trend: "+8% ce mois",
  },
  {
    label: "Followers TikTok",
    value: 3067,
    suffix: "",
    icon: "users",
    description: "Contenus courts viraux, reach moyen de 250K vues/mois",
    trend: "+15% ce mois",
  },
  {
    label: "Taux d'engagement",
    value: 6.2,
    suffix: "%",
    icon: "heart",
    description: "Bien au-dessus de la moyenne du secteur (1-3%)",
  },
  {
    label: "Collaborations",
    value: 30,
    suffix: "+",
    icon: "handshake",
    description: "Restaurants, hôtels, marques food & lifestyle",
  },
];

export interface AgeRange {
  label: string;
  percentage: number;
}

export interface CountryData {
  country: string;
  flag: string;
  percentage: number;
}

export const audience = {
  ageRanges: [
    { label: "18-24", percentage: 35 },
    { label: "25-34", percentage: 42 },
    { label: "35-44", percentage: 15 },
    { label: "45+", percentage: 8 },
  ] as AgeRange[],
  gender: { female: 72, male: 28 },
  topCountries: [
    { country: "France", flag: "🇫🇷", percentage: 75 },
    { country: "Belgique", flag: "🇧🇪", percentage: 8 },
    { country: "Suisse", flag: "🇨🇭", percentage: 5 },
    { country: "Canada", flag: "🇨🇦", percentage: 4 },
    { country: "Maroc", flag: "🇲🇦", percentage: 3 },
  ] as CountryData[],
  topCities: [
    { city: "Toulouse", percentage: 25 },
    { city: "Paris", percentage: 18 },
    { city: "Lyon", percentage: 8 },
    { city: "Bordeaux", percentage: 6 },
    { city: "Marseille", percentage: 5 },
  ],
};

export interface ServiceItem {
  emoji: string;
  title: string;
  description: string;
}

export const services: ServiceItem[] = [
  {
    emoji: "📸",
    title: "Shooting photo",
    description: "Photos professionnelles de votre établissement, plats, ambiance",
  },
  {
    emoji: "🎬",
    title: "Reels / TikTok",
    description: "Vidéos courtes et engageantes pour Instagram et TikTok",
  },
  {
    emoji: "📣",
    title: "Stories sponsorisées",
    description: "Stories Instagram avec call-to-action et swipe-up",
  },
  {
    emoji: "📝",
    title: "Article / Review",
    description: "Review détaillée avec photos et recommandations",
  },
  {
    emoji: "🎁",
    title: "Unboxing",
    description: "Mise en avant produit avec réaction authentique",
  },
  {
    emoji: "🤝",
    title: "Partenariat long terme",
    description: "Ambassadrice de marque avec contenu récurrent",
  },
];

export const partnerLogos = [
  { name: "La Friche Gourmande", src: "/images/logos/la-friche-gourmande.png" },
  { name: "Herea Boutique", src: "/images/logos/herea-boutique.jpeg" },
  { name: "NALA STUDIO", src: "/images/logos/nala-studio.svg" },
  { name: "La Grande Pizzeria", src: "/images/logos/la-grande-pizzeria.png" },
  { name: "Le Mékong", src: "/images/logos/le-mekong.png" },
  { name: "YASSA BAR", src: "/images/logos/yassa-bar.svg", invert: true },
  { name: "YUJO Ramen", src: "/images/logos/yujo-ramen.svg" },
  { name: "Nachos", src: "/images/logos/nachos.webp" },
];
