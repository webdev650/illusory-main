"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import ShinyText from "./ui/ShinyText";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
interface HeroProps {
  head1: string;
  head2: string;
  head3: string;
  head4: string;
}

const HeroPage: React.FC<HeroProps> = ({ head1, head2, head3, head4 }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    gsap.fromTo(
      ".hero-head",
      {
        opacity: 0,
        y: "+=30",
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 0.25,
      }
    );
    gsap.fromTo(
      ".para",
      {
        opacity: 0,
        y: "+=30",
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 0.25,
      }
    );
  }, []);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries.some((entry) => entry.isIntersecting);
      setIsButtonVisible(!isIntersecting);
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
    });

    const heroElement = document.getElementById("hero-section");
    const footerElement = document.getElementById("footer-section");

    if (heroElement) observer.observe(heroElement);
    if (footerElement) observer.observe(footerElement);

    return () => {
      if (heroElement) observer.unobserve(heroElement);
      if (footerElement) observer.unobserve(footerElement);
    };
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: isButtonVisible ? 1 : 0,
        scale: isButtonVisible ? 1 : 0.8,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [isButtonVisible]);

  return (
    <>
      <div className="text-white flex h-[100vh] lg:h-[calc(100vh-72px)] py-[80px] w-full  justify-center  px-6  lg:px-20 ">
        <div className="flex flex-col justify-between w-full max-w-7xl ">
          <div>
            <div className=" font-[700] font-jakartaSans">
              <h1 className="hero-head">{head1}</h1>
              <h1 className="hero-head">{head2}</h1>
              <h1 className="hero-head">{head3}</h1>
              <h1 className="hero-head">{head4}</h1>
            </div>
          </div>
          <div className="mt-10  h-full md:h-fit flex flex-col justify-between">
            <p className="para w-full max-w-[300px] sm:max-w-[400px] text-sm sm:text-base">
              Your one-stop creative powerhouse, redefining what’s possible for
              brands across different industries.
            </p>
            <button
              ref={buttonRef}
              className="md:fixed bottom-6 right-6 sm:right-[112px] md:right-[120px] z-[90] group pointer-events-auto md:flex items-center gap-4 rounded-[72px] cursor-pointer transition-all duration-300 mt-6 md:mt-0"
            >
              <div
                className="rounded-[72px] transition-all duration-500 overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), 0 0 25px 4px rgba(59, 130, 246, 0.3)",
                }}
              >
                <ShinyText
                  text="Start a discussion"
                  disabled={false}
                  speed={3}
                  className="relative flex items-center justify-between w-full md:gap-4 rounded-[72px] py-3.5 md:py-5 pl-5 md:pl-7 pr-4 md:pr-5 text-base md:text-[24px] transition-all duration-300 group-hover:!bg-[#FF1284] group-hover:text-white pointer-events-auto"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroPage;


