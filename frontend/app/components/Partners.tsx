import React from "react";
import Image from "next/image";
import Marquee from "./Marquee";
import ADDY_Fitness from "./assets/ADDY Fitness.svg";
import ADDY_Meals from "./assets/ADDY Meals.svg";
import AllenSolly from "./assets/Allen Solly.svg";
import Ampverse from "./assets/Ampverse.svg";
import AnnSCafe from "./assets/Ann_s Cafe.svg";
import Robinson from "./assets/C.H. Robinson.svg";
import JawedHabib from "./assets/Jawed Habib.svg";
import zomaLand from "./assets/zomaland.svg";
import Swiggy from "./assets/Swiggy.svg";
import Agritech from "./assets/GNG Agritech.svg";
import Lakme from "./assets/lakme.svg";
import MCO from "./assets/MCO.svg";
import JJ_Food from "./assets/JJ Food.svg";
import Desi_Funkaar from "./assets/Desi Funkaar.svg";
import GoaGladiator from "./assets/Goa Gladiator.svg";
import Nvidia from "./assets/nvidia.svg";
import Mughal_Kitchen from "./assets/Mughal Kitchen.svg";
import Salty from "./assets/salty.svg";
import Visage from "./assets/visage.svg";
import inSTREAMLY from "./assets/inSTREAMLY.svg";
import Rare_Rabbit from "./assets/rare rabit.svg";
import Patra from "./assets/Patra Tours and Travel.svg";
import Dhani from "./assets/DHANI-01.svg";
import Urbana from "./assets/Urbana.svg";
import ClientMarquee from "react-fast-marquee";

const Partners = () => {
  const clientsAndPartners = [
    { src: ADDY_Fitness, alt: "ADDY Fitness" },
    { src: ADDY_Meals, alt: "ADDY Meals" },
    { src: AllenSolly, alt: "Allen Solly" },
    { src: Ampverse, alt: "Ampverse" },
    { src: AnnSCafe, alt: "Ann's Cafe" },
    { src: Robinson, alt: "Robinson" },
    { src: JawedHabib, alt: "Jawed Habib" },
    { src: zomaLand, alt: "Zoma Land" },
    { src: Swiggy, alt: "Swiggy" },
    { src: Agritech, alt: "GNG Agritech" },
    { src: Lakme, alt: "Lakme" },
    { src: MCO, alt: "MCO" },
    { src: JJ_Food, alt: "JJ Food" },
    { src: Desi_Funkaar, alt: "Desi Funkaar" },
    { src: GoaGladiator, alt: "Goa Gladiator" },
    { src: Nvidia, alt: "Nvidia" },
    { src: Mughal_Kitchen, alt: "Mughal Kitchen" },
    { src: Salty, alt: "Salty" },
    { src: Visage, alt: "Visage" },
    { src: inSTREAMLY, alt: "inStreamly" },
    { src: Rare_Rabbit, alt: "Rare Rabbit" },
    { src: Patra, alt: "Patra Tour And Travels" },
    { src: Urbana, alt: "Urbana" },
    { src: Dhani, alt: "Dhani" },
  ];
  return (
    <>
      <section className="pt-[120px] flex justify-center px-6 ">
        <div className="flex flex-col justify-between w-full md:max-w-7xl">
          <div className="w-full flex justify-center">
          <p className="md:w-[400px] leading-[150%] font-[500] text-center">
            Our partners - As a tight-knit of experts , we create memorable and
            emotional websites, digital experiences and native apps.
          </p>
          </div>
          <div className="mt-20  gap-14 md:hidden">
            <ClientMarquee>

          {clientsAndPartners.map((client, index) => (
        <div key={index} className="flex items-center justify-center ml-8">
          <Image src={client.src} alt={client.alt} className="w-36" />
        </div>
      ))}
            </ClientMarquee>
          </div>

          <div className="mt-20 gap-14 grid grid-cols-5 lg:grid-cols-6 max-md:hidden">
          {clientsAndPartners.map((client, index) => (
        <div key={index} className="flex items-center justify-center">
          <Image src={client.src} alt={client.alt} className="w-36 " />
        </div>
      ))}
          </div>
        </div>
      </section>
      <Marquee />
    </>
  );
};

export default Partners;