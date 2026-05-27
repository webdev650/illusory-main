'use client'
import React from 'react';
import ImageContainer from './ImageContainer';
import { StaticImageData } from 'next/image';
import ImageMarquee from "react-fast-marquee";

interface HorizontalScrollProps {
  images: (StaticImageData | string)[]; 
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ images }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="mt-24 lg:mt-32 w-full flex items-center">
        <ImageMarquee 
          gradient={false} 
          speed={60} 
          pauseOnHover={true}
          className="overflow-hidden"
        >
          <div className="flex gap-8 lg:gap-16 px-4 py-10">
            {images.map((image, index) => (
              <div
                key={index}
                className="transform transition-transform duration-500 hover:scale-[1.02]"
              >
                <ImageContainer imageUrl={image} />
              </div>
            ))}
          </div>
        </ImageMarquee>
      </div>
    </section>
  );
};

export default HorizontalScroll;
