"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { ArrowLeft, Map as MapIcon, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Spot } from "../types/spot";
import MapPin from "../components/map/MapPin";
import SpotPopup from "../components/map/SpotPopup";
import SpotCard from "../components/map/SpotCard";
import MapFilters from "../components/map/MapFilters";

interface MapPageClientProps {
  spots: Spot[];
}

export default function MapPageClient({ spots }: MapPageClientProps) {
  const mapRef = useRef<MapRef>(null);
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [category, setCategory] = useState<"all" | "food" | "voyage">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false); // mobile toggle, false = show list

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      // Category filter: "food" matches food + food-voyage, "voyage" matches voyage + food-voyage
      const matchesCategory =
        category === "all" ||
        spot.category === category ||
        spot.category === "food-voyage";
      // Search filter: case insensitive on name, city, country
      const matchesSearch =
        !searchQuery ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [spots, category, searchQuery]);

  const flyToSpot = useCallback((spot: Spot) => {
    setActiveSpot(spot);
    mapRef.current?.flyTo({
      center: [spot.longitude, spot.latitude],
      zoom: 6,
      duration: 1500,
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F7F4EF]">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#DDD5C0] bg-[#F7F4EF]">
        <a
          href="/"
          className="flex items-center gap-2 text-[#4A7C59] hover:text-[#3A6147] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Retour
        </a>
        <h1
          className="text-xl font-bold text-[#1E2D24]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Mes découvertes
        </h1>
        {/* Mobile toggle */}
        <div className="flex md:hidden gap-1">
          <button
            onClick={() => setShowMap(false)}
            className={`p-2 rounded-lg transition-colors ${
              !showMap ? "bg-[#4A7C59] text-white" : "text-[#5C6B5C]"
            }`}
            type="button"
            aria-label="Afficher la liste"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`p-2 rounded-lg transition-colors ${
              showMap ? "bg-[#4A7C59] text-white" : "text-[#5C6B5C]"
            }`}
            type="button"
            aria-label="Afficher la carte"
          >
            <MapIcon size={18} />
          </button>
        </div>
        <div className="hidden md:block w-[72px]" /> {/* Spacer for centering */}
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar — visible on desktop always, on mobile only when !showMap */}
        <aside
          className={`${
            showMap ? "hidden" : "flex"
          } md:flex flex-col w-full md:w-[30%] md:min-w-[320px] border-r border-[#DDD5C0] bg-[#F7F4EF]`}
        >
          <div className="p-4 border-b border-[#DDD5C0]">
            <MapFilters
              activeCategory={category}
              onCategoryChange={setCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <p className="text-xs text-[#5C6B5C] mt-2">
              {filteredSpots.length} spot
              {filteredSpots.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onClick={() => flyToSpot(spot)}
                isActive={activeSpot?.id === spot.id}
              />
            ))}
            {filteredSpots.length === 0 && (
              <p className="text-center text-[#5C6B5C] py-8">
                Aucun spot trouvé
              </p>
            )}
          </div>
        </aside>

        {/* Map — visible on desktop always, on mobile only when showMap */}
        <div
          className={`${
            !showMap ? "hidden" : "flex"
          } md:flex flex-1 relative`}
        >
          <Map
            ref={mapRef}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            initialViewState={{ longitude: 15, latitude: 30, zoom: 2 }}
            style={{ width: "100%", height: "100%" }}
          >
            {filteredSpots.map((spot) => (
              <Marker
                key={spot.id}
                longitude={spot.longitude}
                latitude={spot.latitude}
                anchor="center"
              >
                <MapPin
                  spot={spot}
                  onClick={() => flyToSpot(spot)}
                  isActive={activeSpot?.id === spot.id}
                />
              </Marker>
            ))}
            {activeSpot && (
              <Popup
                longitude={activeSpot.longitude}
                latitude={activeSpot.latitude}
                anchor="bottom"
                onClose={() => setActiveSpot(null)}
                closeButton={false}
                closeOnClick={false}
                offset={20}
              >
                <SpotPopup
                  spot={activeSpot}
                  onClose={() => setActiveSpot(null)}
                />
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}
