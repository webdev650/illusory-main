import React from "react";
import Link from "next/link";
import Image from "next/image";

import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import addyfitnessLogo from "@/app/components/assets/ADDY Fitness.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066107/Copy_of_addy_fitness_mockup_x3cdpx.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066138/Copy_of_addy_fitness_bpyg09.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_addy_fitness_on3oo0.png",
];

const AddyFitness = () => {
  return (
    <>
      <WorksDesLayout
        logo={addyfitnessLogo}
        title="Fitness Revolution in Motion"
        subtitle="Addy Fitness is redefining what it means to be fit."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Addy Fitness came to us with a challenge: create a brand that speaks to the modern athlete. 
              Fitness is more than just working out—it’s a mindset, a journey, and a way of life.
            </p>

            <p className="max-w-2xl">
              We developed a visual identity that is both powerful and motivating. 
              By blending high-contrast colors with sleek typography, we captured the intensity and focus required in the gym.
            </p>
          </div>

          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              Our strategy included a complete social media overhaul and a community-focused branding approach. 
              The result was a significant increase in membership and a highly engaged fitness community.
            </p>

            <p className="max-w-2xl">
              The visuals we created weren't just about showing muscles; they were about showing the discipline and dedication 
              that Addy Fitness stands for.
            </p>
          </div>
        </div>
      </section>

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
              href="/worksdescription/annapurna"
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

export default AddyFitness;
