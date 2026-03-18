"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Download, Mail, X, CheckCircle, Loader2 } from "lucide-react";

interface DownloadCTAProps {
  showModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

export default function DownloadCTA({ showModal, onOpenModal, onCloseModal }: DownloadCTAProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/media-kit/pdf");
      if (!response.ok) throw new Error("Erreur lors de la génération du PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fitia-media-kit.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => {
        onCloseModal();
        setSuccess(false);
        setEmail("");
        setCompany("");
      }, 2000);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CTA Section */}
      <section
        ref={ref}
        className="py-24 md:py-32 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E2D24 0%, #2A4035 40%, #3A6147 70%, #B5976B 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A7C59]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Travaillons ensemble
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">
            Téléchargez mon media kit complet avec toutes mes statistiques, mon audience et mes tarifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOpenModal}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-text)] rounded-full font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Download size={20} />
              Télécharger le Media Kit PDF
            </button>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <Mail size={20} />
              Me contacter
            </a>
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {success ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                  </motion.div>
                  <p className="text-lg font-semibold text-[var(--color-text)]">
                    Téléchargement lancé !
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className="text-2xl font-bold text-[var(--color-text)]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Télécharger le Media Kit
                    </h3>
                    <button
                      onClick={onCloseModal}
                      className="p-2 rounded-full hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <X size={20} className="text-[var(--color-text-light)]" />
                    </button>
                  </div>

                  <p className="text-[var(--color-text-light)] mb-6">
                    Laissez vos coordonnées pour recevoir le media kit complet.
                  </p>

                  <form onSubmit={handleDownload} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Nom de votre entreprise"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Download size={20} />
                      )}
                      {loading ? "Génération en cours..." : "Télécharger le PDF"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
