"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RefreshCw } from "lucide-react";

interface Slide {
  section: string;
  title: string;
  body: string;
}

interface OriDomiAccordionProps {
  slides: Slide[];
}

const OriDomiAccordion: React.FC<OriDomiAccordionProps> = ({ slides }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Panel refs
  const panelRef0 = useRef<HTMLDivElement>(null);
  const panelRef1 = useRef<HTMLDivElement>(null);
  const panelRef2 = useRef<HTMLDivElement>(null);

  // Content height refs for layout measurements
  const contentRef0 = useRef<HTMLDivElement>(null);
  const contentRef1 = useRef<HTMLDivElement>(null);
  const contentRef2 = useRef<HTMLDivElement>(null);

  // Shading overlay refs
  const shadingRef0 = useRef<HTMLDivElement>(null);
  const shadingRef1 = useRef<HTMLDivElement>(null);
  const shadingRef2 = useRef<HTMLDivElement>(null);

  const scrollTimelineRef = useRef<any>(null);

  const [sliderVal, setSliderVal] = useState<number>(0.6); // Default fold amount (60%)
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false); // Tracks if user is in manual slider override mode
  const [heights, setHeights] = useState({ h0: 180, h1: 180, h2: 180 });

  // Refs for tracking active states inside ScrollTrigger callbacks (avoids stale closures)
  const isHoveredRef = useRef(isHovered);
  const isManualRef = useRef(isManual);
  const heightsRef = useRef(heights);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isManualRef.current = isManual;
  }, [isManual]);

  useEffect(() => {
    heightsRef.current = heights;
  }, [heights]);

  // Helper to fetch slide content from DB matching key sections
  const getSectionData = (section: string) => {
    const found = slides.find(
      (s) => s.section.toLowerCase() === section.toLowerCase()
    );
    if (found) return found;

    // Fallback defaults
    if (section.toLowerCase() === "about us") {
      return {
        title: "Rules? We Hack 'Em",
        body: "At Illusory Design Studios, creativity isn't just a job—it's a full-blown rebellion. We don't conform, we break boundaries, we make things explode in ways people didn't even know they needed.",
      };
    }
    if (section.toLowerCase() === "mission") {
      return {
        title: "Clients? Nah, We Roll with Visionaries",
        body: "This isn't a service line — it's a frontline. We move with the brands that break patterns and build presence. No gimmicks. No hand-holding. Just clear vision, sharp execution, and work that speaks before we do.",
      };
    }
    return {
      title: "Setting the Pace for the Future",
      body: "At Illusory, our vision is to lead—not follow—in shaping how brands engage, influence, and endure. We aspire to become a benchmark in creative innovation, where every idea sparks progress and every brand built sets the tone for what's next.",
    };
  };

  // Measure content heights dynamically (essential for responsive design)
  useEffect(() => {
    const updateHeights = () => {
      if (contentRef0.current && contentRef1.current && contentRef2.current) {
        setHeights({
          h0: contentRef0.current.getBoundingClientRect().height,
          h1: contentRef1.current.getBoundingClientRect().height,
          h2: contentRef2.current.getBoundingClientRect().height,
        });
      }
    };

    updateHeights();
    const timer = setTimeout(updateHeights, 150);

    const resizeObserver = new ResizeObserver(updateHeights);
    if (contentRef0.current) resizeObserver.observe(contentRef0.current);
    if (contentRef1.current) resizeObserver.observe(contentRef1.current);
    if (contentRef2.current) resizeObserver.observe(contentRef2.current);

    window.addEventListener("resize", updateHeights);
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeights);
    };
  }, [slides]);

  // Compute 3D variables, projected height, and shading based on scroll progress (0 to 1)
  const getScrollStates = (progress: number, currentHeights: typeof heights) => {
    // We unfold them ONE BY ONE as progress increases:
    // - Progress 0.00 to 0.33: Panel 0 unfolds from 100% to 0% folded. Panels 1 & 2 stay folded.
    // - Progress 0.33 to 0.66: Panel 0 is flat. Panel 1 unfolds from 100% to 0%. Panel 2 stays folded.
    // - Progress 0.66 to 1.00: Panels 0 & 1 are flat. Panel 2 unfolds from 100% to 0%.
    let p0 = 1;
    let p1 = 1;
    let p2 = 1;

    if (progress <= 0.33) {
      p0 = 1 - progress / 0.33;
    } else if (progress <= 0.66) {
      p0 = 0;
      p1 = 1 - (progress - 0.33) / 0.33;
    } else {
      p0 = 0;
      p1 = 0;
      p2 = 1 - Math.min(1, (progress - 0.66) / 0.34);
    }

    const theta0 = -24 * p0;
    const theta1 = 48 * p1;
    const theta2 = -48 * p2;

    const rad0 = (theta0 * Math.PI) / 180;
    const rad1 = ((theta0 + theta1) * Math.PI) / 180;
    const rad2 = ((theta0 + theta1 + theta2) * Math.PI) / 180;

    const projHeight =
      currentHeights.h0 * Math.cos(rad0) +
      currentHeights.h1 * Math.cos(rad1) +
      currentHeights.h2 * Math.cos(rad2);

    return {
      theta0,
      theta1,
      theta2,
      projHeight,
      shading0: p0 * 0.45,
      shading1: p1 * 0.25,
      shading2: p2 * 0.5,
    };
  };

  // Compute 3D variables based on manual slider (all folds fold simultaneously)
  const getSliderStates = (p: number) => {
    const theta0 = -24 * p;
    const theta1 = 48 * p;
    const theta2 = -48 * p;

    const rad0 = (theta0 * Math.PI) / 180;
    const rad1 = ((theta0 + theta1) * Math.PI) / 180;
    const rad2 = ((theta0 + theta1 + theta2) * Math.PI) / 180;

    const projHeight =
      heights.h0 * Math.cos(rad0) +
      heights.h1 * Math.cos(rad1) +
      heights.h2 * Math.cos(rad2);

    return {
      theta0,
      theta1,
      theta2,
      projHeight,
      shading0: p * 0.45,
      shading1: p * 0.25,
      shading2: p * 0.5,
    };
  };

  // Helper to transition accordion elements to a specific computed state
  const animateToState = (states: ReturnType<typeof getScrollStates>, duration = 0.6) => {
    gsap.to(panelRef0.current, { rotateX: states.theta0, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(panelRef1.current, { rotateX: states.theta1, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(panelRef2.current, { rotateX: states.theta2, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(accordionRef.current, { height: states.projHeight, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(shadingRef0.current, { opacity: states.shading0, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(shadingRef1.current, { opacity: states.shading1, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(shadingRef2.current, { opacity: states.shading2, duration, ease: "power2.out", overwrite: "auto" });
  };

  // Initialize ScrollTrigger-driven one-by-one unfolding
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!accordionRef.current || !containerRef.current) return;

      const triggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%", // Starts unfolding as it enters screen
        end: "bottom 35%", // Becomes fully flat near the middle of screen
        scrub: 1, // Smooth scrolling scrub lag
        onUpdate: (self) => {
          // If the user has hovered or manually overridden, don't let scroll fight them
          if (isHoveredRef.current || isManualRef.current) return;
          
          const states = getScrollStates(self.progress, heightsRef.current);
          gsap.set(panelRef0.current, { rotateX: states.theta0 });
          gsap.set(panelRef1.current, { rotateX: states.theta1 });
          gsap.set(panelRef2.current, { rotateX: states.theta2 });
          gsap.set(accordionRef.current, { height: states.projHeight });
          gsap.set(shadingRef0.current, { opacity: states.shading0 });
          gsap.set(shadingRef1.current, { opacity: states.shading1 });
          gsap.set(shadingRef2.current, { opacity: states.shading2 });
        },
      });

      scrollTimelineRef.current = triggerInstance;
      
      // Delay refresh briefly to ensure Next hydration and DOM heights are fully settled
      setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    initScrollTrigger();

    return () => {
      if (scrollTimelineRef.current) {
        scrollTimelineRef.current.kill();
      }
    };
  }, [heights]);

  // Mouse tilt 3D perspective handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!accordionRef.current) return;
    const rect = accordionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(accordionRef.current, {
      rotateY: x * 14,
      rotateX: -y * 14 + 8, // maintains base tilt
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Smoothly animate to fully unfolded flat state for readability
    animateToState({
      theta0: 0,
      theta1: 0,
      theta2: 0,
      projHeight: heights.h0 + heights.h1 + heights.h2,
      shading0: 0,
      shading1: 0,
      shading2: 0,
    }, 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Reset 3D base slant
    gsap.to(accordionRef.current, {
      rotateY: 0,
      rotateX: 8,
      duration: 0.75,
      ease: "power2.out",
    });

    // Animate back to scroll progress OR manual slider progress
    if (isManual) {
      animateToState(getSliderStates(sliderVal), 0.6);
    } else if (scrollTimelineRef.current) {
      const currentScrollStates = getScrollStates(
        scrollTimelineRef.current.progress,
        heights
      );
      animateToState(currentScrollStates, 0.6);
    }
  };

  const aboutData = getSectionData("About Us");
  const missionData = getSectionData("Mission");
  const visionData = getSectionData("Vision");

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* HIGH-TECH FOLD CONTROLLERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-gray-400 font-semibold font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ec4899]" />
          OriDomi Fold Engine v1.2
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 max-w-md">
          <span className="text-[10px] text-gray-400 font-mono tracking-wider">0% FLAT</span>
          <input
            type="range"
            min="0"
            max="0.85"
            step="0.01"
            value={sliderVal}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSliderVal(val);
              setIsManual(true);
              if (!isHovered) {
                const manualStates = getSliderStates(val);
                // Set directly during scrub
                gsap.set(panelRef0.current, { rotateX: manualStates.theta0 });
                gsap.set(panelRef1.current, { rotateX: manualStates.theta1 });
                gsap.set(panelRef2.current, { rotateX: manualStates.theta2 });
                gsap.set(accordionRef.current, { height: manualStates.projHeight });
                gsap.set(shadingRef0.current, { opacity: manualStates.shading0 });
                gsap.set(shadingRef1.current, { opacity: manualStates.shading1 });
                gsap.set(shadingRef2.current, { opacity: manualStates.shading2 });
              }
            }}
            className="w-full h-1 bg-white/10 hover:bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none transition-all duration-200"
          />
          <span className="text-[10px] text-gray-400 font-mono tracking-wider">100% FOLDED</span>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* SYNC BACK TO SCROLL BUTTON */}
          {isManual && (
            <button
              onClick={() => {
                setIsManual(false);
                if (scrollTimelineRef.current) {
                  const scrollStates = getScrollStates(
                    scrollTimelineRef.current.progress,
                    heights
                  );
                  animateToState(scrollStates, 0.85);
                }
              }}
              className="flex-1 sm:flex-initial px-4 py-1.5 text-xs rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 font-semibold tracking-widest uppercase font-mono transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
              Sync Scroll
            </button>
          )}

          <button
            onClick={() => {
              const nextVal = sliderVal > 0.1 ? 0 : 0.6;
              setSliderVal(nextVal);
              setIsManual(true);
              if (!isHovered) {
                animateToState(getSliderStates(nextVal), 0.65);
              }
            }}
            className="flex-1 sm:flex-initial px-4 py-1.5 text-xs rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/50 text-pink-300 font-semibold tracking-widest uppercase font-mono transition-all duration-200"
          >
            {sliderVal > 0.1 ? "Unfold" : "Fold"}
          </button>
        </div>
      </div>

      {/* 3D ACCORDION CANVAS */}
      <div
        className="w-full relative overflow-visible cursor-pointer"
        style={{
          perspective: "2200px",
          perspectiveOrigin: "50% 0%",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={accordionRef}
          className="relative w-full overflow-visible transition-shadow duration-300 shadow-[0_30px_100px_rgba(0,0,0,0.4)] hover:shadow-[0_45px_130px_rgba(236,72,153,0.12)]"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "top center",
            transform: "rotateX(8deg)", // Default perspective tilt
          }}
        >
          {/* PANEL 0 (TOP) - About Us */}
          <div
            ref={panelRef0}
            className="relative w-full select-none"
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              height: `${heights.h0}px`,
            }}
          >
            {/* Content card */}
            <div
              ref={contentRef0}
              className="w-full bg-slate-900/75 border-t border-l border-r border-white/10 rounded-t-2xl p-6 md:p-8 backdrop-blur-md flex flex-col justify-center animate-none"
            >
              <h3 className="text-2xl font-bold mb-3 text-pink-400 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-pink-500 rounded-full inline-block animate-none" />
                {aboutData.title}
              </h3>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-3xl">
                {aboutData.body}
              </p>
            </div>

            {/* Crevice Shading Overlay (Crease at the bottom edge) */}
            <div
              ref={shadingRef0}
              className="pointer-events-none absolute inset-0 rounded-t-2xl z-10"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.8) 100%)",
                opacity: 0,
              }}
            />

            {/* PANEL 1 (MIDDLE) - Mission */}
            <div
              ref={panelRef1}
              className="absolute top-full left-0 w-full"
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                height: `${heights.h1}px`,
              }}
            >
              <div
                ref={contentRef1}
                className="w-full bg-slate-950/80 border-l border-r border-white/10 p-6 md:p-8 backdrop-blur-md flex flex-col justify-center border-t border-t-white/5"
              >
                <h3 className="text-2xl font-bold mb-3 text-yellow-400 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-yellow-500 rounded-full inline-block" />
                  {missionData.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-3xl">
                  {missionData.body}
                </p>
              </div>

              {/* Crevice Shading Overlay (Crease at top & bottom edge) */}
              <div
                ref={shadingRef1}
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.65) 100%)",
                  opacity: 0,
                }}
              />

              {/* PANEL 2 (BOTTOM) - Vision */}
              <div
                ref={panelRef2}
                className="absolute top-full left-0 w-full"
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  height: `${heights.h2}px`,
                }}
              >
                <div
                  ref={contentRef2}
                  className="w-full bg-slate-900/75 border-b border-l border-r border-white/10 rounded-b-2xl p-6 md:p-8 backdrop-blur-md flex flex-col justify-center border-t border-t-white/5"
                >
                  <h3 className="text-2xl font-bold mb-3 text-emerald-400 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block" />
                    {visionData.title}
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-3xl">
                    {visionData.body}
                  </p>
                </div>

                {/* Crevice Shading Overlay (Crease at the top edge) */}
                <div
                  ref={shadingRef2}
                  className="pointer-events-none absolute inset-0 rounded-b-2xl z-10"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 60%)",
                    opacity: 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OriDomiAccordion;
