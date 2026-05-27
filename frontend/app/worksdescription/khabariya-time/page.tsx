import React from "react";
import Link from "next/link";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";

import { cleanCloudinaryUrl } from "../../lib/cloudinary";

const KhabariyaTime = () => {
  const videoUrl = cleanCloudinaryUrl("https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066153/Copy_of_Copy_of_Khabariya_Time_ok2yar.mp4");

  return (
    <>
      <WorksDesLayout
        logo={null} // No logo for this project
        title="Khabariya Time"
        subtitle="A dynamic news platform branding with high-energy motion graphics."
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl">
              Khabariya Time required a visual identity that could match the fast-paced nature of digital news. 
              We developed a complete motion graphics package that included lower thirds, transitions, and intro sequences.
            </p>
            <p className="max-w-2xl">
              The focus was on clarity, authority, and engagement, ensuring that viewers remain hooked to the updates.
            </p>
          </div>

          <div className="mt-20 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <video 
              src={videoUrl}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-10 mt-20">
            <p className="max-w-2xl">
              By implementing this new visual standard, Khabariya Time saw a significant boost in viewership and social media shares, 
              positioning them as a modern leader in regional news.
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between">
            <Link
              href="/worksdescription/sezzle"
              className="hover:text-[#D4D4D4] hover:opacity-50 transition duration-500 text-2xl md:text-4xl lg:text-6xl font-[700]"
            >
              Previous project
            </Link>
            <Link
              href="/worksdescription/katha"
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

export default KhabariyaTime;
