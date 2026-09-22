"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { CategoryDropdown, CategoryItem } from "./CategoryDropdown";
import { VideoPanel } from "./VideoPanel";
import categoriesData from "@/data/portfolio-categories.json";

export const WebsiteShowcase: React.FC = () => {
  const categories = categoriesData as CategoryItem[];
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem>(
    categories[0]
  );
  const panelWrapperRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (category: CategoryItem) => {
    if (category.id === selectedCategory.id) return;

    if (panelWrapperRef.current) {
      // 3D Depth-fade transition animation
      gsap.to(panelWrapperRef.current, {
        opacity: 0,
        scale: 0.94,
        z: -100,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setSelectedCategory(category);
          gsap.fromTo(
            panelWrapperRef.current,
            { opacity: 0, scale: 0.94, z: -100 },
            { opacity: 1, scale: 1, z: 0, duration: 0.5, ease: "power3.out" }
          );
        },
      });
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white py-20 border-t border-white/10 overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="px-6 lg:px-20 mb-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-pink-500 font-mono text-sm tracking-widest uppercase">
            02 / Websites Designed By Us
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-jakartaSans mt-2">
            Industry Showcase
          </h2>
        </div>
        <p className="text-gray-400 max-w-md text-sm sm:text-base">
          Filter through 20 specialized industries to preview tailored web design & motion reels.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <CategoryDropdown
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3D Animated Video Panel Container */}
      <div className="px-6 lg:px-20 mt-8" style={{ perspective: "1000px" }}>
        <div ref={panelWrapperRef} className="transform-gpu">
          <VideoPanel category={selectedCategory} />
        </div>
      </div>
    </div>
  );
};
