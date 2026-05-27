"use client";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Partners from "./components/Partners";
import Services from "./components/Services";
import Vision from "./components/OurVision";
import Works from "./components/Works";
import ChromaGrid from "./components/ui/ChromaGrid";
import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useIntro } from "./contexts/IntroContext";
import { App } from "./components/App";
export default function Home() {
  const comp = useRef(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const { hasShownIntro, setHasShownIntro } = useIntro();
 
  useLayoutEffect(() => {
    if (hasShownIntro) {
      setIsIntroComplete(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        onComplete: () => {
          setIsIntroComplete(true);
          document.body.style.overflow = "";
          setHasShownIntro(true);
        },
      });

      // Counter logic
      const counterObj = { value: 0 };
      t1.to(counterObj, {
        value: 100,
        duration: 3,
        ease: "power2.out",
        onUpdate: () => {
          const counterEl = document.getElementById("counter");
          if (counterEl) {
            counterEl.textContent = `${Math.round(counterObj.value)}%`;
          }
        },
      }).to("#intro-slider", {
        yPercent: "-100",
        duration: 1,
      });
    }, comp);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [hasShownIntro, setHasShownIntro]);

  return (
    <main ref={comp} className="relative">
      {/* Only show intro slider if not completed AND not already shown */}
      {!hasShownIntro && !isIntroComplete && (
        <div
          id="intro-slider"
          className="h-screen fixed bg-black w-full top-0 left-0 flex justify-center items-center z-50 py-16 px-10 lg:p-20 tracking-tight gap-6"
        >
          <h1
            id="counter"
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-jakartaSans tracking-[-3.3px] lg:tracking-[-10.02px]"
          >
            0%
          </h1>
        </div>
      )}

      {/* Page Content */}
      {/* <div className={isIntroComplete ? "block" : "hidden"}> */}
      <App
        head1="Crafting"
        head2="connections,"
        head3="inspiring"
        head4="imaginations."
      />
      <Vision />
      <Services />
      <Works />
      <Partners />
      <ChromaGrid
     
        radius={300}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
      />
      <FAQ />
      <Footer />
      {/* </div> */}
    </main>
  );
}
