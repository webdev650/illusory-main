import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import PuraaneSikkeLogo from "../../components/assets/PuraaneSikke-01.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066095/Copy_of_puraane_sikke_mockup_r5sxjk.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066146/Copy_of_puraane_sikke_rvkvk6.png",
];

const PuraaneSikke = () => {
  return (
    <>
      <WorksDesLayout
        logo={PuraaneSikkeLogo}
        title="Who’s Snagging Performing Hearts?"
        subtitle="Puraane Sikke isn’t just a show—it’s a wildfire of feels, now blazing online. We snatched the raw thrill of live art."
      />

      {/* DESCRIPTION SECTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          {/* Intro Paragraphs */}
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              For Puraane Sikke, performing arts were more than just a stage
              act—they were a journey of expression, emotion, and connection
              with their audience. Their live shows were electric, brimming
              with the kind of raw energy that made every performance
              unforgettable. In today’s digital world, the challenge was how
              to bring that same vibrant energy online.
            </p>

            <p className="max-w-2xl">
              Our task was to capture the essence of Puraane Sikke’s electrifying
              live shows and translate it into dynamic digital content. We crafted
              eye-catching social media posts using vibrant colors, bold typography,
              and striking imagery to convey the intensity of their performances.
            </p>
          </div>

          {/* HORIZONTAL SCROLL */}
          <HorizontalScroll images={images} />

          {/* Story / Results Paragraphs */}
          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              Through creative storytelling, we emphasized the passion, dedication,
              and artistry of their performers. Each design invited fans into the
              world of Puraane Sikke, making them feel as though they were
              experiencing the performance in real-time.
            </p>

            <p className="max-w-2xl">
              By translating the soul of Puraane Sikke’s live performances into
              digital content, we successfully turned their social media into a
              vibrant, interactive extension of the stage—amplifying their reach
              and creating a lasting emotional connection with a global audience.
            </p>
          </div>

        </div>
      </section>

      {/* PREVIOUS / NEXT NAVIGATION */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/odishareality"
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

export default PuraaneSikke;
