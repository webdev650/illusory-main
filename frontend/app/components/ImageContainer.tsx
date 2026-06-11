import React from 'react';
import SafeImage from './ui/SafeImage';
import { StaticImageData } from 'next/image';

interface ImageContainerProps {
  imageUrl: StaticImageData | string;
  alt?: string;
  objectFit?: "cover" | "contain";
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl, alt, objectFit = "cover" }) => {
  const isContain = objectFit === "contain" || (typeof imageUrl === "string" && imageUrl.includes("2_ox4slc.png"));
  return (
    <div className="relative w-[32rem] md:w-[40rem] h-[20rem] md:h-[25rem] overflow-hidden rounded-2xl bg-neutral-900/40">
      <SafeImage
        src={imageUrl}
        alt={alt || "Gallery image"}
        width={500}
        height={500}
        className={`w-full h-full ${isContain ? "object-contain bg-[#0a0a0a]" : "object-cover"}`}
      />
    </div>
  );
};

export default ImageContainer;