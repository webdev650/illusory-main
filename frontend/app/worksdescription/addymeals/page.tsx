import React from "react";
import Image from "next/image";
import Link from "next/link";

import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import addymealsLogo from "@/app/components/assets/ADDY Meals.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066104/Copy_of_addy_meals_movkup_xpopa0.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066133/Copy_of_addy_meals_avpnqq.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066145/Copy_of_addy_meals_rzn3mv.png",
];

const AddyMeals = () => {
  return (
    <>
      <WorksDesLayout
        logo={addymealsLogo}
        title="Savoring Health, One Bite at a Time"
        subtitle="Addy Meals isn’t just about healthy food—it’s a movement."
      />

      {/* DESCRIPTION SECTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          {/* TOP TEXT */}
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Addy Meals recognized the need for a fresh approach to healthy
              eating. In a world where convenience often compromises nutrition,
              they wanted to provide a solution that makes eating healthy both
              accessible and enjoyable.
            </p>

            <p className="max-w-2xl">
              Our task was to create a brand that reflected their vision—one that
              blends healthy, wholesome meals with an approachable and dynamic
              lifestyle. We began by capturing the essence of Addy Meals: the
              fusion of nutrition, convenience, and taste.
            </p>
          </div>

          {/* HORIZONTAL IMAGE SCROLL */}
          <HorizontalScroll images={images} />

          

          {/* BOTTOM TEXT */}
          <div className="w-full flex flex-col lg:flex-row gap-10 mt-12">
            <p className="max-w-2xl">
              Our branding was built on a strong color palette, with fresh greens
              and earthy tones representing natural ingredients, while the
              typography was sleek yet friendly, welcoming customers from all
              walks of life.
            </p>

            <p className="max-w-2xl">
              The visuals we created for Addy Meals weren’t just about food—they
              told a story. Each image and design reflected the platform’s
              commitment to improving the health of individuals through easy
              meal choices.
            </p>
          </div>
        </div>
      </section>

      {/* PREVIOUS / NEXT */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <h1 className="text-[#D4D4D4] opacity-50 text-2xl md:text-4xl lg:text-6xl font-[700] cursor-not-allowed">
              Previous project
            </h1>

            <Link
              href="/worksdescription/addyfitness"
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

export default AddyMeals;
