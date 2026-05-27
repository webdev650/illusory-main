import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

import MCOLogo from "../../components/assets/MCO.svg";

// ✅ CLOUDINARY IMAGES
const images = [
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066193/MCO_1799_ad_vy0rgn.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066164/Copy_of_MCO_black_lmw23e.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066164/Copy_of_MCO_ap0uma.png",
  "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_MCO_ep8zwv.png",
];

const MCO = () => {
  return (
    <>
      <WorksDesLayout
        logo={MCOLogo}
        title="A Vision for a Greener Tomorrow"
        subtitle="My City Odisha isn’t just building townships—it’s shaping the future of sustainable living."
      />

      {/* DESCRIPTION */}
      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">

          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              For My City Odisha, the challenge was clear: showcase InfoGreen City
              as more than just a place to live, but as a vision for a sustainable
              and luxurious future. Our task was to communicate this vision
              through powerful digital design and immersive visuals.
            </p>

            <p className="max-w-2xl">
              We approached this challenge with a full-spectrum campaign,
              blending video editing, graphic design, and cutting-edge digital
              marketing strategies. Sustainability was the core message, but we
              transformed it into an experience that truly resonated.
            </p>
          </div>

          {/* HORIZONTAL SCROLL */}
          <HorizontalScroll images={images} />

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-10">
            <p className="max-w-2xl">
              To bring the project to life, we incorporated immersive VR and
              drone shoots, offering potential homeowners a firsthand look at
              the beauty of InfoGreen City. Virtual tours and aerial visuals
              helped audiences envision a luxurious yet eco-conscious future.
            </p>

            <p className="max-w-2xl">
              The results were exceptional. InfoGreen City’s digital presence
              skyrocketed, increasing engagement and inquiries while
              positioning the brand as a market leader in sustainable real
              estate.
            </p>
          </div>

        </div>
      </section>

      {/* NAVIGATION */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/puraanesikke"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>

            <Link
              href="/worksdescription/spectrum"
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

export default MCO;
