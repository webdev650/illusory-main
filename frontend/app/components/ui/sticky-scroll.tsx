'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, Palette, Brush, Sparkles } from 'lucide-react';
import One from "../assets/images/item 01.png"
import Image from 'next/image';

const StickyScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: Camera,
      title: "Photography",
      description: "Professional photography services that capture the essence of your brand. We specialize in product, portrait, and event photography.",
    },
    {
      icon: Palette,
      title: "Digital Design",
      description: "Creative digital design solutions that bring your vision to life. From web design to branding, we've got you covered.",
    },
    {
      icon: Brush,
      title: "Illustration",
      description: "Custom illustrations that tell your story. Our artists create unique visuals that engage and inspire.",
    },
    {
      icon: Sparkles,
      title: "Animation",
      description: "Bringing ideas to life through motion. We create engaging animations that captivate your audience.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollPosition = window.scrollY - container.offsetTop;
      const sectionHeight = window.innerHeight;

      let newIndex = Math.floor(scrollPosition / sectionHeight);
      newIndex = Math.max(0, Math.min(newIndex, services.length - 1));

      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [services.length]);

  return (
    <section className="min-h-screen">
      {/* Sticky Scroll Section */}
      <div ref={containerRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center space-x-10">
          {/* Image Section */}
          <div className="w-1/2 h-auto max-h-[600px] rounded-2xl overflow-hidden">
            <Image src={One} alt='' layout="responsive" />
          </div>

          {/* Content Section */}
          <div className="w-1/2 relative">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out transform ${
                    index === activeIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-16'
                  }`}
                >
                  <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl mx-auto">
                    <Icon className="w-12 h-12 text-purple-500 mb-4" />
                    <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StickyScroll;
