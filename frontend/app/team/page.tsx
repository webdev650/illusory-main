import React from "react";
import { App } from "../components/App";
import RightImage from "./components/right-image-card";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
const teamOne = "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066114/20250307-DSC_6791_1_m2aip4.jpg";
const teamTwo = "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066107/team2-01_utxidr.jpg";
const teamThree = "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066108/20250307-DSC_6796_bfis9v.jpg";
const teamFour = "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066111/20250307-DSC_6676_fuateg.jpg";

import SliderEffect from "./components/left-image";
import CircleStack from "../components/Circlestack";

// Slide data array

const Team = () => {
  return (
    <>
      <App
        head1="Be part of a"
        head2="great team,"
        head3="but work."
        head4=""
      />
      <section className="section-class pb-[120px]">
        <div className="w-full max-w-7xl flex flex-col gap-6 md:gap-20">
          <p className="md:w-[480px] font-general">
            Meet the masterminds of Illusory Design Studios—plotting chaos,
            hijacking “what ifs,” and unleashing “watch this” magic. We torch
            the box, splash it with neon, and blast it to the stars, all while
            cackling over bold ideas and epic vibes.
          </p>
         

          <SliderEffect
            image={teamOne}
            categories="01/"
            title="Not Just a Team—But a Creative Conspiracy."
            description="We’re a crew of visionaries, idea wizards, and relentless dreamers who turn “what if” into “watch this.” The spark, the fire, and the team that doesn’t just think outside the box—we redesign it, paint it neon, and shoot it into orbit. Every day’s a mission to create, collaborate, and celebrate."
          />
          <RightImage
            image={teamTwo}
            categories="02/"
            title="The Visionaries, Story Spinners, and Tech Wizards."
            description="Our masterminds see tomorrow before it arrives. Designers and strategists don’t just sketch—they sculpt living brands. Wordsmiths and campaign gurus ignite ideas that stick, spinning viral hooks and heartfelt tales. And behind the scenes, our tech trailblazers turn wild ideas into apps and sites that wow."
          />
          {/* Slider : 3 */}
          <SliderEffect
            image={teamThree}
            categories="03/"
            title="The Glue That Shines."
            description="Our unsung heroes—the organizers, cheerleaders, and doers—keep the chaos in check. Juggling deadlines and hyping us up, they elevate every win and keep our engine roaring."
          />

          {/* Slider : 4 */}

          <RightImage
            image={teamFour}
            categories="04/"
            title="Chaos? We Own It."
            description="From epic campaigns to jaw-dropping events, we thrive in the storm. We orchestrate with laughs, high-fives, and a dash of madness that turns dreams into reality."
          />
   
       

        </div>
      </section>
     <CircleStack/>
      <FAQ />
      <Footer />
    </>
  );
};

export default Team;
