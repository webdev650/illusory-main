import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import {
  styletrends1,
  styletrends2,
  styletrends3,
} from "@/app/config/workdescription";
import addyfitnessLogo from "../../components/assets/StyleTrends-01.svg";
import React from "react";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import HorizontalScroll from "@/app/components/HorizontalScroll";

const StyleTrends = () => {
  const images = [
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_style_trends_mockup_xkq7sr.png",
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066140/Copy_of_Style_Trends_odh6ee.png",
    "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066128/Copy_of_Style_Trends_kcbtaj.png",
  ];

  return (
    <>
      <WorksDesLayout
        logo={addyfitnessLogo}
        title="What’s Turning Heads Near You?"
        subtitle="Style Trends wasn’t just looking for a rebrand—they wanted a transformation that turned their salon into a luxury experience."
      />
      <section className="section-class">
        <div className="max-w-7xl w-full">
        <div className='w-full flex flex-col lg:flex-row gap-10'>
          <p className="max-w-2xl">
            In a crowded beauty industry, Style Trends Unisex Salon wanted to
            stand out by offering a premium salon experience. But to attract the
            right audience, they needed a digital presence that clearly
            reflected their quality and professionalism.
          </p>
          <p className="max-w-2xl">
            Our team stepped in to manage their social media designs,
            advertising posters, and overall digital communication. We created
            clean, stylish visuals that matched the brand&apos;s high-end
            services, maintaining consistency across all platforms. From daily
            feed posts to festive campaigns and limited-time offers, each design
            was crafted to highlight their work in the most appealing way.
          </p>
          </div>
          <HorizontalScroll images={images}/>
          <div className='w-full flex flex-col lg:flex-row gap-10'>
          <p className="max-w-2xl">
            In addition to design, we handled their social media management,
            ensuring timely posting, community interaction, and strategic
            content planning. Our team also launched targeted social media ads
            to reach potential clients who valued style, service, and
            quality—just like Style Trends offered.
          </p>
          <p className="max-w-2xl">
            The impact was clear. Online engagement improved significantly, and
            the salon began attracting a more refined customer base. Clients
            were not just scrolling—they were booking appointments, visiting the
            salon, and sharing their experiences online.
          </p>
          </div>
        </div>
      </section>
      <section className="flex  w-full justify-center  px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans">
          <div className="py-[120px]">
            <div className="flex justify-between">
              <Link
                href="/worksdescription/spectrum"
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

export default StyleTrends;
