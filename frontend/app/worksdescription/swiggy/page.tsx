import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import SwiggyLogo from "../../components/assets/Swiggy.svg";

const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066215/swiggy_1_nthhv5.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066215/swiggy_2_ka9upq.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066215/swiggy_3_vwhhro.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066207/swiggy_4_nf0ey6.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066138/Copy_of_Swiggy_uglgcx.png",
];

const Swiggy = () => {
  return (
    <>
      <WorksDesLayout
        logo={SwiggyLogo}
        title="Delivering Happiness"
        subtitle="Our collaboration with Swiggy focused on enhancing the visual narrative of food delivery."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Swiggy redefined convenience in India, and we had the privilege of contributing to their visual identity. 
              Our work focused on making the food delivery experience as delightful visually as it is practically.
            </p>
            <p className="max-w-2xl">
              We created high-impact visuals that resonate with the urban lifestyle, emphasizing speed, variety, and reliability.
            </p>
          </div>

          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              The campaigns we designed saw significant engagement across digital platforms, 
              further solidifying Swiggy's position as the go-to app for every craving.
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/annscafe"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>
            <Link
              href="/worksdescription/sezzle"
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

export default Swiggy;
