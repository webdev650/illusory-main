import React from "react";
import Link from "next/link";
import Image from "next/image";

import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import annscafeLogo from "@/app/components/assets/Ann_s Cafe.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066141/Copy_of_Ann_s_cafe_dfnujk.png",
];

const AnnsCafe = () => {
  return (
    <>
      <WorksDesLayout
        logo={annscafeLogo}
        title="What’s Tugging at Your Tummy?"
        subtitle="Anns Café's charm isn't just in its ovens—it's in the experience."
      />

      {/* DESCRIPTION SECTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          {/* FIRST TEXT ROW */}
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Anns Café & Bakery had long been a beloved local hotspot, known for
              its inviting ambiance, rich aroma of freshly baked goods, and
              friendly atmosphere. As the café grew, the owners realized they
              needed a digital presence that could replicate the cozy, welcoming
              feel for a wider audience.
            </p>

            <p className="max-w-2xl">
              Our approach began with understanding the heart of Anns Café—the
              warmth, the sense of community, and the irresistible allure of
              their baked goods. We crafted a digital presence that mirrored the
              experience customers loved in-store.
            </p>
          </div>

          {/* HORIZONTAL IMAGE SCROLL */}
          <HorizontalScroll images={images} />

          
          {/* SECOND TEXT ROW */}
          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              Our team designed social media visuals that highlighted their
              mouthwatering cakes, pastries, and breads—turning every post into
              a visual feast. Storytelling was at the core of every campaign.
            </p>

            <p className="max-w-2xl">
              As a result, Anns Café’s online presence flourished. Engagement
              surged, foot traffic increased, and the community felt more
              connected—both online and offline.
            </p>
          </div>
        </div>
      </section>

      {/* PREVIOUS / NEXT */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/addyfitness"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>

            <Link
              href="/worksdescription/odishareality"
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

export default AnnsCafe;
