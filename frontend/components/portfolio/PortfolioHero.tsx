"use client";
import React, { useRef, Suspense } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { Background } from "@/app/components/Background";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const PortfolioHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Entrance animation matching homepage hero
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-head-text",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power4.inOut", stagger: 0.25 }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power4.inOut" },
          "-=1.0"
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.8"
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
      {/* 3D WebGL Shader Canvas Background (Matching Homepage Theme) */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={typeof window !== "undefined" ? window.devicePixelRatio : 1}
          orthographic
          camera={{
            position: [0, 0, 5],
            zoom: 1,
            near: -10,
            far: 10,
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
          }}
        >
          <Suspense fallback={null}>
            <Background />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Hero Headline (Matching Homepage Typography) */}
      <div
        ref={headlineRef}
        className="my-auto z-10 font-jakartaSans font-bold tracking-tight pointer-events-none"
      >
        <h1 className="hero-head-text hero-head text-white">Our Portfolio,</h1>
        <h1 className="hero-head-text hero-head text-white">in motion.</h1>
      </div>

      {/* Subtext and Scroll Cue */}
      <div className="z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-white/10 pt-6">
        <div ref={subtextRef} className="max-w-md">
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Your one-stop creative powerhouse, redefining what’s possible for
            brands across 20 different industries.
          </p>
        </div>

        <div
          ref={scrollCueRef}
          className="flex items-center gap-3 text-xs tracking-widest uppercase text-white/60 font-mono"
        >
          <span>Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
