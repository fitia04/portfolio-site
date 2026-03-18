"use client";

import { Search } from "lucide-react";

interface MapFiltersProps {
  activeCategory: "all" | "food" | "voyage";
  onCategoryChange: (category: "all" | "food" | "voyage") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORIES = [
  { label: "Tout", value: "all" },
  { label: "Food 🍽", value: "food" },
  { label: "Voyages ✈️", value: "voyage" },
] as const satisfies { label: string; value: "all" | "food" | "voyage" }[];

export default function MapFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: MapFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {CATEGORIES.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onCategoryChange(value)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeCategory === value
              ? "bg-[#4A7C59] text-white shadow-md"
              : "bg-[#DDD5C0] text-[#5C6B5C] hover:bg-[#4A7C59]/20"
          }`}
        >
          {label}
        </button>
      ))}

      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-[#DDD5C0] focus-within:border-[#4A7C59] transition-colors w-full sm:w-auto">
        <Search size={16} className="text-[#5C6B5C]" />
        <input
          type="text"
          aria-label="Rechercher un lieu"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un lieu..."
          className="flex-1 bg-transparent outline-none text-sm text-[#1E2D24] placeholder:text-[#5C6B5C]/60"
        />
      </div>
    </div>
  );
}
