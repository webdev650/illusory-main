"use client";
import React, { useEffect, useRef } from "react";
import HorizontalScroll from "./HorizontalScroll";
import ScrollReveal from "./ui/ScrollReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GrpOne from "../components/assets/images/GrpOne.png"
import GrpTwo from "../components/assets/images/GrpTwo.png"
import GrpThree from "../components/assets/images/GrpThree.png"
const images = [
  GrpOne,
  GrpTwo,
  GrpThree
];
gsap.registerPlugin(ScrollTrigger);
const Vision = () => {
  const container = useRef(null);
  useEffect(() => {
    // Create the timeline for the animation
    const tl = gsap.timeline({ paused: true });

    tl.to(container.current, {
      opacity: 1,
      duration: 1.2, // Duration of the animation
      backgroundColor: "white",
      color: "black",
      ease: "power3.out", // Easing for smooth animation
    });
    tl.reverse();
    // Function to trigger animation based on scroll position
    const handleScroll = () => {
      const servicesElement = document.querySelector("#vision");

      // Check if servicesElement is not null
      if (servicesElement) {
        const rect = servicesElement.getBoundingClientRect();

        // Check if the element is in the viewport (you can adjust the threshold as needed)
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
          tl.play(); // Start the animation when the element comes into view
        } else {
          tl.reverse(); // reverse the animation when it's out of view
        }
      }
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [container]);
  return (
    <section
      ref={container}
      id="vision"
      className="min-h-screen py-[120px] text-white w-full flex justify-center  px-6  lg:px-20"
    >
      <div className="w-full max-w-7xl">
        <div>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
          >
            Our work brings your imagination to life, effortlessly and joyfully
            realizing your greatest ambitions. Together, we create experiences
            that inspire and delight.
          </ScrollReveal>
        </div>
        <HorizontalScroll images={images}/>
      </div>
    </section>
  );
};

export default Vision;


  /*
  
   useEffect(() => {
    // Create the timeline for the animation
    const tl = gsap.timeline({ paused: true });

    tl.to("#services", {
      opacity: 1,
      duration: 1.2,  // Duration of the animation
      backgroundColor: "white",
      color:"black",
      ease: "power3.out",  // Easing for smooth animation
    });
    tl.reverse(); 
    // Function to trigger animation based on scroll position
    const handleScroll = () => {
      const servicesElement = document.querySelector("#services");
    
      // Check if servicesElement is not null
      if (servicesElement) {
        const rect = servicesElement.getBoundingClientRect();
    
        // Check if the element is in the viewport (you can adjust the threshold as needed)
        if (rect.top <= window.innerHeight * 0.1 && rect.bottom >= 0) {
          tl.play();  // Start the animation when the element comes into view
        } else {
          tl.reverse();  // reverse the animation when it's out of view
        }
      }
    };
    

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  */
