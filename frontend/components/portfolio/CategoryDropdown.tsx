"use client";
import React, { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface CategoryItem {
  id: string;
  label: string;
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
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
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
    <div className="sticky top-0 z-30 w-full py-4 bg-black/80 backdrop-blur-xl border-y border-white/10 my-8">
      <div className="px-6 lg:px-20 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Category Count Info */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#DEE1E7] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#FF1284] animate-pulse" />
          <span>{categories.length} INDUSTRIES</span>
        </div>

        {/* Mobile Dropdown Select */}
        <div className="relative md:hidden w-full">
          <select
            value={selectedCategory.id}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value);
              if (cat) onSelectCategory(cat);
            }}
            className="w-full appearance-none bg-white/5 border border-white/20 text-white font-jakartaSans py-3 px-4 rounded-xl pr-10 focus:outline-none focus:border-[#FF1284] transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                {cat.label} — {cat.clientName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Desktop / Tablet Scrollable Pills Bar */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hidden py-1 w-full max-w-full">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategory.id;
            return (
              <button
                key={cat.id}
                ref={isSelected ? activePillRef : null}
                onClick={() => onSelectCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#FF1284] to-[#2407ff] text-white shadow-lg shadow-[#FF1284]/25 scale-105"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
