"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { aboutAPI } from "../../../../services/api";

const Bento = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await aboutAPI.getAll();
        setSlides(data);
      } catch (error) {
        console.error("Error fetching about slides:", error);
      }
    };
    fetchAbout();
  }, []);

  const getSectionData = (section: string) => {
    return slides.find(s => s.section.toLowerCase() === section.toLowerCase()) || {
      title: "Reality is Optional.",
      body: "What you see is not what it is. What you feel is what we design."
    };
  };

  // TEXT REVEAL
  useEffect(() => {
    if (slides.length === 0) return;
    const elements = gsap.utils.toArray(".reveal");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 60, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  // CURSOR GLOW
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX - 120,
        y: e.clientY - 120,
        duration: 0.4,
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // PARALLAX
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;

      gsap.to(".card", {
        x,
        y,
        duration: 0.6,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // DISCO BACKGROUND
  useEffect(() => {
    const gradients = [
      "radial-gradient(circle at 20% 30%, #1B1BFF, #000000)",
      "radial-gradient(circle at 80% 20%, #FF46CE, #1B1BFF)",
      "radial-gradient(circle at 50% 80%, #00DEF2, #000000)",
      "radial-gradient(circle at 30% 70%, #1B1BFF, #FF46CE)",
      "radial-gradient(circle at 70% 50%, #FF46CE, #00DEF2)",
    ];

    let i = 0;

    const changeBg = () => {
      gsap.to(bgRef.current, {
        background: gradients[i],
        duration: 1,
        ease: "power2.inOut",
      });

      i = (i + 1) % gradients.length;
    };

    changeBg();
    const interval = setInterval(changeBg, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen text-white overflow-hidden px-4 lg:px-12 py-16"
    >
      {/* BACKGROUND */}
      <div ref={bgRef} className="absolute inset-0" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[60px]" />

      {/* CURSOR */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed w-[240px] h-[240px] rounded-full bg-white/20 blur-[100px] z-0"
      />

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">

        {/* TITLE */}
        <div className="text-center space-y-3 reveal">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Reality is Optional.
          </h1>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            What you see is not what it is. What you feel is what we design.
          </p>
        </div>

        {/* ABOUT */}
        <div className="card reveal bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-3 text-pink-300">
            {getSectionData("About Us").title}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            {getSectionData("About Us").body}
          </p>
        </div>

        {/* MISSION */}
        <div className="card reveal bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-3 text-yellow-300">
            {getSectionData("Mission").title}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            {getSectionData("Mission").body}
          </p>
        </div>

        {/* VISION */}
        <div className="card reveal bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-3 text-green-300">
            {getSectionData("Vision").title}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            {getSectionData("Vision").body}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Bento;