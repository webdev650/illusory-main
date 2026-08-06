"use client";

import React, { useState } from "react";
import Image from "next/image";
import MagicRings from "./MagicRings";
import { allPartnerLogos } from "./partnerLogosData";
import { MenuItem } from "./InfiniteMenu";

const colorPalettes = [
  { color: "#A855F7", colorTwo: "#6366F1" }, // Purple to Indigo
  { color: "#EC4899", colorTwo: "#8B5CF6" }, // Pink to Violet
  { color: "#06B6D4", colorTwo: "#3B82F6" }, // Cyan to Blue
  { color: "#10B981", colorTwo: "#06B6D4" }, // Emerald to Cyan
  { color: "#F59E0B", colorTwo: "#EF4444" }, // Amber to Red
];

export const MagicRingsLogosGrid: React.FC = () => {
  const [selectedLogo, setSelectedLogo] = useState<MenuItem | null>(allPartnerLogos[0]);
  const [burstCounts, setBurstCounts] = useState<Record<number, number>>({});

  const handleLogoClick = (logo: MenuItem, index: number) => {
    setSelectedLogo(logo);
    setBurstCounts(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 py-4">
      {/* Featured Clicked Logo Display */}
      {selectedLogo && (
        <div
          style={{ backgroundColor: '#0a0a0e', borderColor: 'rgba(99, 102, 241, 0.5)' }}
          className="w-full max-w-2xl border rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-indigo-500/25 backdrop-blur-xl animate-in fade-in zoom-in duration-300"
        >
          <div className="absolute inset-0 opacity-70 pointer-events-none">
            <MagicRings
              color="#A855F7"
              colorTwo="#6366F1"
              ringCount={7}
              speed={1.5}
              lineThickness={2.5}
              clickBurst={true}
              triggerBurstCount={1}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div
              style={{ backgroundColor: '#000000', borderColor: '#27272a' }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border p-4 flex items-center justify-center shrink-0 shadow-inner"
            >
              <Image
                src={selectedLogo.image as any}
                alt={selectedLogo.title}
                className="w-full h-full object-contain filter drop-shadow brightness-120 pointer-events-none"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {selectedLogo.title}
                </h3>
              </div>
              <p className="text-zinc-400 text-sm mb-3 font-medium">
                {selectedLogo.description || "Trusted Partner Brand"}
              </p>

              {selectedLogo.link && selectedLogo.link !== "#" && (
                <a
                  href={selectedLogo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
                >
                  Visit Partner Website &rarr;
                </a>
              )}
            </div>

            <button
              onClick={() => setSelectedLogo(null)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-base p-1 transition-colors"
              title="Close feature preview"
            >
              &#x2715;
            </button>
          </div>
        </div>
      )}

      {/* Grid of Logos each with Magic Rings Animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 w-full">
        {allPartnerLogos.map((logo, index) => {
          const palette = colorPalettes[index % colorPalettes.length];
          const burstCount = burstCounts[index] || 0;
          const isSelected = selectedLogo?.title === logo.title;

          return (
            <div
              key={index}
              onClick={() => handleLogoClick(logo, index)}
              style={{
                backgroundColor: '#0a0a0e',
                borderColor: isSelected ? '#6366f1' : 'rgba(39, 39, 42, 0.8)'
              }}
              className={`group relative h-36 sm:h-40 rounded-xl border p-4 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:shadow-indigo-500/20 ${
                isSelected
                  ? "shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/50"
                  : "hover:border-indigo-500/60"
              }`}
            >
              {/* Magic Rings WebGL Canvas for this Logo */}
              <MagicRings
                color={palette.color}
                colorTwo={palette.colorTwo}
                ringCount={5}
                speed={1}
                attenuation={9}
                lineThickness={2}
                baseRadius={0.3}
                radiusStep={0.08}
                scaleRate={0.09}
                opacity={0.9}
                followMouse={true}
                mouseInfluence={0.25}
                hoverScale={1.3}
                clickBurst={true}
                triggerBurstCount={burstCount}
              />

              {/* Logo Image Overlay */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-3 pointer-events-none">
                <Image
                  src={logo.image as any}
                  alt={logo.title}
                  className="w-full h-full object-contain filter drop-shadow brightness-120 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
                />
              </div>

              {/* Title Overlay on Hover */}
              <div className="absolute bottom-1 text-[10px] font-semibold text-zinc-300 group-hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none text-center px-1 truncate w-full bg-black/80 backdrop-blur-sm py-0.5 rounded-b-lg">
                {logo.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicRingsLogosGrid;
