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
            <p className="para w-[300px] md:w-[400px]">
              Your one-stop creative powerhouse, redefining what’s possible for
              brands across different industries.
            </p>
            <button
              ref={buttonRef}
              className="md:fixed bottom-6 right-24 lg:bottom-20 lg:right-20 group pointer-events-auto  md:flex items-center gap-4 rounded-[72px] cursor-pointer transition-all duration-300"
            >
              <div className="bg-[#3B3B3B] rounded-[72px]">
                <ShinyText
                  text="Start a discussion"
                  disabled={false}
                  speed={3}
                  className="relative flex items-center justify-between w-full md:gap-4 rounded-[72px] py-5 pl-7 pr-5 text-[24px]  transition-all duration-300 group-hover:!bg-[#FF1284] group-hover:text-white pointer-events-auto "
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


