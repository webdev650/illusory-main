import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import AmpverseLogo from "../../components/assets/Ampverse.svg";

const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066135/Copy_of_ampverse_edlivk.png",
];

const Ampverse = () => {
  return (
    <>
      <WorksDesLayout
        logo={AmpverseLogo}
        title="Gaming and Lifestyle Redefined"
        subtitle="Ampverse is leading the charge in gaming culture and lifestyle, creating immersive experiences."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Ampverse came to us with a vision to revolutionize the gaming landscape in Southeast Asia. 
              Our challenge was to capture the energy of gaming culture while maintaining a premium lifestyle brand feel.
            </p>
            <p className="max-w-2xl">
              We developed a visual language that speaks to both hardcore gamers and lifestyle enthusiasts, 
              bridging the gap through dynamic content and strategic branding.
            </p>
          </div>

          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              By focusing on community engagement and high-impact visuals, we helped Ampverse establish 
              itself as a dominant force in the esports and gaming entertainment industry.
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/desifunkaar"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>
            <Link
              href="/worksdescription/zomaland"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Next project
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </>
  );
};

export default Ampverse;
