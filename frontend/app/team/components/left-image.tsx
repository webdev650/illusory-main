"use client";
import SafeImage from "../../components/ui/SafeImage";
import { StaticImageData } from "next/image";
interface Slide {
  image: StaticImageData | string;
  categories?: string;
  title: string;
  description: string;
}

const SliderEffect: React.FC<Slide> = ({
  image,
  categories,
  title,
  description,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 h-full bg-black md:gap-20 items-center mt-20 md:mt-0 md:p-10">
        {/* Left Column - Image */}
        <div className="relative h-[360px] overflow-hidden">
          <SafeImage
            src={image}
            alt={title}
            fill
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6 w-full">
          <div className="hidden lg:flex text-sm text-[#9F9F9F] tracking-wider">
            {categories}
          </div>
          <h1 className="text-left font-jakartaSans text-[40px] md:text-5xl lg:text-[48px] font-bold leading-[120%] md:leading-[56px] tracking-[-1.6px] md:tracking-[-1.92px]">
            {title}
          </h1>
          <p className="text-left text-[#9F9F9F] text-lg w-full">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default SliderEffect;
