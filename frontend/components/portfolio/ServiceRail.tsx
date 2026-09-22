"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceCard, ServiceItem } from "./ServiceCard";
import servicesData from "@/data/services.json";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const ServiceRail: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 1024;

      if (!isReducedMotion && !isMobile && sectionRef.current && trackRef.current) {
        const cards = trackRef.current.querySelectorAll(".service-card");
        const totalTranslate = trackRef.current.scrollWidth - window.innerWidth + 160;

        // Create horizontal scroll timeline pinned with ScrollTrigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalTranslate}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              // Apply scroll-driven 3D tilt effect on cards based on scrub progress & velocity
              const velocity = self.getVelocity() / 1000;
              cards.forEach((card, idx) => {
                const tiltY = Math.sin(progress * Math.PI * 2 + idx * 0.5) * 8 + velocity * 2;
                const tiltX = Math.cos(progress * Math.PI + idx * 0.3) * 5;
                gsap.set(card, {
                  rotateY: Math.max(-15, Math.min(15, tiltY)),
                  rotateX: Math.max(-10, Math.min(10, tiltX)),
                  transformPerspective: 1000,
                });
              });
            },
          },
        });

        tl.to(trackRef.current, {
          x: -totalTranslate,
          ease: "none",
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white flex flex-col justify-center py-20 overflow-hidden border-t border-[#656E8B]/25"
      style={{ perspective: "1000px" }}
    >
      {/* Section Heading */}
      <div className="px-6 lg:px-20 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[#FF1284] font-mono text-sm tracking-widest uppercase">
            01 / What We Do
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-jakartaSans mt-2">
            9 Core Capabilities
          </h2>
        </div>
        <p className="text-[#DEE1E7] max-w-md text-sm sm:text-base">
          End-to-end creative & technological solutions tailored for industry leaders.
        </p>
      </div>

      {/* Desktop Pinned Horizontal Track */}
      <div className="hidden lg:flex w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-6 lg:px-20 shrink-0 transform-gpu"
        >
          {(servicesData as ServiceItem[]).map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Mobile / Tablet Responsive Grid Fallback */}
      <div className="lg:hidden px-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(servicesData as ServiceItem[]).map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </div>
  );
};
