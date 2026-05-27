import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import FallbackLogo from "../../components/assets/Company logo.svg";

const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066129/Copy_of_vyapaarveda_ls4hmx.png",
];

const Vyapaarveda = () => {
  return (
    <>
      <WorksDesLayout
        logo={FallbackLogo}
        title="Empowering Business Growth"
        subtitle="Vyapaar Veda is dedicated to helping businesses scale through strategic planning and financial wisdom."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Vyapaar Veda required a brand identity that conveyed trust, wisdom, and modern business acumen. 
              Our task was to create a visual system that resonated with entrepreneurs and established businesses alike.
            </p>
            <p className="max-w-2xl">
              We blended traditional wisdom with modern design principles, creating a brand that stands for stability and innovation.
            </p>
          </div>

          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              The new branding helped Vyapaar Veda establish a strong presence in the business consulting market, 
              attracting high-value clients and partnerships.
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/zomaland"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>
            <Link
              href="/worksdescription/mco"
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

export default Vyapaarveda;
