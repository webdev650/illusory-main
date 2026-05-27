'use client'
import Image from "next/image";
import annapurna from "./assets/images/Annapurna bakery.png";
import salty from "./assets/images/salty.png";
import desiFunkaar from "./assets/images/desi funkaar.png";
import ADDY from "./assets/images/ADDY FITNESS.png";
import MCO from "./assets/images/MCO.png";
import React from "react";
// import { ArrowRight } from 'lucide-react';
import Link from "next/link";

const cards = [
  {
    title: "Beyond Brick & Mortar: A Vision for a Greener Tomorrow",
    description:
      "My City Odisha isn’t just building townships—it’s shaping the future of sustainable living by integrating cutting-edge visuals and experiences.",
    image: MCO,
    color: "bg-rose-50",
    tag1: "Graphic Design",
    tag2: "Video Editing",
    tag3: "Digital Marketing",
    tag4: "Social Media Strategy",
    tag5: "VR Shoots",
    Link: "/works/worksDescription/MCO"
  },
  {
    title: "Beyond Reps & Sets: A Fitness Revolution in Motion",
    description:
      "Explore digital art creation using modern tools and techniques. From concept to final piece, develop your unique artistic style in the digital realm.",
    image: annapurna,
    color: "bg-blue-50",
    tag1: "Graphic Design",
    tag2: "Video Editing",
    tag3: "Digital Marketing",
    tag4: "Social Media Strategy",
    tag5: "VR Shoots",
     Link: "/works/worksDescription/annapurna"
  },
  {
    title: "More Than Just Cakes: A Recipe for Brand Sweetness",
    description:
      "Dive into the world of music production. Learn about sound design, mixing, and mastering to create professional-quality tracks that move people.",
    image: salty,
    color: "bg-purple-50",
    tag1: "Graphic Design",
    tag2: "Video Editing",
    tag3: "Digital Marketing",
    tag4: "Social Media Strategy",
    tag5: "VR Shoots",
     Link: "/works/worksDescription/salty"
  },
  {
    title: "Jewelry That Doesn’t Speak, Yet Captivates",
    description:
      "Embrace creativity in every aspect of your life. Discover how to integrate artistic expression into your daily routine and living spaces.",
    image: desiFunkaar,
    color: "bg-amber-50",
    tag1: "Graphic Design",
    tag2: "Video Editing",
    tag3: "Digital Marketing",
    tag4: "Social Media Strategy",
    tag5: "VR Shoots",
     Link: "/works/worksDescription/desifunkaars"
  },
  {
    title: "India’s Culture, Minted into the Digital Future",
    description:
      "Embrace creativity in every aspect of your life. Discover how to integrate artistic expression into your daily routine and living spaces.",
    image: ADDY,
    color: "bg-amber-50",
    tag1: "Graphic Design",
    tag2: "Video Editing",
    tag3: "Digital Marketing",
    tag4: "Social Media Strategy",
    tag5: "VR Shoots",
     Link: "/works/worksDescription/addyfitness"
  },
];

function Cards() {
  return (
    <div id="gradient" className="min-h-screen font-rethinkSans px-[24px] lg:px-[120px] py-[40px]">
      <div className=" w-full md:flex md:justify-center">
        <div className=" w-full max-w-7xl ">
      <h1 className="font-[700] text-[48px] xl:text-[104px]  xl:tracking-[-2.24px] 2xl:tracking-[-2.88px] italic ">
              Works
            </h1>
            <p className="text-customGrey w-full lg:w-[400px] xl:w-[480px] 2xl:w-[560px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
              Our projects show dedication to research and creativity, helping
              brands navigate the digital landscape.
            </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="relative flex flex-col gap-[50vh]">
          {cards.map((card) => (
            <div
              key={card.title}
              className="sticky top-[20%] flex items-center "
            >
            <Link href={card.Link}>
              <div
                className="w-full h-auto sm:h-[400px] md:h-[450px] lg:h-[500px] bg-customGreyCard rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col md:flex-row"
              >
                {/* Text Content */}
                <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between ">
                  <h3 className="text-2xl sm:text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                    {card.title}
                  </h3>
                  <div className="flex flex-col gap-4">
                  <p className="text-base sm:text-lg md:text-xl text-customGrey leading-relaxed">
                    {card.description}
                  </p>
                  <div className="hidden lg:flex flex-wrap gap-[8px] w-[80%]">
                    <div className="border-[1px] border-customBorder text-[14px] pl-[16px] pr-[16px] pt-[6px] pb-[6px] rounded-40px">
                      {card.tag1}
                    </div>
                    <div className="border-[1px] border-customBorder text-[14px] pl-[16px] pr-[16px] pt-[6px] pb-[6px] rounded-40px">
                      {card.tag2}
                    </div>
                    <div className="border-[1px] border-customBorder text-[14px] pl-[16px] pr-[16px] pt-[6px] pb-[6px] rounded-40px">
                      {card.tag3}
                    </div>
                    <div className="border-[1px] border-customBorder text-[14px] pl-[16px] pr-[16px] pt-[6px] pb-[6px] rounded-40px">
                      {card.tag4}
                    </div>
                  </div>
                  {/* <button className="hidden xl:inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-white hover:text-black transition-colors max-w-[184px]">
                  <Link href={card.Link}>Find out more</Link>
                  <ArrowRight size={20} />
                </button> */}
                  </div>
                </div>

                {/* Image */}
                <div className="w-full h-48 sm:h-56 md:h-auto md:w-[45%] relative overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover p-[24px]"
                  />
                </div>
              </div>
            </Link>
            </div>
           
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
