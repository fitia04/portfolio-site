import { NextResponse } from "next/server";

// 1. Crée un Google Sheet public avec ces colonnes (ligne 1 = en-têtes) :
//    destination | country | title | description | price | originalPrice | category | href | image
// 2. Partage le sheet en "Tout le monde avec le lien peut voir"
// 3. Remplace GOOGLE_SHEET_ID ci-dessous par l'ID de ton sheet
//    (l'ID est dans l'URL : docs.google.com/spreadsheets/d/ID_ICI/edit)

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? "";

function parseCSV(text: string) {
  const lines = text.trim().split("\n").slice(1); // skip header row
  return lines
    .map((line) => {
      // handle quoted fields containing commas
      const fields: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === "," && !inQuotes) { fields.push(current.trim()); current = ""; continue; }
        current += char;
      }
      fields.push(current.trim());

      const [destination, country, title, description, price, originalPrice, category, href, image] = fields;
      if (!destination || !title) return null;
      return { destination, country, title, description, price, originalPrice, category, href, image };
    })
    .filter(Boolean);
}

export async function GET() {
  if (!SHEET_ID) {
    return NextResponse.json({ error: "GOOGLE_SHEET_ID non configuré" }, { status: 500 });
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h

    if (!res.ok) throw new Error("Impossible de lire le Google Sheet");

    const csv = await res.text();
    const deals = parseCSV(csv);

    return NextResponse.json(deals, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=60" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
