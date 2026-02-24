import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, phone, establishment, message } = await req.json();

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "fitiatravel@gmail.com",
      subject: `Nouvelle demande de collaboration — ${establishment}`,
      html: `
        <h2>Nouvelle demande de collaboration</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
        <p><strong>Établissement :</strong> ${establishment}</p>
        <hr />
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
