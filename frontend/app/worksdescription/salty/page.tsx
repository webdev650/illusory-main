import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import saltyLogo from "@/app/components/assets/salty.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066093/Copy_of_salty_mockup_awmb1y.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066161/Copy_of_salty_uxmu0v.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066160/Copy_of_salty_black_exs9cd.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_Salty_ejrj5u.png",
];

const Salty = () => {
  return (
    <>
      <WorksDesLayout
        logo={saltyLogo}
        title="Jewelry That Captivates"
        subtitle="Your one-stop creative powerhouse, redefining what’s possible for brands across different industries."
      />

      {/* DESCRIPTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              When SALTY, a luxury jewelry brand, approached us, their goal was clear—they wanted to elevate their social media presence, showcasing their pieces not just as accessories but as expressions of art and elegance. They needed more than just product images; they needed visuals that told a story and created a connection with their discerning audience.
            </p>

            <p className="max-w-2xl">
              To solve this, we crafted a social media strategy that focused on visual storytelling. Every post became a work of art, where the beauty of each jewelry piece was highlighted through minimalist elegance and sophisticated design. We carefully showcased intricate details, like engravings.
            </p>
          </div>

          {/* HORIZONTAL SCROLL */}
          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              The result was a remarkable transformation of SALTY’s social media. It wasn’t just a display of jewelry—it became a curated experience that resonated with the audience.
            </p>

            <p className="max-w-2xl">
              Engagement surged as customers not only admired the posts but engaged with them, sharing, commenting, and connecting with the brand’s narrative of refined luxury. Through our creative visuals, we helped SALTY establish itself as the ultimate symbol of taste and elegance in the world of high-end jewelry.
            </p>
          </div>

        </div>
      </section>

      {/* NAVIGATION */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/styletrends"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>

            <Link
              href="/worksdescription/desifunkaar"
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

export default Salty;
