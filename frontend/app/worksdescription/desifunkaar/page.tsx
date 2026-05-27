import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import desifunkaarLogo from "@/app/components/assets/Desi Funkaar.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066097/Copy_of_desi_funkaar_mockup_vwhzt8.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066167/Copy_of_desi_funkaar_f3yulw.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066166/Copy_of_Desi_funkaars_black_mitzws.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_desi_funkaars_txkfxv.png",
];

const DesiFunkaar = () => {
  return (
    <>
      <WorksDesLayout
        logo={desifunkaarLogo}
        title="India’s Culture, Minted into the Digital Future"
        subtitle="Desi Funkaars isn’t just creating NFTs—it’s preserving culture in the digital age."
      />

      {/* DESCRIPTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              The Desi Funkaars weren’t just creating NFTs—they were crafting a
              new cultural narrative. Their vision was to merge the rich,
              colorful heritage of India with the cutting-edge world of digital
              art. This wasn’t merely about pixels; it was about preserving and
              showcasing India’s soul in a modern, immersive format.
            </p>

            <p className="max-w-2xl">
              We collaborated to create a distinctive collection of NFTs that
              went beyond digital assets—they were cultural masterpieces. Each
              piece was meticulously designed with vibrant colors, intricate
              patterns, and symbolic elements rooted in Indian tradition.
            </p>
          </div>

          {/* HORIZONTAL SCROLL */}
          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              As the collection gained momentum, it sparked conversations not
              just among collectors but across communities worldwide. People
              weren’t just buying art—they were collecting fragments of
              India&apos;s legacy, beautifully reimagined for a digital-first
              generation.
            </p>

            <p className="max-w-2xl">
              Desi Funkaars stands as a fusion of tradition and technology—where
              culture meets creativity on the blockchain. It wasn’t just an NFT
              drop; it was a digital renaissance.
            </p>
          </div>

        </div>
      </section>

      {/* NAVIGATION */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/salty"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>

            <h1 className="text-[#D4D4D4] opacity-50 text-2xl md:text-4xl lg:text-6xl font-[700]">
              Next project
            </h1>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </>
  );
};

export default DesiFunkaar;
