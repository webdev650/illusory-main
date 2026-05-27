"use client";
import { cleanCloudinaryUrl } from "../../lib/cloudinary";
import SafeImage from "../../components/ui/SafeImage";
import React, { useEffect, useRef, useState } from "react";
import { projectsAPI } from "../../../services/api";
import gsap from "gsap";
import Link from "next/link";

const BestWorks = () => {
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
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
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
      const servicesElement = document.querySelector("#best-works");

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
  return (
    <section
      ref={container}
      id="best-works"
      className="section-class font-jakartaSans pb-[120px]"
    >
      <div className="w-full max-w-7xl">
        <div>
          <h1 className="sm:w-[400px]">
            Our best works- Our projects show dedication to research and
            creativity, helping brands navigate to digital landscape.
          </h1>
        </div>

        <div className="grid grid-cols-1 grid-rows-1 lg:grid-cols-2 lg:grid-rows-3 gap-10 mt-20">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex-none col-span-1 row-span-1 group cursor-pointer border-[1px] rounded-2xl"
            >
              <Link
                href={`/worksdescription/${project.navigation}`}
                className="relative w-full flex flex-col h-full"
              >
                <div className="relative w-full h-[280px] lg:h-[360px] overflow-hidden rounded-t-2xl">
                  {project.video ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-t-2xl"
                    >
                      <source src={cleanCloudinaryUrl(project.video)} type="video/mp4" />
                    </video>
                  ) : (
                    <SafeImage
                      id="image_works"
                      src={project.image}
                      fill
                      className="w-full h-full object-cover rounded-t-2xl"
                      alt={project.title}
                    />
                  )}
                </div>
                <div className="flex flex-col lg:mt-10 gap-6 flex-grow p-6 lg:px-10">
                  <h1 className="hidden md:flex text-[#9F9F9F] text-[14px]">
                    {project.tags}
                  </h1>
                  <h1 className="text-3xl md:text-5xl w-full leading-[120%] tracking-[-1.24px] font-[700]">
                    {project.title}
                  </h1>
                  <p
                    onMouseEnter={(e) => showTooltip(e, project.description)}
                    onMouseLeave={hideTooltip}
                    onMouseMove={(e) => {
                      setTooltip((prev) => ({
                        ...prev,
                        x: e.clientX + 10,
                        y: e.clientY + 10,
                      }));
                    }}
                    className="text-[#9F9F9F] line-clamp-3"
                  >
                    {project.description}
                  </p>
                </div>
                {/* Tooltip */}
                {tooltip.show && (
                  <div
                    ref={tooltipRef}
                    className="fixed bg-neutral-800 text-white max-w-md p-4 rounded-xl pointer-events-none z-50 transition-opacity duration-200"
                    style={{
                      left: `${tooltip.x + 15}px`,
                      top: `${tooltip.y + 15}px`,
                      transform: "translate(0, 0)",
                      opacity: tooltip.show ? 1 : 0,
                    }}
                  >
                    {tooltip.content}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestWorks;
