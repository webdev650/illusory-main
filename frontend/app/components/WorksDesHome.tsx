import SafeImage from "./ui/SafeImage";
import { StaticImageData } from "next/image";
import React from "react";
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
    <section className="h-[100vh] lg:h-[calc(100vh-72px)] w-full flex justify-center px-6 lg:px-20 py-20">
      <div className="max-w-7xl w-full ">
        <div className="flex items-end h-full">
          <div className="flex flex-col gap-10">
            {logo && (
              <div className="w-48 relative h-12">
                {typeof logo === 'string' ? (
                  <SafeImage src={logo} alt="" fill className="object-contain object-left"/>
                ) : (
                  <SafeImage src={logo} alt="" className="w-auto h-auto"/>
                )}
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
