import { NextResponse } from "next/server";
import { fetchBonsPlans } from "../../lib/amadeus";
import { FALLBACK_DEALS } from "../../lib/bons-plans";

export const revalidate = 21600; // 6h

export async function GET() {
  try {
    const deals = await fetchBonsPlans("CDG");

    return NextResponse.json(deals, {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(FALLBACK_DEALS);
  }
}
