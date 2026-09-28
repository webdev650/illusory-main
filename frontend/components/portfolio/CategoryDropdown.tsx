"use client";
import React, { useRef, useEffect } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

export interface CategoryItem {
  id: string;
  label: string;
  tag?: string;
  badgeColor?: string;
  glowColor?: string;
  videoUrl: string;
  poster: string;
  clientName: string;
  projectUrl: string;
  description: string;
}

interface CategoryDropdownProps {
  categories: CategoryItem[];
  selectedCategory: CategoryItem;
  onSelectCategory: (category: CategoryItem) => void;
  viewMode?: "featured" | "grid";
  onToggleViewMode?: (mode: "featured" | "grid") => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  viewMode = "featured",
  onToggleViewMode,
}) => {
  const activePillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedCategory.id]);

  return (
    <div className="sticky top-0 z-30 w-full py-4 bg-black/85 backdrop-blur-2xl border-y border-white/10 my-6 shadow-2xl">
      <div className="px-6 lg:px-20 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Industry Count Info & View Mode Toggle */}
        <div className="flex items-center justify-between md:justify-start gap-4 shrink-0">
          <div className="flex items-center gap-2.5 text-xs font-mono text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-lg shadow-pink-500/50" />
            <span className="tracking-widest font-semibold uppercase">{categories.length} FEATURED SHOWCASES</span>
          </div>

          {onToggleViewMode && (
            <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-full text-xs font-mono">
              <button
                onClick={() => onToggleViewMode("featured")}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  viewMode === "featured"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Stage View
              </button>
              <button
                onClick={() => onToggleViewMode("grid")}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Grid View
              </button>
            </div>
          )}
        </div>

        {/* Mobile Select Dropdown */}
        <div className="relative md:hidden w-full">
          <select
            value={selectedCategory.id}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value);
              if (cat) onSelectCategory(cat);
            }}
            className="w-full appearance-none bg-white/10 border border-white/20 text-white font-jakartaSans py-3 px-4 rounded-xl pr-10 focus:outline-none focus:border-pink-500 transition-colors"
          >
            {categories.map((cat, idx) => (
              <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                {String(idx + 1).padStart(2, "0")}. {cat.label} — {cat.clientName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 pointer-events-none" />
        </div>

        {/* Desktop / Tablet Scrollable Category Pills */}
        <div className="hidden md:flex items-center gap-2.5 overflow-x-auto scrollbar-hidden py-1 w-full max-w-full">
          {categories.map((cat, idx) => {
            const isSelected = cat.id === selectedCategory.id;
            const badgeColor = cat.badgeColor || "from-pink-500 to-purple-600";
            return (
              <button
                key={cat.id}
                ref={isSelected ? activePillRef : null}
                onClick={() => onSelectCategory(cat)}
                className={`group shrink-0 relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? `bg-gradient-to-r ${badgeColor} text-white shadow-lg shadow-pink-500/25 scale-105 font-bold`
                    : "bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10"
                }`}
              >
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isSelected ? "bg-black/30 text-white" : "bg-white/10 text-gray-400 group-hover:text-white"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
