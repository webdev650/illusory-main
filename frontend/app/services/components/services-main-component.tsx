"use client";
import React, { useRef, useState } from "react";
import SafeImage from "../../components/ui/SafeImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
interface  Cards {
  logo: string
  title: string
  description: string
}

interface CarouselProps {
  title: string
  body: string
  cards: Cards[]
}

const Carousel:  React.FC<CarouselProps> = ({title,body,cards}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
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
  return (
    <section  className="section-class">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col gap-6">
          <h1 className="font-jakartaSans text-[52px] md:text-[56px] tracking-[-1.12px] font-[700] leading-[56px]">{title}</h1>
          <p className="w-full text-[18px] md:w-[40%]  text-[#9F9F9F]">
            {body}
          </p>
        </div>
        <div className="py-24">
          <div className="max-w-7xl mx-auto ">
            <div
              ref={carouselRef}
              className="flex flex-col md:flex-row overflow-x-auto gap-6 scroll-smooth  snap-x snap-mandatory scrollbar-hide"
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex-none group snap-center "
                >
                  <div className="relative overflow-hidden">
                    <div className="w-full md:w-[560px] border-[1px] border-[#D9D9D9] rounded-2xl flex flex-col justify-end">
                        <SafeImage src={card.logo} width={400} height={400} className="w-full h-[400px] object-cover rounded-t-[inherit]" alt=""/>
                      <div className="flex flex-col gap-6 p-6 md:p-10 ">
                      <h3 onMouseEnter={(e) => showTooltip(e, card.title)}
                    onMouseLeave={hideTooltip}
                    onMouseMove={(e) => {
                      setTooltip((prev) => ({
                        ...prev,
                        x: e.clientX + 10,
                        y: e.clientY + 10,
                      }));
                    }}  className="text-[40px] leading-[120%] font-[700] font-jakartaSans line-clamp-1">
                        {card.title}
                      </h3>
                      <p onMouseEnter={(e) => showTooltip(e, card.description)}
                    onMouseLeave={hideTooltip}
                    onMouseMove={(e) => {
                      setTooltip((prev) => ({
                        ...prev,
                        x: e.clientX + 10,
                        y: e.clientY + 10,
                      }));
                    }} className="text-[#9F9F9F] line-clamp-3">{card.description}</p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
