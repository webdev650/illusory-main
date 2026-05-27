import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import odisharealityLogo from "../../components/assets/OdishaRealty-01.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066097/Copy_of_odisha_realty_mockup_bjkppv.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066144/Copy_of_Odisha_Realty_z2eldq.png",
];

const Odishareality = () => {
  return (
    <>
      <WorksDesLayout
        logo={odisharealityLogo}
        title="When Luxury Speaks Louder Than Words"
        subtitle="Forget subtlety. This brand isn’t whispering; it’s shouting luxury and trust."
      />

      {/* DESCRIPTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              For Odisha Realty, it wasn’t just about selling premium
              properties—it was about creating a lasting impression in a market
              filled with competition. They needed a brand presence that
              reflected both luxury and trust.
            </p>

            <p className="max-w-2xl">
              We crafted a sophisticated brand identity where every detail—
              color palettes, typography, and layout—was chosen to communicate
              elegance without sacrificing approachability.
            </p>
          </div>

          {/* HORIZONTAL SCROLL */}
          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              Each visual asset was designed to evoke aspiration, confidence,
              and professionalism. Clean layouts and refined aesthetics helped
              position Odisha Realty as a premium developer.
            </p>

            <p className="max-w-2xl">
              The result was a strong digital transformation. Their social media
              became a high-end digital showroom, attracting an audience that
              values fine living and dependable brands.
            </p>
          </div>

        </div>
      </section>

      {/* PREVIOUS / NEXT */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/annscafe"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>

            <Link
              href="/worksdescription/puraanesikke"
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

export default Odishareality;
