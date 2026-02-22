import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fitia Travel — Créatrice de Contenu Food & Voyages à Toulouse",
  description:
    "Fitia Travel, créatrice de contenu food & voyages basée à Toulouse. Collaborations avec restaurants, hôtels et marques lifestyle. Contenu photo & vidéo authentique pour Instagram et TikTok.",
  keywords: [
    "créatrice de contenu",
    "food blogger",
    "travel blogger",
    "Toulouse",
    "collaboration restaurant",
    "influenceuse food",
    "voyage gastronomique",
    "partenariat hôtel",
    "contenu Instagram",
    "contenu TikTok",
    "food travel France",
    "Fitia Travel",
  ],
  authors: [{ name: "Fitia Travel" }],
  creator: "Fitia Travel",
  openGraph: {
    title: "Fitia Travel — Créatrice de Contenu Food & Voyages",
    description:
      "Créatrice de contenu food & voyages basée à Toulouse. Découvrez mes collaborations et mes coups de cœur culinaires & voyage.",
    type: "website",
    locale: "fr_FR",
    siteName: "Fitia Travel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitia Travel — Food & Travel Creator",
    description:
      "Créatrice de contenu food & voyages basée à Toulouse. Collaborations restaurants, hôtels, lifestyle.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Fitia Travel",
  jobTitle: "Créatrice de contenu Food & Voyages",
  description:
    "Créatrice de contenu spécialisée en gastronomie et voyages, basée à Toulouse.",
  url: "https://fitiatravel.com",
  email: "fitiatraval@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toulouse",
    addressCountry: "FR",
  },
  sameAs: [
    "https://www.instagram.com/fitiatravel",
    "https://www.tiktok.com/@fitiatravel",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
