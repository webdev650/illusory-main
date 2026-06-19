import React, { useRef } from "react";
import SafeImage from "../../../components/ui/SafeImage";
const projects = [
  {
    id: 1,
    title: "Pratyush K Rath",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066113/20250307-DSC_6708_sblpc0.jpg",
    description:
    "Every brand has a story waiting to be told, and for me, crafting that story is pure magic. Illusory is built on vision, creativity, and a touch of boldness – and we’re here to turn your dreams into realities that captivate.",
    tags:'CEO'
  },
  {
    id: 2,
    title: "Aparna Tripathy",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066109/Aparna_website-01_agwuid.jpg",
    description:
     "Illusory isn’t just a workplace; it’s a journey we take with every client. I’m here to make sure every detail aligns, every step flows, and every dream becomes something tangible. Together, we’re building more than brands; we’re building connections.",
    tags:'COO'
  },
  {
    id: 3,
    title: "Biswajit Nayak",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1781000990/20250307-DSC_6762.jpg_fyapdu.png",
    description:
      "To me, marketing is more than strategy – it’s finding that spark that makes people feel and connect. At Illusory, we don’t just promote; we create stories that linger. Let’s make your brand unforgettable, one bold idea at a time.",
    tags:'CMO'
  }
];
const Carousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const deltaX = e.clientX - startX.current;
    containerRef.current.scrollLeft = scrollLeftStart.current - deltaX;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <section
      
      className="min-h-screen py-[120px] w-full px-6 lg:px-20 flex justify-center"
    >
      <div className=" flex flex-col justify-between w-full max-w-7xl">
        <div>
          <p className="md:w-[400px]">
          Meet the Core Team -
          The engine behind Illusory, building brands that don’t just exist, but lead. Ideas get sharper, strategies get louder, and stories become unforgettable.
          </p>
        </div>
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{ scrollbarWidth: "none" }}
          className={`flex flex-col md:flex-row overflow-x-auto gap-11 font-jakartaSans mt-20 select-none ${
            isDragging.current ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-none w-full lg:w-[480px] group cursor-pointer "
            >
             
              <div className="relative w-full flex flex-col h-full">   
                <div className="relative w-full h-[300px] overflow-hidden">
                  <SafeImage id="image_works"
                    src={project.image}
                    fill
                    className="w-full h-full object-cover"
                    alt={project.title}
                    />
                </div>
                <div className="flex flex-col p-6 md:p-10 gap-4 flex-grow">
                  <h1 className="hidden md:flex text-[#9F9F9F] text-[14px]">
                   {project.tags}
                  </h1>
                  <h1 className="text-3xl md:text-[40px] w-full md:w-[90%] leading-[120%] tracking-[-1.24px] font-[700]">
                    {project.title}
                  </h1>
                  <p className="text-[#9F9F9F] line-clamp-none">{project.description}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
