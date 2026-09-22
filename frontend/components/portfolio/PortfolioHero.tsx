"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const PortfolioHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Entrance animation
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-text-line",
        { opacity: 0, y: 40, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: "power4.out", stagger: 0.15 }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );

      if (!isReducedMotion && containerRef.current) {
        // Pinned 3D scroll scrub
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            if (headlineRef.current) {
              gsap.set(headlineRef.current, {
                scale: 1 - progress * 0.2,
                opacity: 1 - progress * 1.1,
                transformPerspective: 1000,
                translateZ: -progress * 250,
              });
            }
            if (subtextRef.current) {
              gsap.set(subtextRef.current, {
                opacity: 1 - progress * 1.8,
                y: -progress * 30,
              });
            }
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex flex-col justify-between pt-28 pb-12 px-6 lg:px-20 overflow-hidden bg-black text-white"
      style={{ perspective: "1000px" }}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-600/30 via-indigo-900/20 to-transparent" />

      {/* Main Hero Headline */}
      <div ref={headlineRef} className="my-auto z-10 font-jakartaSans font-bold tracking-tight">
        <h1 className="hero-text-line hero-head text-white">
          Our Portfolio,
        </h1>
        <h1 className="hero-text-line hero-head text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500">
          in motion.
        </h1>
      </div>

      {/* Subtext and Scroll Cue */}
      <div className="z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-white/10 pt-6">
        <div ref={subtextRef} className="max-w-md">
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Explore our curated showcase of digital craft, WebGL experiences, and brand transformation across 20 industries.
          </p>
        </div>

        <div ref={scrollCueRef} className="flex items-center gap-3 text-xs tracking-widest uppercase text-gray-400">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
