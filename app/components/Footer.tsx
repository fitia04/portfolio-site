import { Instagram, Mail, ArrowUp } from "lucide-react";

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

const navLinks = [
  { href: "#about", label: "À propos" },
  { href: "#collaborations", label: "Collaborations" },
  { href: "#stats", label: "Chiffres clés" },
  { href: "/bons-plans", label: "Bons Plans" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  { icon: <Instagram size={20} />, href: "https://www.instagram.com/fitia.travel", label: "Instagram" },
  { icon: <TikTokIcon />, href: "https://www.tiktok.com/@fitia.travel", label: "TikTok" },
  { icon: <Mail size={20} />, href: "mailto:fitiatraval@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <>
    <a
      href="#"
      aria-label="Remonter en haut"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#1E2D24] flex items-center justify-center text-white hover:bg-[#4A7C59] transition-all duration-300 hover:-translate-y-1 shadow-lg"
    >
      <ArrowUp size={18} />
    </a>
    <footer
      className="py-16 px-6 border-t border-[#DDD5C0]"
      style={{ backgroundColor: "#EDE8E0" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <p
              className="text-2xl font-bold text-[#1E2D24] mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Fitia Travel
            </p>
            <p className="text-xs tracking-widest text-[#4A7C59] uppercase mb-4">
              Food & Voyages Creator
            </p>
            <p className="text-sm text-[#5C6B5C] leading-relaxed">
              Je partage des adresses coups de coeur avec authenticité et
              passion.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold text-[#1E2D24] uppercase tracking-widest mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#5C6B5C] hover:text-[#4A7C59] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + contact */}
          <div>
            <p className="text-xs font-semibold text-[#1E2D24] uppercase tracking-widest mb-4">
              Me retrouver
            </p>
            <div className="flex gap-3 mb-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-[#DDD5C0] flex items-center justify-center text-[#5C6B5C] hover:text-[#4A7C59] hover:border-[#4A7C59] transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <a
              href="mailto:fitiatravel@gmail.com"
              className="text-sm text-[#4A7C59] font-medium hover:underline"
            >
              fitiatravel@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#DDD5C0] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#5C6B5C]">
            © 2026 Fitia Travel. Tous droits réservés.
          </p>
          <p className="text-xs text-[#5C6B5C] italic">
            Créatrice de contenu food & voyages · Toulouse, France
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
