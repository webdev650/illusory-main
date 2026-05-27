import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import spectrumLogo from "@/app/components/assets/Spectrum-01.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_spectrum_windows_kvfufv.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066139/Copy_of_Spectrum_s8aoad.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066126/Copy_of_Spectrum_lszk7m.png",
];

const SpectrumWindows = () => {
  return (
    <>
      <WorksDesLayout
        logo={spectrumLogo}
        title="What’s the Art Everyone’s Peeking At?"
        subtitle="Spectrum Windows didn’t just make frames—they made jaws drop. We whipped up cool, bold visuals that mix style and use, turning posts into eye-catching experiences."
      />

      {/* DESCRIPTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              When Spectrum Windows came to us, they didn’t just want to sell
              windows—they wanted to make a statement. Their window solutions
              were the perfect balance of functionality and design, but the
              challenge was turning something as simple as windows into a
              product people would care about. That’s where we came in.
            </p>

            <p className="max-w-2xl">
              Our first step was to rethink how windows could be presented—
              focusing on both their aesthetic appeal and practical benefits.
              We didn’t just want to show windows; we wanted to make them the
              hero of the design. So, we crafted sleek, modern visuals that
              captured the elegance, style, and versatility of their products.
            </p>
          </div>

          {/* HORIZONTAL IMAGE SCROLL */}
          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              The results were stunning. Their social media transformed from a
              basic showcase to a dynamic visual story. Posts no longer just
              highlighted windows; they made windows the focal point of every
              conversation. Engagement soared, with customers and followers drawn
              to the brand’s unique combination of quality, design, and innovation.
            </p>

            <p className="max-w-2xl">
              Spectrum Windows wasn’t just selling windows anymore—they were
              creating an experience. Through our design, we helped them position
              themselves as the go-to brand for those who valued beauty and
              functionality in their home solutions.
            </p>
          </div>

        </div>
      </section>

      {/* PREVIOUS / NEXT */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/mco"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>

            <Link
              href="/worksdescription/styletrends"
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

export default SpectrumWindows;
