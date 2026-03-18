import { renderToBuffer } from "@react-pdf/renderer";
import MediaKitPDF from "@/app/components/MediaKitPDF";

export const runtime = "nodejs";

export async function GET() {
  const buffer = await renderToBuffer(<MediaKitPDF />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="fitia-media-kit.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
