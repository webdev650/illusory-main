"use client";
import SafeImage from "./ui/SafeImage";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projectsAPI } from "../../services/api";
import ImageMarquee from "react-fast-marquee";
import { cleanCloudinaryUrl } from "../lib/cloudinary";

const Works = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data.slice(0, 20)); // Limit homepage projects for performance
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const container = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.to(container.current, {
      opacity: 1,
      duration: 1.2,
      backgroundColor: "white",
      color: "black",
      ease: "power3.out",
    });
    tl.reverse();

    const handleScroll = () => {
      const servicesElement = document.querySelector("#works");

      if (servicesElement) {
        const rect = servicesElement.getBoundingClientRect();

        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
          tl.play();
        } else {
          tl.reverse();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [container]);
  const showTooltip = (e: React.MouseEvent, content: string) => {
    setTooltip({
      show: true,
      content,
      x: e.clientX + 10,
      y: e.clientY + 10,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };
  if (!isMounted) return null;

  return (
    <section
      ref={container}
      id="works"
      className="min-h-screen py-[120px] w-full px-6 lg:px-20 flex justify-center"
    >
        
      <div className=" flex flex-col justify-between w-full max-w-7xl">
        <div>
          <p className="md:w-[400px]">
            Our best works - Our projects show dedication to research and
            creativity, helping brands navigate the digital landscape.
          </p>
        </div>
        <div
          style={{ scrollbarWidth: "none" }}
          className="w-full font-jakartaSans mt-20"
        >
          <ImageMarquee 
            speed={40} 
            pauseOnHover={true} 
            gradient={false}
          >
            <div className="flex gap-11 pr-11">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="flex-none w-[350px] md:w-[480px] group cursor-pointer border-[#D9D9D9] border-[1px] rounded-2xl"
                >
                  <Link href={`/worksdescription/${project.navigation}`}>
                    <div className="relative w-full flex flex-col h-full">   
                      <div className="relative w-full h-[250px] md:h-[300px] overflow-hidden rounded-t-2xl">
                        {project.video ? (
                          <video 
                            src={cleanCloudinaryUrl(project.video)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-t-2xl"
                          />
                        ) : (
                          <SafeImage id="image_works"
                            src={project.image}
                            fill
                            className="w-full h-full object-cover rounded-t-2xl"
                            alt={project.title}
                            priority
                          />
                        )}
                      </div>
                      <div className="flex flex-col p-6 md:p-10 gap-4 flex-grow">
                        <h1 className="hidden md:flex text-[#9F9F9F] text-[14px]">
                          {project.tags}
                        </h1>
                        <h1 className="text-2xl md:text-[32px] lg:text-[40px] w-full md:w-[90%] leading-[120%] tracking-[-1.24px] font-[700]">
                          {project.title}
                        </h1>
                        <p className="line-clamp-2 md:line-clamp-3 relative text-sm md:text-base text-gray-500" 
                           onMouseEnter={(e) => showTooltip(e, project.description)}
                           onMouseLeave={hideTooltip}
                           onMouseMove={(e) => {
                             setTooltip(prev => ({
                               ...prev,
                               x: e.clientX + 10,
                               y: e.clientY + 10
                             }));
                           }}>{project.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </ImageMarquee>
        </div>
         {/* Tooltip */}
         {tooltip.show && (
          <div 
            ref={tooltipRef}
            className="fixed bg-neutral-800 text-white max-w-md p-4 rounded-xl pointer-events-none z-50 transition-opacity duration-200"
            style={{
              left: `${tooltip.x + 15}px`,
              top: `${tooltip.y + 15}px`,
              transform: 'translate(0, 0)',
              opacity: tooltip.show ? 1 : 0,
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </section>
  );
};

export default Works;
