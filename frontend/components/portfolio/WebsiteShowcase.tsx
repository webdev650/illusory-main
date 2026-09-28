"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ExternalLink, Play, Sparkles, LayoutGrid, MonitorPlay } from "lucide-react";
import { CategoryDropdown, CategoryItem } from "./CategoryDropdown";
import { VideoPanel } from "./VideoPanel";
import categoriesData from "@/data/portfolio-categories.json";

export const WebsiteShowcase: React.FC = () => {
  const categories = categoriesData as CategoryItem[];
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem>(categories[0]);
  const [viewMode, setViewMode] = useState<"featured" | "grid">("featured");
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
      {/* Background Decorative Lighting Ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="px-6 lg:px-20 mb-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-pink-500 font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
            02 / Industry Video Showcase
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-jakartaSans mt-2 tracking-tight">
            Crafted for <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 bg-clip-text text-transparent">13 Industries</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* View Mode Switcher Buttons */}
          <div className="inline-flex items-center bg-white/5 border border-white/15 p-1 rounded-full text-xs font-mono">
            <button
              onClick={() => setViewMode("featured")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                viewMode === "featured"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MonitorPlay className="w-4 h-4" />
              <span>Cinema Stage</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All 13 Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar (Featured View) */}
      {viewMode === "featured" && (
        <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />
      )}

      {/* FEATURED CINEMA STAGE VIEW */}
      {viewMode === "featured" && (
        <div className="px-6 lg:px-20 mt-8" style={{ perspective: "1000px" }}>
          <div ref={panelWrapperRef} className="transform-gpu">
            <VideoPanel category={selectedCategory} />
          </div>
        </div>
      )}

      {/* ALL 13 INDUSTRY GRID VIEW */}
      {viewMode === "grid" && (
        <div className="px-6 lg:px-20 mt-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => {
              const badgeGradient = cat.badgeColor || "from-pink-500 to-purple-600";
              const glowStyle = cat.glowColor || "rgba(236, 72, 153, 0.25)";
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setViewMode("featured");
                  }}
                  className="group relative rounded-3xl overflow-hidden bg-neutral-900/80 border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-xl"
                  style={{
                    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Video Container Aspect 16:9 */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <video
                      src={cat.videoUrl}
                      poster={cat.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Category Number Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold text-white bg-gradient-to-r ${badgeGradient} shadow-md`}>
                        {String(idx + 1).padStart(2, "0")}. {cat.label}
                      </span>
                    </div>

                    {/* Hover Play Prompt */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                      <div className="w-14 h-14 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl shadow-pink-500/50 scale-95 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono text-gray-400 tracking-wider">
                        {cat.tag || "3D Motion Reel"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-jakartaSans text-white group-hover:text-pink-400 transition-colors">
                      {cat.clientName}
                    </h3>

                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-semibold text-pink-400 group-hover:text-white transition-colors">
                      <span>Launch Showcase</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
