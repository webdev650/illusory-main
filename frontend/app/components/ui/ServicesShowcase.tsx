"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface ServiceWord {
  text: string;
  color?: string;
}

export interface ServiceItem {
  _id?: string;
  link?: string;
  textHead: string;
  words?: ServiceWord[];
}

interface ServicesShowcaseProps {
  items: ServiceItem[];
}

export default function ServicesShowcase({ items }: ServicesShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full flex flex-col mt-8 sm:mt-12">
      <div className="border-b border-white/15">
        {items.map((item, idx) => {
          const isActive = activeIdx === idx;
          const formattedNum = String(idx + 1).padStart(2, "0");

          return (
            <div
              key={item._id || idx}
              className={`group relative border-t border-white/15 transition-all duration-500 ease-out cursor-pointer ${
                isActive ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
              }`}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(isActive ? null : idx)}
            >
              {/* Active Item Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#FF1284] to-[#26E9FF] transition-all duration-300 ${
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                }`}
              />

              <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 flex flex-col justify-center">
                {/* Main Title Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-4 sm:gap-6 md:gap-10">
                    {/* Index Number */}
                    <span
                      className={`font-jakartaSans text-sm sm:text-base md:text-lg font-semibold tracking-wider transition-colors duration-300 ${
                        isActive ? "text-[#26E9FF]" : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {formattedNum}
                    </span>

                    {/* Category Title */}
                    <h3
                      className={`font-jakartaSans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight transition-all duration-300 ${
                        isActive
                          ? "text-white translate-x-1 sm:translate-x-2"
                          : "text-white/80 group-hover:text-white group-hover:translate-x-1"
                      }`}
                    >
                      {item.textHead}
                    </h3>
                  </div>

                  {/* Arrow Action Icon */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                      {isActive ? "Viewing" : "Explore"}
                    </span>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isActive
                          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(38,233,255,0.3)] rotate-45"
                          : "border-white/20 text-white group-hover:border-white/60 group-hover:bg-white/10 group-hover:rotate-45"
                      }`}
                    >
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </div>

                {/* Expanded Sub-services Chips */}
                {item.words && item.words.length > 0 && (
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100 mt-6 sm:mt-8"
                        : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 items-center">
                        <span className="text-xs uppercase tracking-widest text-white/50 mr-2 flex items-center gap-1.5 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF1284]" /> Key Capabilities:
                        </span>
                        {item.words.map((w, wIdx) => {
                          const tagColor =
                            w.color && w.color !== "#000000" ? w.color : "#26E9FF";
                          return (
                            <Link
                              key={wIdx}
                              href={item.link || "/services"}
                              className="group/tag inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/[0.05] border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0 transition-transform duration-300 group-hover/tag:scale-125"
                                style={{ backgroundColor: tagColor }}
                              />
                              <span className="text-white/90 group-hover/tag:text-white font-jakartaSans">
                                {w.text}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link / CTA */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/services"
          className="inline-flex items-center gap-3 text-sm sm:text-base font-semibold text-[#26E9FF] hover:text-[#FF1284] transition-colors duration-300 group"
        >
          <span>View All Service Details</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </div>
  );
}
