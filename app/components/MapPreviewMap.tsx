"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import MapPin from "./map/MapPin";
import { spots } from "../data/spots";

const featuredSpots = spots.filter((s) => s.isFeatured);

export default function MapPreviewMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Map
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      initialViewState={{ longitude: 15, latitude: 30, zoom: 1.8 }}
      interactive={false}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
    >
      {featuredSpots.map((spot, i) => (
        <Marker
          key={spot.id}
          longitude={spot.longitude}
          latitude={spot.latitude}
          anchor="bottom"
        >
          <div
            className="relative"
            onMouseEnter={() => setHoveredId(spot.id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-hidden="true"
          >
            {hoveredId === spot.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                <div className="bg-white text-[#1E2D24] text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1.5">
                  <span>{spot.emoji}</span>
                  <span>{spot.name}</span>
                </div>
                <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 shadow-sm" />
              </div>
            )}
            <MapPin
              spot={spot}
              onClick={() => {}}
              isActive={hoveredId === spot.id}
              delay={i * 0.15}
            />
          </div>
        </Marker>
      ))}
    </Map>
  );
}
