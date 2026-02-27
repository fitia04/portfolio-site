import type { BonPlan } from "./bons-plans";
import {
  IATA_TO_CITY,
  FALLBACK_DEALS,
  generateTitle,
  generateDescription,
  getDestinationImage,
  countryFlag,
} from "./bons-plans";

// ── Amadeus API response types ──────────────────────────────────────────────

interface FlightInspirationResult {
  data: Array<{
    type: string;
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    price: {
      total: string;
    };
  }>;
}

interface FlightOffersResult {
  data: Array<{
    type: string;
    id: string;
    source: string;
    price: {
      currency: string;
      total: string;
      grandTotal: string;
    };
    itineraries: Array<{
      duration: string;
      segments: Array<{
        departure: {
          iataCode: string;
          at: string;
        };
        arrival: {
          iataCode: string;
          at: string;
        };
        carrierCode: string;
        number: string;
      }>;
    }>;
  }>;
}

interface HotelListResult {
  data: Array<{
    chainCode: string;
    iataCode: string;
    dupeId: number;
    name: string;
    hotelId: string;
    geoCode: {
      latitude: number;
      longitude: number;
    };
  }>;
}

interface HotelSearchResult {
  data: Array<{
    type: string;
    hotel: {
      hotelId: string;
      name: string;
      cityCode: string;
      rating?: string;
    };
    available: boolean;
    offers: Array<{
      id: string;
      checkInDate: string;
      checkOutDate: string;
      room: {
        type: string;
        description?: { text: string };
      };
      price: {
        currency: string;
        total: string;
      };
    }>;
  }>;
}

// ── IATA → Country mapping ──────────────────────────────────────────────────

const IATA_TO_COUNTRY: Record<string, { name: string; code: string }> = {
  RAK: { name: "Maroc", code: "MA" },
  CMN: { name: "Maroc", code: "MA" },
  LIS: { name: "Portugal", code: "PT" },
  OPO: { name: "Portugal", code: "PT" },
  SVQ: { name: "Espagne", code: "ES" },
  BCN: { name: "Espagne", code: "ES" },
  MAD: { name: "Espagne", code: "ES" },
  NAP: { name: "Italie", code: "IT" },
  FCO: { name: "Italie", code: "IT" },
  MXP: { name: "Italie", code: "IT" },
  IST: { name: "Turquie", code: "TR" },
  ATH: { name: "Grèce", code: "GR" },
  PRG: { name: "Tchéquie", code: "CZ" },
  BUD: { name: "Hongrie", code: "HU" },
  AMS: { name: "Pays-Bas", code: "NL" },
  DUB: { name: "Irlande", code: "IE" },
  BER: { name: "Allemagne", code: "DE" },
  CPH: { name: "Danemark", code: "DK" },
  VIE: { name: "Autriche", code: "AT" },
  KRK: { name: "Pologne", code: "PL" },
  TUN: { name: "Tunisie", code: "TN" },
  DBV: { name: "Croatie", code: "HR" },
};

// ── OAuth2 token cache ──────────────────────────────────────────────────────

const AMADEUS_BASE =
  process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET env vars",
    );
  }

  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Amadeus auth failed [${res.status}]: ${body}`);
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = json.access_token;
  // Cache with 60s safety buffer
  tokenExpiresAt = now + (json.expires_in - 60) * 1000;

  return cachedToken;
}

// ── Generic GET helper ──────────────────────────────────────────────────────

async function amadeusGet<T>(path: string): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${AMADEUS_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Amadeus GET ${path} failed [${res.status}]: ${body}`);
  }

  return (await res.json()) as T;
}

// ── Flight Inspiration Search ───────────────────────────────────────────────

async function searchFlightInspirations(origin: string) {
  const path =
    `/v1/shopping/flight-destinations` +
    `?origin=${origin}` +
    `&oneWay=false` +
    `&nonStop=false` +
    `&maxPrice=500` +
    `&viewBy=DESTINATION`;

  return amadeusGet<FlightInspirationResult>(path);
}

// ── Flight Offers Search ────────────────────────────────────────────────────

async function searchFlightOffers(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
) {
  const path =
    `/v2/shopping/flight-offers` +
    `?originLocationCode=${origin}` +
    `&destinationLocationCode=${destination}` +
    `&departureDate=${departureDate}` +
    `&returnDate=${returnDate}` +
    `&adults=1` +
    `&nonStop=false` +
    `&currencyCode=EUR` +
    `&max=1`;

  return amadeusGet<FlightOffersResult>(path);
}

// ── Hotel Search (two-step) ─────────────────────────────────────────────────

async function searchHotels(
  cityCode: string,
  checkInDate: string,
  checkOutDate: string,
) {
  // Step A: get hotel IDs for the city
  const listPath =
    `/v1/reference-data/locations/hotels/by-city` +
    `?cityCode=${cityCode}` +
    `&radius=10` +
    `&radiusUnit=KM` +
    `&ratings=3,4` +
    `&hotelSource=ALL`;

  const listResult = await amadeusGet<HotelListResult>(listPath);

  if (!listResult.data || listResult.data.length === 0) {
    return null;
  }

  // Take up to 20 hotel IDs (API limit)
  const hotelIds = listResult.data
    .slice(0, 20)
    .map((h) => h.hotelId)
    .join(",");

  // Step B: get offers for those hotels
  const offersPath =
    `/v3/shopping/hotel-offers` +
    `?hotelIds=${hotelIds}` +
    `&checkInDate=${checkInDate}` +
    `&checkOutDate=${checkOutDate}` +
    `&adults=1` +
    `&currency=EUR` +
    `&bestRateOnly=true`;

  const offersResult = await amadeusGet<HotelSearchResult>(offersPath);

  if (!offersResult.data || offersResult.data.length === 0) {
    return null;
  }

  // Find cheapest offer
  let cheapest: {
    pricePerNight: number;
    stars: number;
  } | null = null;

  for (const hotel of offersResult.data) {
    if (!hotel.available || !hotel.offers || hotel.offers.length === 0) continue;

    const offer = hotel.offers[0];
    const totalPrice = parseFloat(offer.price.total);
    const nights = calculateNights(offer.checkInDate, offer.checkOutDate);
    const pricePerNight = nights > 0 ? totalPrice / nights : totalPrice;
    const stars = hotel.hotel.rating ? parseInt(hotel.hotel.rating, 10) : 3;

    if (!cheapest || pricePerNight < cheapest.pricePerNight) {
      cheapest = { pricePerNight, stars };
    }
  }

  return cheapest;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function calculateNights(departure: string, returnDate: string): number {
  const d1 = new Date(departure);
  const d2 = new Date(returnDate);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

function buildSkyscannerLink(
  origin: string,
  destination: string,
): string {
  return `https://www.skyscanner.fr/transport/vols/${origin.toLowerCase()}/${destination.toLowerCase()}/`;
}

// ── Popular destinations fallback ────────────────────────────────────────────
// Used when Flight Inspiration Search returns no data (e.g. Amadeus test env)

const POPULAR_DESTINATIONS = [
  "RAK", "LIS", "SVQ", "BCN", "NAP", "IST", "FCO", "OPO", "ATH",
];

function getNextWeekendDates(): { departure: string; returnDate: string } {
  const now = new Date();
  const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
  const friday = new Date(now);
  friday.setDate(now.getDate() + daysUntilFriday + 14); // 2 weeks ahead
  const monday = new Date(friday);
  monday.setDate(friday.getDate() + 3);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { departure: fmt(friday), returnDate: fmt(monday) };
}

// ── Build a BonPlan from flight + hotel data ────────────────────────────────

async function buildBonPlan(
  origin: string,
  iata: string,
  departureDate: string,
  returnDate: string,
  inspirationPrice?: number,
): Promise<BonPlan | null> {
  const originCity = IATA_TO_CITY[origin] ?? "Paris";
  const cityName = IATA_TO_CITY[iata] ?? iata;
  const country = IATA_TO_COUNTRY[iata];
  const countryName = country?.name ?? "Europe";
  const countryCode = country?.code ?? "EU";
  const nights = calculateNights(departureDate, returnDate);

  // Get flight price
  let flightPrice = inspirationPrice ?? 0;
  try {
    const flightOffers = await searchFlightOffers(
      origin,
      iata,
      departureDate,
      returnDate,
    );
    if (flightOffers.data && flightOffers.data.length > 0) {
      flightPrice = parseFloat(flightOffers.data[0].price.grandTotal);
    }
  } catch {
    if (!flightPrice) return null; // no price available at all
  }

  // Try hotel (best effort)
  let hotelPricePerNight = 0;
  let hotelStars = 3;
  let hasHotel = false;

  try {
    const hotel = await searchHotels(iata, departureDate, returnDate);
    if (hotel) {
      hotelPricePerNight = hotel.pricePerNight;
      hotelStars = hotel.stars;
      hasHotel = true;
    }
  } catch {
    // flight only
  }

  const totalPrice = Math.round(flightPrice + hotelPricePerNight * nights);
  const originalPrice = Math.round((totalPrice * 1.5) / 10) * 10;

  return {
    destination: cityName,
    country: countryName,
    countryCode,
    title: generateTitle(cityName),
    description: generateDescription(cityName, originCity, nights, hotelStars),
    price: totalPrice,
    originalPrice,
    category: hasHotel ? "Vol + Hôtel" : "Vol seul",
    href: buildSkyscannerLink(origin, iata),
    image: getDestinationImage(cityName),
    departureCity: originCity,
    nights,
    hotelStars,
  };
}

// ── Main orchestrator ───────────────────────────────────────────────────────

export async function fetchBonsPlans(
  origin: string = "CDG",
): Promise<BonPlan[]> {
  try {
    // 1. Try Flight Inspiration Search first
    let inspirationData: FlightInspirationResult["data"] = [];
    try {
      const inspirations = await searchFlightInspirations(origin);
      inspirationData = inspirations.data ?? [];
    } catch {
      // Inspiration search not available (common in test env)
    }

    const plans: BonPlan[] = [];

    if (inspirationData.length > 0) {
      // Path A: use inspiration data (production env)
      const destinations = inspirationData.slice(0, 9);
      const results = await Promise.all(
        destinations.map((dest) =>
          buildBonPlan(
            origin,
            dest.destination,
            dest.departureDate,
            dest.returnDate,
            parseFloat(dest.price.total),
          ),
        ),
      );
      plans.push(...results.filter((p): p is BonPlan => p !== null));
    } else {
      // Path B: fallback to popular destinations with direct flight search
      const { departure, returnDate } = getNextWeekendDates();
      const results = await Promise.all(
        POPULAR_DESTINATIONS.map((iata) =>
          buildBonPlan(origin, iata, departure, returnDate),
        ),
      );
      plans.push(...results.filter((p): p is BonPlan => p !== null));
    }

    if (plans.length === 0) {
      return FALLBACK_DEALS;
    }

    plans.sort((a, b) => a.price - b.price);
    return plans;
  } catch (error) {
    console.error("fetchBonsPlans error, returning fallback deals:", error);
    return FALLBACK_DEALS;
  }
}
