"use client";
import React from "react";

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;

  return (
    <div
      className="service-card group relative flex flex-col justify-between p-8 rounded-2xl w-[320px] sm:w-[380px] h-[400px] shrink-0 transition-all duration-300 transform-gpu overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(30, 33, 42, 0.75) 0%, rgba(21, 23, 30, 0.85) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(101, 110, 139, 0.3)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Hover Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF1284]/15 via-[#26E9FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header: Number badge & Decorative Accent */}
      <div className="flex justify-between items-center z-10">
        <span className="text-3xl font-bold font-jakartaSans text-white/40 group-hover:text-[#26E9FF] transition-colors duration-300">
          {formattedIndex}
        </span>
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF1284]/70 group-hover:scale-150 group-hover:bg-[#26E9FF] transition-all duration-300" />
      </div>

      {/* Bottom Content: Title & Description */}
      <div className="z-10 mt-auto space-y-4">
        <h3 className="text-2xl sm:text-3xl font-bold font-jakartaSans text-white group-hover:translate-x-1 transition-transform duration-300">
          {service.title}
        </h3>
        <p className="text-[#C1C5D2] text-sm leading-relaxed line-clamp-3">
          {service.description}
        </p>
      </div>

      {/* Glass Corner Flare */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF1284]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    </div>
  );
};
