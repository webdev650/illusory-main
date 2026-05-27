import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import SezzleLogo from "../../components/assets/sezzle.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066091/Copy_of_sezzle_mockup_agwvwl.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066137/Copy_of_sezzle_rokmd1.png",
];

const Sezzle = () => {
  return (
    <>
      <WorksDesLayout
        logo={SezzleLogo}
        title="Buy Now, Smile Now"
        subtitle="Sezzle empowers consumers with flexible payment solutions. We helped translate their mission into a vibrant digital brand."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Sezzle is at the forefront of the fintech revolution, and our task was to make their 'Buy Now, Pay Later' service feel accessible, trustworthy, and modern.
            </p>
            <p className="max-w-2xl">
              We developed a visual strategy that emphasized financial empowerment and ease of use, aligning with Sezzle's mission to support young consumers.
            </p>
          </div>

          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              The results were a more cohesive brand presence across all digital channels, driving user adoption and trust in a competitive market.
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/swiggy"
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

export default Sezzle;
