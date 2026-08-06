"use client";

import React from "react";
import Marquee from "./Marquee";
import ClientLogosMarquee from "./ClientLogosMarquee";

const Partners = () => {
  return (
    <>
      <section className="pt-[40px] md:pt-[50px] flex flex-col items-center relative overflow-hidden w-full">
        {/* Header Text - Centered & Boxed */}
        <div className="w-full max-w-7xl px-4 sm:px-6 flex flex-col items-center gap-4">
          <p className="md:w-[480px] leading-[150%] font-[500] text-center text-zinc-300 text-sm sm:text-base">
            Our partners - As a tight-knit team of experts, we create memorable and
            emotional websites, digital experiences and native apps.
          </p>
        </div>

        {/* Full Viewport Width Edge-to-Edge Logo Marquee */}
        <div className="w-full my-6 sm:my-10">
          <ClientLogosMarquee />
        </div>

        {/* Call To Action - Centered & Boxed */}
        <div className="w-full max-w-7xl px-4 sm:px-6 flex flex-col items-center justify-center gap-5 my-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Step into the future of design
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-zinc-400 font-medium">
            Join thousands of designers and teams using Illusory Design Studios to turn ideas into high-performing websites, fast.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {/* Primary White Liquid Glass Button */}
            <button
              type="button"
              className="relative group px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-zinc-950 transition-all duration-300 transform hover:scale-105 select-none"
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(225, 235, 255, 0.88) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 0 30px 4px rgba(255, 255, 255, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start for free
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
            </button>

            {/* Dark Translucent Liquid Glass Button */}
            <button
              type="button"
              className="relative group px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 select-none overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(30, 41, 59, 0.65) 0%, rgba(15, 23, 42, 0.85) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), 0 8px 24px -4px rgba(0, 0, 0, 0.6)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                ✨ Start with AI
              </span>
              {/* Gloss Sheen */}
              <div className="absolute top-0 inset-x-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
              {/* Neon Glow on Hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: "0 0 30px 6px rgba(59, 130, 246, 0.55), inset 0 0 15px 2px rgba(59, 130, 246, 0.3)",
                  border: "1px solid rgba(96, 165, 250, 0.7)",
                }}
              />
            </button>
          </div>
        </div>
      </section>
      <Marquee />
    </>
  );
};

export default Partners;