import type { BonPlan } from "./bons-plans";
import {
  FALLBACK_DEALS,
  generateTitle,
  generateDescription,
  getDestinationImage,
} from "./bons-plans";

// ── Kiwi Tequila API ────────────────────────────────────────────────────────

const KIWI_BASE = "https://api.tequila.kiwi.com";

// ── Response types ──────────────────────────────────────────────────────────

interface KiwiSearchResult {
  data: Array<{
    id: string;
    flyFrom: string;
    flyTo: string;
    cityFrom: string;
    cityTo: string;
    countryFrom: { code: string; name: string };
    countryTo: { code: string; name: string };
    price: number;
    deep_link: string;
    nightsInDest: number;
    route: Array<{
      flyFrom: string;
      flyTo: string;
      cityFrom: string;
      cityTo: string;
      local_departure: string;
      local_arrival: string;
    }>;
  }>;
}

// ── Noms français des pays ──────────────────────────────────────────────────

const COUNTRY_NAME_FR: Record<string, string> = {
  MA: "Maroc",
  PT: "Portugal",
  ES: "Espagne",
  IT: "Italie",
  TR: "Turquie",
  GR: "Grèce",
  CZ: "Tchéquie",
  HU: "Hongrie",
  NL: "Pays-Bas",
  IE: "Irlande",
  DE: "Allemagne",
  DK: "Danemark",
  AT: "Autriche",
  PL: "Pologne",
  TN: "Tunisie",
  HR: "Croatie",
  GB: "Royaume-Uni",
  BE: "Belgique",
  CH: "Suisse",
  RO: "Roumanie",
  BG: "Bulgarie",
  ME: "Monténégro",
  RS: "Serbie",
  AL: "Albanie",
};

// Noms français des villes (Kiwi renvoie les noms anglais)
const CITY_NAME_FR: Record<string, string> = {
  Marrakesh: "Marrakech",
  Lisbon: "Lisbonne",
  Seville: "Séville",
  Barcelona: "Barcelone",
  Naples: "Naples",
  Istanbul: "Istanbul",
  Rome: "Rome",
  Porto: "Porto",
  Athens: "Athènes",
  Prague: "Prague",
  Budapest: "Budapest",
  Amsterdam: "Amsterdam",
  Dublin: "Dublin",
  Berlin: "Berlin",
  Copenhagen: "Copenhague",
  Vienna: "Vienne",
  Milan: "Milan",
  Krakow: "Cracovie",
  Tunis: "Tunis",
  Dubrovnik: "Dubrovnik",
  London: "Londres",
  Brussels: "Bruxelles",
  Munich: "Munich",
  Venice: "Venise",
  Florence: "Florence",
  Malaga: "Malaga",
  Split: "Split",
  Palermo: "Palerme",
};

// ── Search helper ───────────────────────────────────────────────────────────

function getSearchDates(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  // Search 2-8 weeks ahead for best prices
  const from = new Date(now);
  from.setDate(now.getDate() + 14);
  const to = new Date(now);
  to.setDate(now.getDate() + 56);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  return { dateFrom: fmt(from), dateTo: fmt(to) };
}

async function searchFlights(origin: string): Promise<KiwiSearchResult> {
  const apiKey = process.env.KIWI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KIWI_API_KEY env var");
  }

  const { dateFrom, dateTo } = getSearchDates();

  const params = new URLSearchParams({
    fly_from: origin,
    fly_to: "RAK,LIS,SVQ,BCN,NAP,IST,FCO,OPO,ATH,PRG,BUD,AMS,DUB,BER,CPH,VIE,MXP,KRK",
    date_from: dateFrom,
    date_to: dateTo,
    nights_in_dst_from: "2",
    nights_in_dst_to: "5",
    flight_type: "round",
    one_for_city: "1",
    max_stopovers: "1",
    curr: "EUR",
    locale: "fr",
    sort: "price",
    limit: "9",
  });

  const res = await fetch(`${KIWI_BASE}/v2/search?${params}`, {
    headers: { apikey: apiKey },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Kiwi search failed [${res.status}]: ${body}`);
  }

  return (await res.json()) as KiwiSearchResult;
}

// ── Main orchestrator ───────────────────────────────────────────────────────

export async function fetchBonsPlans(
  origin: string = "CDG",
): Promise<BonPlan[]> {
  try {
    const result = await searchFlights(origin);

    if (!result.data || result.data.length === 0) {
      return FALLBACK_DEALS;
    }

    const originCity = CITY_NAME_FR[result.data[0]?.cityFrom] ?? result.data[0]?.cityFrom ?? "Paris";

    const plans: BonPlan[] = result.data.map((flight) => {
      const cityName = CITY_NAME_FR[flight.cityTo] ?? flight.cityTo;
      const countryCode = flight.countryTo.code;
      const countryName = COUNTRY_NAME_FR[countryCode] ?? flight.countryTo.name;
      const nights = flight.nightsInDest || 3;

      const originalPrice = Math.round((flight.price * 1.5) / 10) * 10;

      return {
        destination: cityName,
        country: countryName,
        countryCode,
        title: generateTitle(cityName),
        description: generateDescription(cityName, originCity, nights, 3),
        price: Math.round(flight.price),
        originalPrice,
        category: "Vol A/R",
        href: flight.deep_link,
        image: getDestinationImage(cityName),
        departureCity: originCity,
        nights,
        hotelStars: 3,
      };
    });

    return plans;
  } catch (error) {
    console.error("fetchBonsPlans error, returning fallback deals:", error);
    return FALLBACK_DEALS;
  }
}
