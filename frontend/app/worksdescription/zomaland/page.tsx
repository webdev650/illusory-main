import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import ZomalandLogo from "../../components/assets/zomaland.svg";

const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066178/center_full_view_fuxyrn.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066177/box_office_tickets_aiqwpt.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066177/concert_branding_ivgubc.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066176/circle_rotation_wheel_uau98k.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066205/artist_on_stage_kergof.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066204/branding_p7sm8z.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066204/sitting_area_set_bsvdrj.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066202/Gf_stage_set_up_csc6hg.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066202/samay_entry_v2vbjw.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066129/Copy_of_zomaland_t6lzui.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066140/Copy_of_zomaland_ptnkjw.png",
];

const Zomaland = () => {
  return (
    <>
      <WorksDesLayout
        logo={ZomalandLogo}
        title="The Ultimate Food Festival"
        subtitle="Zomaland is a celebration of food, music, and fun. We brought the carnival to life."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Zomaland is where culinary delight meets high-energy entertainment. 
              Our mission was to create a digital experience that mirrored the physical excitement of the festival.
            </p>
            <p className="max-w-2xl">
              From vibrant social media campaigns to immersive on-ground visuals, 
              we ensured that every touchpoint of Zomaland was a feast for the eyes.
            </p>
          </div>

          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              The festival saw record-breaking attendance, with our digital strategies 
              driving unprecedented engagement and brand recall for the Zomato ecosystem.
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/ampverse"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>
            <Link
              href="/worksdescription/vyapaarveda"
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

export default Zomaland;
