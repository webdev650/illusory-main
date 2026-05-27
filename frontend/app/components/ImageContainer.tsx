import React from 'react';
import SafeImage from './ui/SafeImage';
import { StaticImageData } from 'next/image';

interface ImageContainerProps {
  imageUrl: StaticImageData | string;
  alt?: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl, alt }) => {
  return (
    <div className="relative w-[32rem] md:w-[40rem] h-[20rem] md:h-[25rem] overflow-hidden rounded-2xl">
      <SafeImage
        src={imageUrl}
        alt={alt || "Gallery image"}
        width={500}
        height={500}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageContainer;