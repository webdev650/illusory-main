"use client";

import React, { useState } from "react";
import Particles from "./Particles";
import { allPartnerLogos } from "./partnerLogosData";
import { MenuItem } from "./InfiniteMenu";

export const PartnerLogosWithParticles: React.FC = () => {
  const [activeLogo, setActiveLogo] = useState<MenuItem | null>(null);

  const getImgSrc = (img: any): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img.src) return img.src;
    if (img.default && img.default.src) return img.default.src;
    return String(img);
  };

  return (
    <div className="w-full relative min-h-[600px] py-8 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 shadow-2xl">
      {/* Background Particles Animation Field */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}>
        <Particles
          particleColors={["#ffffff", "#a855f7", "#6366f1", "#06b6d4"]}
          particleCount={220}
          particleSpread={12}
          speed={0.12}
          particleBaseSize={110}
          moveParticlesOnHover
          particleHoverFactor={1.2}
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {/* Main Content Container over Particles */}
      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center gap-8">
        
        {/* Active Logo Details Spotlight */}
        {activeLogo && (
          <div
            style={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', borderColor: 'rgba(99, 102, 241, 0.6)' }}
            className="w-full max-w-xl border rounded-2xl p-5 relative overflow-hidden shadow-2xl shadow-indigo-500/20 backdrop-blur-xl animate-in fade-in zoom-in duration-300"
          >
            <div className="flex items-center gap-5">
              <div
                style={{ backgroundColor: '#000000', borderColor: '#27272a' }}
                className="w-20 h-20 rounded-xl border p-3 flex items-center justify-center shrink-0 shadow-inner"
              >
                <img
                  src={getImgSrc(activeLogo.image)}
                  alt={activeLogo.title}
                  className="max-w-full max-h-full object-contain filter drop-shadow brightness-120 pointer-events-none"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {activeLogo.title}
                  </h3>
                </div>
                <p className="text-zinc-400 text-xs mb-2">
                  {activeLogo.description || "Official Partner"}
                </p>

                {activeLogo.link && activeLogo.link !== "#" && (
                  <a
                    href={activeLogo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm"
                  >
                    Explore &rarr;
                  </a>
                )}
              </div>

              <button
                onClick={() => setActiveLogo(null)}
                className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-white text-sm p-1"
                title="Close"
              >
                &#x2715;
              </button>
            </div>
          </div>
        )}

        {/* Grid of All 31 Partner Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 w-full">
          {allPartnerLogos.map((logo, index) => {
            const isSelected = activeLogo?.title === logo.title;

            return (
              <div
                key={index}
                onClick={() => setActiveLogo(logo)}
                style={{
                  backgroundColor: 'rgba(9, 9, 11, 0.88)',
                  borderColor: isSelected ? '#6366f1' : 'rgba(39, 39, 42, 0.8)'
                }}
                className={`group relative h-28 sm:h-32 rounded-xl border p-3 flex flex-col items-center justify-center cursor-pointer backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-indigo-500/80 hover:shadow-xl hover:shadow-indigo-500/20 ${
                  isSelected ? "ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/30" : ""
                }`}
              >
                <div className="w-full h-full flex items-center justify-center p-2 pointer-events-none">
                  <img
                    src={getImgSrc(logo.image)}
                    alt={logo.title}
                    className="max-w-[85%] max-h-[85%] object-contain filter drop-shadow brightness-120 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
                  />
                </div>

                <div className="absolute bottom-1 text-[10px] font-medium text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-center px-1 truncate w-full bg-black/80 backdrop-blur-sm py-0.5 rounded-b-lg">
                  {logo.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerLogosWithParticles;
