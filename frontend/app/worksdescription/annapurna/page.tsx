import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import {
  annapurna1,
  annapurna2,
  annapurna3,
} from "@/app/config/workdescription";
import annapurnaLogo from "../../components/assets/Annapurna-01.svg";
import Link from "next/link";
import React from "react";
import HorizontalScroll from "@/app/components/HorizontalScroll";

const Annapurna = () => {
  // ✅ CLOUDINARY IMAGES
  const images = [
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066100/Copy_of_annapurna_bakery_mockup_ad93tu.png",
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066168/Copy_of_Annapurna_bakery_2_pmbcrm.png",
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066167/Copy_of_Annapurna_Bakery_black_whu8zn.png",
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066145/Copy_of_annapurna_bakery_it5ua6.png",
  ];
  return (
    <>
      <WorksDesLayout
        logo={annapurnaLogo}
        title="A Recipe for Brand Sweetness"
        subtitle=" Annapurna Bakery is about crafting an experience through strategic branding, creative packaging, and mouthwatering visuals."
      />
      <section className="section-class">
        <div className="max-w-7xl w-full">
          <p className="max-w-2xl">
            Annapurna Bakery came to us with a simple but powerful goal — to
            refresh their identity and align their visuals with the warmth,
            tradition, and joy their baked goods deliver every day. Known for
            serving delightful treats that connect generations, they needed a
            brand that felt just as memorable as the flavors they craft.
          </p>
          <p className="mt-10 max-w-2xl">
            We started by diving into the heart of their story — a legacy rooted
            in authenticity, family recipes, and community connection. With that
            foundation, we developed a distinct visual identity that blended
            timeless charm with modern appeal. From soft, inviting colors to
            refined typography and iconography, every detail of the brand was
            carefully selected to evoke trust, warmth, and appetite.
          </p>
     <HorizontalScroll images={images}/>
          <p className="mt-20 max-w-2xl">
            At the center of it all stood the logo — a signature mark that
            captures the essence of the Annapurna experience: homely yet
            premium, traditional yet timeless. The mark wasn’t just designed to
            look good on packaging; it was created to be remembered — whether on
            a cake box, a storefront, or a digital platform.
          </p>
          <p className="mt-10 max-w-2xl">
            This transformation gave Annapurna a consistent, professional
            identity that resonates deeply with both loyal customers and new
            audiences. Now, every bite feels just a little more special —
            because the brand behind it finally looks as good as it tastes.
          </p>
        </div>
      </section>
      <section className="flex  w-full justify-center  px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans">
          <div className="py-[120px]">
            <div className="flex justify-between">
              <Link
                href="/worksdescription/addyfitness"
                className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl lg:tracking-[-2.24px] font-[700]"
              >
                Previous project
              </Link>
              <Link
                href="/worksdescription/salty"
                className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl lg:tracking-[-2.24px] font-[700]"
              >
                Next project
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </>
  );
};

export default Annapurna;
