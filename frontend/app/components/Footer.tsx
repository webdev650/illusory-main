"use client";
import React from "react";
import Logo from "./assets/Illusory Logo(2).svg";
import Image from "next/image";
import Aurora from "../components/ui/Aurora";
import ShinyText from "./ui/ShinyText";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <section
        id="footer-section"
        className="relative min-h-screen flex items-center w-full justify-center pt-[120px] px-6 lg:px-20 "
      >
        <div className="hidden md:flex absolute w-full h-full top-0">
          <Aurora
            colorStops={["#000000", "#F0F0F0", "#545454"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        <div className="relative font-jakartaSans  text-white w-full max-w-7xl">
          {/* Main Content Area */}
          <main className="container mx-auto">
            <Image src={Logo} alt="" />
            <h1 className="mt-20 text-5xl md:text-6xl lg:text-7xl font-bold max-w-xl lg:max-w-2xl  tracking-[-1.92px] lg:tracking-[-3.2px] leading-[108.333%] md:leading-[110%]">
              Have a project in mind? Let&apos;s talk!
            </h1>
            <p className=" mt-10 leading-[150%] font-[500] max-w-[400px] text-gray-300">
              Got a vision that’s out of the box? Let’s make it a reality that
              turns heads. Bold ideas, fearless execution—together, we’ll create
              the extraordinary!
            </p>
            <button className=" mt-10 group pointer-events-auto flex items-center w-full md:w-fit rounded-[72px] cursor-pointer transition-all duration-300">
              {/* <div className="relative flex items-center justify-between w-full md:gap-4  bg-[#3B3B3B] rounded-[72px] py-5 pl-7 pr-5 text-[24px] m-[2px] transition-all duration-300 group-hover:bg-[#FF1284] group-hover:text-white pointer-events-auto"> */}
              <div className="bg-[#3B3B3B]  rounded-[72px]">
                <ShinyText
                  text="Start a discussion"
                  disabled={false}
                  speed={3}
                  className="relative flex items-center justify-between w-full md:gap-4  rounded-[72px] py-5 pl-7 pr-5 text-[24px] m-[2px] transition-all duration-300 group-hover:!bg-[#FF1284] group-hover:text-white pointer-events-auto "
                />

              </div>


              {/* </div> */}
            </button>
          </main>

          {/* Footer */}
          <footer className=" text-white py-12 ">
            <div className="container mx-auto">
              {/* Footer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Company Links */}
                <div className="space-y-4">
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/works"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Work
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/team"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Team
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/policies/privacy-policy"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/policies/refund-policy"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Refund Policy
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Services Links */}
                <div className="space-y-4">
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/services"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/careers"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/policies/terms-service"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Terms of service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/policies/use-policy"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Acceptable use policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <ul className="space-y-3">
                    <li>
                      <Link
                        target="_blank"
                        href="https://www.facebook.com/illusorydesignstudios"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Facebook
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        href="https://www.instagram.com/illusory.designstudios?igsh=MWo3emdxeXpvaHkzbg=="
                        className="hover:text-gray-300 transition-colors"
                      >
                        Instagram
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        href="https://x.com/Illusory_DS?t=azhHjs_ANEYlc3dP7Sp-lQ&s=09"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Twitter
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        href="https://www.linkedin.com/company/73810696/admin/dashboard/"
                        className="hover:text-gray-300 transition-colors"
                      >
                        LinkedIn
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        href="https://www.behance.net/illusoryds"
                        className="hover:text-gray-300 transition-colors"
                      >
                        Behance
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="pt-8 ">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-400">
                    © 2026 Illusory Design Studios Pvt. Ltd. • All rights
                    reserved • <a href="mailto:business@illusorydesignstudios.com" className="hover:text-white transition-colors">business@illusorydesignstudios.com</a>
                  </p>
                  <p>
                    <span className="text-[#FCFCFD] text-opacity-50">
                      Locate us at :{" "}
                    </span>
                    Bhubaneswar, Odisha • 
                    <span className="text-[#FCFCFD] text-opacity-50"> Team 1: </span>
                    <a href="tel:7681842303" className="hover:text-white transition-colors">7681842303</a> • 
                    <span className="text-[#FCFCFD] text-opacity-50"> Team 2: </span>
                    <a href="tel:8763923036" className="hover:text-white transition-colors">8763923036</a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
};

export default Footer;
