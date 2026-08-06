"use client";

import React, { useState } from "react";
import Image from "next/image";

import ADDY_Fitness from "./assets/addy-fitness.svg";
import ADDY_Meals from "./assets/addy-meals.svg";
import AllenSolly from "./assets/allen-solly.svg";
import Ampverse from "./assets/ampverse.svg";
import AnnSCafe from "./assets/anns-cafe.svg";
import Robinson from "./assets/ch-robinson.svg";
import JawedHabib from "./assets/jawed-habib.svg";
import zomaLand from "./assets/zomaland.svg";
import Swiggy from "./assets/swiggy.svg";
import Agritech from "./assets/gng-agritech.svg";
import Lakme from "./assets/lakme.svg";
import MCO from "./assets/mco.svg";
import JJ_Food from "./assets/jj-food.svg";
import Desi_Funkaar from "./assets/desi-funkaar.svg";
import GoaGladiator from "./assets/goa-gladiator.svg";
import Nvidia from "./assets/nvidia.svg";
import Mughal_Kitchen from "./assets/mughal-kitchen.svg";
import Salty from "./assets/salty.svg";
import Visage from "./assets/visage.svg";
import inSTREAMLY from "./assets/instreamly.svg";
import Rare_Rabbit from "./assets/rare-rabbit.svg";
import Patra from "./assets/patra-tours-travel.svg";
import Urbana from "./assets/urbana.svg";
import Dhani from "./assets/dhani-01.svg";

export interface LogoItem {
  id: string;
  src: any;
  alt: string;
}

const row1: LogoItem[] = [
  { id: "r1-addy-fit", src: ADDY_Fitness, alt: "ADDY Fitness" },
  { id: "r1-addy-meals", src: ADDY_Meals, alt: "ADDY Meals" },
  { id: "r1-allen-solly", src: AllenSolly, alt: "Allen Solly" },
  { id: "r1-ampverse", src: Ampverse, alt: "Ampverse" },
  { id: "r1-anns-cafe", src: AnnSCafe, alt: "Ann's Cafe" },
  { id: "r1-robinson", src: Robinson, alt: "C.H. Robinson" },
  { id: "r1-jawed-habib", src: JawedHabib, alt: "Jawed Habib" },
  { id: "r1-zomaland", src: zomaLand, alt: "Zomaland" },
];

const row2: LogoItem[] = [
  { id: "r2-swiggy", src: Swiggy, alt: "Swiggy" },
  { id: "r2-agritech", src: Agritech, alt: "GNG Agritech" },
  { id: "r2-lakme", src: Lakme, alt: "Lakme" },
  { id: "r2-mco", src: MCO, alt: "My City Odisha" },
  { id: "r2-jj-food", src: JJ_Food, alt: "JJ Food" },
  { id: "r2-desi-funkaar", src: Desi_Funkaar, alt: "Desi Funkaar" },
  { id: "r2-goa-gladiator", src: GoaGladiator, alt: "Goa Gladiator" },
  { id: "r2-nvidia", src: Nvidia, alt: "Nvidia" },
];

const row3: LogoItem[] = [
  { id: "r3-mughal-kitchen", src: Mughal_Kitchen, alt: "Mughal Kitchen" },
  { id: "r3-salty", src: Salty, alt: "Salty" },
  { id: "r3-visage", src: Visage, alt: "Visage" },
  { id: "r3-instreamly", src: inSTREAMLY, alt: "inSTREAMLY" },
  { id: "r3-rare-rabbit", src: Rare_Rabbit, alt: "Rare Rabbit" },
  { id: "r3-patra", src: Patra, alt: "Patra Tour And Travels" },
  { id: "r3-urbana", src: Urbana, alt: "Urbana" },
  { id: "r3-dhani", src: Dhani, alt: "Dhani" },
];

export interface ClientLogosMarqueeProps {
  /** Accent glow color matching hero blue or custom brand tone */
  glowColor?: string;
  /** Scale amount on hover (default 1.08) */
  scaleAmount?: number;
  /** Speed duration for Row 1 (top, right-to-left) */
  speedRow1?: string;
  /** Speed duration for Row 2 (middle, left-to-right) */
  speedRow2?: string;
  /** Speed duration for Row 3 (bottom, right-to-left) */
  speedRow3?: string;
  /** Pause marquee movement when row is hovered */
  pauseOnHover?: boolean;
  /** Optional custom CSS container class */
  className?: string;
}

interface MarqueeRowProps {
  rowId: string;
  logos: LogoItem[];
  direction: "left" | "right";
  duration: string;
  hoveredLogoKey: string | null;
  setHoveredLogoKey: (key: string | null) => void;
  pauseOnHover: boolean;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  rowId,
  logos,
  direction,
  duration,
  hoveredLogoKey,
  setHoveredLogoKey,
  pauseOnHover,
}) => {
  // Seamless loop quadruplication
  const repeatedLogos = [...logos, ...logos, ...logos, ...logos];
  const animationName = direction === "left" ? "futuristicMarqueeLeft" : "futuristicMarqueeRight";
  const isAnyLogoHovered = hoveredLogoKey !== null;

  return (
    <div
      className="group relative w-full py-2 sm:py-3 md:py-3.5 flex select-none pointer-events-auto"
      style={{ isolation: "isolate" }}
    >
      <div
        className={`flex shrink-0 items-center justify-around gap-4 sm:gap-6 md:gap-8 ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animation: `${animationName} ${duration} linear infinite`,
          width: "max-content",
          willChange: "transform",
        }}
      >
        {repeatedLogos.map((client, index) => {
          const itemKey = `${rowId}-${client.id}-${index}`;
          const isItemHovered = hoveredLogoKey === itemKey;
          const isOtherDimmed = isAnyLogoHovered && !isItemHovered;

          return (
            <div
              key={itemKey}
              onMouseEnter={() => setHoveredLogoKey(itemKey)}
              onMouseLeave={() => setHoveredLogoKey(null)}
              className={`relative flex-shrink-0 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-[18px] cursor-pointer transition-all duration-500 ease-out select-none group/tile ${
                isItemHovered ? "z-[50]" : "z-10"
              }`}
              style={{
                transform: isItemHovered
                  ? "scale(1.12) translateY(-2px)"
                  : isOtherDimmed
                  ? "scale(0.95)"
                  : "scale(1)",
                opacity: isItemHovered ? 1 : isOtherDimmed ? 0.45 : 0.85,
                filter: isOtherDimmed ? "grayscale(30%) brightness(0.7)" : "none",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out, filter 0.5s ease-out",
              }}
            >
              {/* Symmetrical Outer Blue Light Glow Aura (Soft 500ms fade) */}
              <div
                className="absolute -inset-3 rounded-[24px] pointer-events-none transition-opacity duration-500 ease-out z-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 75%)",
                  opacity: isItemHovered ? 1 : 0,
                  filter: "blur(18px)",
                }}
              />

              {/* Constant Frosted Glass Panel with Smooth Border & Shadow Glow */}
              <div
                className="absolute inset-0 rounded-[18px] pointer-events-none transition-all duration-500 ease-out overflow-hidden z-10"
                style={{
                  background: isItemHovered ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.01)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: isItemHovered
                    ? "1px solid rgba(255, 255, 255, 0.25)"
                    : "1px solid rgba(255, 255, 255, 0.04)",
                  boxShadow: isItemHovered
                    ? "0 0 35px 8px rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 6px 0 rgba(0, 0, 0, 0.2)"
                    : "0 0 0px transparent",
                }}
              >
                {/* Smooth Diagonal Glass Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 70%)",
                    opacity: isItemHovered ? 1 : 0,
                  }}
                />

                {/* Top Rim Specular Light Line */}
                <div
                  className="absolute top-0 inset-x-0 h-[1px] pointer-events-none transition-opacity duration-500 ease-out z-30"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)",
                    opacity: isItemHovered ? 1 : 0,
                  }}
                />
              </div>

              {/* Centered Logo Image inside Container */}
              <div className="relative z-10 flex items-center justify-center w-full h-full p-3">
                <Image
                  src={client.src}
                  alt={client.alt}
                  className="max-w-[75%] max-h-[75%] w-auto h-auto object-contain transition-all duration-500 ease-out pointer-events-none"
                  style={{
                    filter: isItemHovered
                      ? "brightness(1.35) drop-shadow(0 0 12px rgba(59, 130, 246, 0.65))"
                      : "brightness(0.95)",
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ClientLogosMarquee: React.FC<ClientLogosMarqueeProps> = ({
  glowColor = "rgba(0, 140, 255, 0.45)",
  scaleAmount = 1.08,
  speedRow1 = "48s",
  speedRow2 = "54s",
  speedRow3 = "48s",
  pauseOnHover = true,
  className = "",
}) => {
  const [hoveredLogoKey, setHoveredLogoKey] = useState<string | null>(null);

  return (
    <div
      className={`relative w-full bg-black overflow-hidden flex flex-col gap-1 sm:gap-1.5 md:gap-2 py-4 sm:py-6 ${className}`}
      style={
        {
          "--marquee-glow-color": glowColor,
          "--marquee-scale": scaleAmount,
        } as React.CSSProperties
      }
    >
      {/* Side gradient fade masks for seamless floating effect into pure black */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 md:w-60 lg:w-72 bg-gradient-to-r from-black via-black/90 to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 md:w-60 lg:w-72 bg-gradient-to-l from-black via-black/90 to-transparent z-20" />

      {/* Embedded CSS Keyframes & Reduced Motion Rules */}
      <style jsx global>{`
        @keyframes futuristicMarqueeLeft {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes futuristicMarqueeRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .group div {
            animation-play-state: paused !important;
          }
        }
      `}</style>

      {/* Row 1: Infinite Horizontal Scroll Right -> Left */}
      <MarqueeRow
        rowId="row1"
        logos={row1}
        direction="left"
        duration={speedRow1}
        hoveredLogoKey={hoveredLogoKey}
        setHoveredLogoKey={setHoveredLogoKey}
        pauseOnHover={pauseOnHover}
      />

      {/* Row 2: Infinite Horizontal Scroll Left -> Right */}
      <MarqueeRow
        rowId="row2"
        logos={row2}
        direction="right"
        duration={speedRow2}
        hoveredLogoKey={hoveredLogoKey}
        setHoveredLogoKey={setHoveredLogoKey}
        pauseOnHover={pauseOnHover}
      />

      {/* Row 3: Infinite Horizontal Scroll Right -> Left */}
      <MarqueeRow
        rowId="row3"
        logos={row3}
        direction="left"
        duration={speedRow3}
        hoveredLogoKey={hoveredLogoKey}
        setHoveredLogoKey={setHoveredLogoKey}
        pauseOnHover={pauseOnHover}
      />
    </div>
  );
};

export default ClientLogosMarquee;
