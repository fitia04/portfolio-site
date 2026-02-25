"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";

const links = [
  { href: "#about", label: "À propos" },
  { href: "#collaborations", label: "Collaborations" },
  { href: "#stats", label: "Chiffres" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#F7F4EF]/95 backdrop-blur-md shadow-sm border-b border-[#DDD5C0]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-tight">
          <span
            className="text-2xl font-bold text-[#1E2D24]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Fitia Travel
          </span>
          <span className="text-xs tracking-[0.2em] text-[#4A7C59] uppercase font-light">
            Food & Voyages
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[#5C6B5C] hover:text-[#4A7C59] transition-colors duration-300 text-sm tracking-wide font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A7C59] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 bg-[#4A7C59] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3A6147] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <FileText size={14} />
          Devis gratuit
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden text-[#1E2D24]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F7F4EF] border-t border-[#DDD5C0] px-6 pb-6"
          >
            <ul className="flex flex-col gap-4 pt-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-[#1E2D24] hover:text-[#4A7C59] transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="inline-block bg-[#4A7C59] text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                >
                  <FileText size={14} />
          Devis gratuit
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
