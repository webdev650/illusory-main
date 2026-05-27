"use client";
import SafeImage from "../../components/ui/SafeImage";
import { StaticImageData } from "next/image";
interface Slide {
  image: StaticImageData | string;
  categories?: string;
  title: string;
  description: string;
}

const RightImage: React.FC<Slide> = ({
  image,
  categories,
  title,
  description,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 bg-black md:gap-20 items-center mt-20 md:mt-0 md:p-10">
        {/* Left Column - Image */}
        <div className="order-2 md:order-1 space-y-6 ">
          <div className="hidden lg:flex text-sm text-[#9F9F9F] tracking-wider">
            {categories}
          </div>
          <h1 className="text-left font-jakartaSans text-[40px] md:text-5xl lg:text-[48px] font-bold leading-[120%] md:leading-[56px] tracking-[-1.6px] md:tracking-[-1.92px]">
            {title}
          </h1>
          <p className="text-left text-[#9F9F9F] text-lg w-full ">
            {description}
          </p>
        </div>

        {/* Right Column - Content */}
        <div className="order-1 md:order-2 relative h-[360px] bg-gray-100 overflow-hidden">
          <SafeImage
            src={image}
            alt={title}
            fill
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default RightImage;
