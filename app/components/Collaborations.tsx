"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

// type: "image" | "video" | "embed"
// Pour TikTok embed : type "embed", src = "https://www.tiktok.com/embed/v2/VIDEO_ID"
// Pour Instagram embed : type "embed", src = "https://www.instagram.com/reel/REEL_ID/embed/"
// Pour fichier local : type "video" (.mp4/.mov) ou "image" (.jpeg/.png)
// Pour texte : type "text", src = null, title + description requis
const videos = [
  {
    src: "/videos/copy_977B2972-9D94-4C6F-B6AE-419B8A5167C3.mov",
    type: "video" as const,
    label: "Dart Gil café céramique",
    description: "Un atelier céramique dans un café super cozy à Toulouse — créativité et gourmandise se rencontrent dans le quartier des Carmes.",
  },
  {
    src: "/videos/copy_C9A72DD4-DAA1-44B6-9F7E-1E3D1B90EBD6.mov",
    type: "video" as const,
    label: "Papilles Cocktails",
    description: "Un atelier cocktails en petit groupe à deux pas du Capitole — shake, dégustation et bonne ambiance.",
  },
  {
    src: "/videos/8f918fbbe91f4aa88e0e095fdcc8b5ec.mov",
    type: "video" as const,
    label: "Dubu PhotoBooth",
    description: "Le premier photobooth coréen à Toulouse — trois machines uniques, accessoires et souvenirs à emporter.",
  },
  {
    src: "/videos/copy_E97FFAD9-46C1-40B1-8F34-0CF1EED5A2DC.mov",
    type: "video" as const,
    label: "La Friche Gourmande",
    description: "Raclette et fondue dans de vraies télécabines — une guinguette transformée en station de ski au cœur de Toulouse.",
  },
  {
    src: "/videos/a36c757da4584e3083be9d5e52cef11a.mov",
    type: "video" as const,
    label: "Herea Boutique",
    description: "Une pépite toulousaine pleine de créations locales — bijoux, déco, ateliers créatifs et cadeaux faits main.",
  },
];

function IPhoneMockup({ src, type, label, description }: { src: string | null; type: "image" | "video" | "embed"; label: string; description?: string }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* iPhone frame */}
      <div
        className="relative"
        style={{
          width: 220,
          height: 440,
          borderRadius: 40,
          background: "#1a1a1a",
          boxShadow:
            "0 0 0 2px #3a3a3a, 0 0 0 4px #1a1a1a, 0 25px 60px rgba(0,0,0,0.35)",
          padding: 6,
        }}
      >
        {/* Side buttons left */}
        <div style={{ position: "absolute", left: -3, top: 90, width: 3, height: 32, background: "#3a3a3a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 132, width: 3, height: 56, background: "#3a3a3a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 196, width: 3, height: 56, background: "#3a3a3a", borderRadius: "2px 0 0 2px" }} />
        {/* Side button right */}
        <div style={{ position: "absolute", right: -3, top: 140, width: 3, height: 80, background: "#3a3a3a", borderRadius: "0 2px 2px 0" }} />

        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 34,
            overflow: "hidden",
            background: "#000",
            position: "relative",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 24,
              background: "#000",
              borderRadius: 12,
              zIndex: 10,
              boxShadow: "0 0 0 2px #1a1a1a",
            }}
          />

          {/* Content */}
          {src && type === "image" && (
            <img src={src} alt={label} className="w-full h-full object-cover" />
          )}
          {src && type === "video" && (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted={muted}
                loop
                playsInline
                autoPlay
              />
              <button
                onClick={() => setMuted((m) => !m)}
                className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          )}
          {src && type === "embed" && (
            <iframe
              src={src}
              className="w-full h-full"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          )}
          {!src && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1E2D24] to-[#4A7C59] gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/60 text-xs text-center px-4">Vidéo à venir</p>
            </div>
          )}
        </div>
      </div>

      {/* Label + description below */}
      <div className="text-center max-w-[220px]">
        <p className="text-sm font-semibold text-[#1E2D24] leading-snug" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
        {description && (
          <p className="text-xs text-[#5C6B5C] mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function Collaborations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const max = Math.max(0, videos.length - visible);
  const prev = () => setIndex((i) => (i <= 0 ? max : i - 1));
  const next = () => setIndex((i) => (i >= max ? 0 : i + 1));

  useEffect(() => {
    setIndex((i) => Math.min(i, max));
  }, [max]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [paused, max]);

  return (
    <section
      id="collaborations"
      ref={ref}
      className="py-24 md:py-32 px-6 overflow-hidden"
      style={{ backgroundColor: "#EDE8E0" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-[#4A7C59] text-sm tracking-widest uppercase font-semibold">
              Mon portfolio
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#1E2D24] mt-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Mes collaborations
            </h2>
            <p className="text-[#5C6B5C] mt-3 whitespace-nowrap">
              Des partenariats authentiques, pensés pour valoriser chaque établissement.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-[#1E2D24] flex items-center justify-center text-white hover:bg-[#4A7C59] transition-all duration-200 shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-[#1E2D24] flex items-center justify-center text-white hover:bg-[#4A7C59] transition-all duration-200 shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-hidden pt-4 -mt-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="flex gap-6 md:gap-10 items-start"
            animate={{ x: `calc(-${index * (100 / visible)}% - ${index * (visible === 1 ? 24 : 40) / visible}px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {videos.map((video, i) => (
              <div key={i} className="flex-none" style={{ width: `calc(${100 / visible}% - ${(visible === 1 ? 24 : 40) * (visible - 1) / visible}px)` }}>
                <IPhoneMockup src={video.src} type={video.type} label={video.label} description={"description" in video ? video.description : undefined} />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "bg-[#4A7C59] w-6" : "bg-[#DDD5C0] w-1.5"
              }`}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
