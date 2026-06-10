import SafeImage from "./ui/SafeImage";
import { StaticImageData } from "next/image";
import React from "react";
import BackToWorks from "./BackToWorks";

interface WorksDesHomeProps {
  logo?: StaticImageData | string | null;
  title: string;
  subtitle: string;
}

const WorksDesHome: React.FC<WorksDesHomeProps> = ({
  logo,
  title,
  subtitle,
}) => {
  return (
    <section className="h-[100vh] lg:h-[calc(100vh-72px)] w-full flex justify-center px-6 lg:px-20 pt-20 pb-20 lg:pt-4 lg:pb-20">
      <div className="max-w-7xl w-full flex flex-col justify-between h-full">
        <div className="pointer-events-auto pt-4">
          <BackToWorks />
        </div>
        <div className="flex items-end">
          <div className="flex flex-col gap-10">
            {logo && (
              <div className="w-[500px] max-w-full relative h-36">
                <SafeImage src={logo} alt="" fill className="object-contain object-left" priority={true} />
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-jakartaSans font-[700] md:tracking-[-2.56px] md:leading-[72px] max-w-2xl">
              {title}
            </h1>
            <p className="w-full lg:w-[400px]">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksDesHome;
