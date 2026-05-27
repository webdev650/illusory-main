"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./assets/Illusory Logo.svg";
import Image from "next/image";
import gsap from "gsap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo('#nav', {
      opacity: 0,
      y: "-=30",
    }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power4.inOut",
      stagger: 0.25,
    });
  }, []);

  // Animation for mobile menu
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.mobile-menu', {
        opacity: 0,
        y: -20,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.1,
      });
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav id="nav" className="hidden lg:flex py-6 text-white w-full justify-center px-6 lg:px-20">
        <div className="flex justify-between w-full max-w-7xl">
          <div className="pointer-events-auto">
            <Link href="/"><Image src={Logo} alt="" /></Link>
          </div>
          <div>
            <ul className="flex gap-[32px]">
              <li className="navigation-hover">
                <Link href="/works">Works</Link>
              </li>
              <li className="navigation-hover">
                <Link href="/team">Our Team</Link>
              </li>
              <li className="navigation-hover">
                <Link href="/services">Services</Link>
              </li>
              <li className="navigation-hover">
                <Link href="/packages">Package</Link>
              </li>

              <li className="navigation-hover">
                <Link href="/about">About Us</Link>
              </li>
              <li className="navigation-hover">
                <Link href="/careers">Careers</Link>
              </li>
              <li className="navigation-hover">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden flex justify-between items-center py-4 px-6 text-white absolute top-0 font-jakartaSans">
        <Link href="/" className="pointer-events-auto">
          <Image src={Logo} alt="Illusory Logo Image" />
        </Link>
        
        {/* Hamburger Button */}
        <button 
          onClick={toggleMenu}
          className="z-50 focus:outline-none pointer-events-auto fixed right-6"
          aria-label="Toggle menu"
        >
        <div className={`w-6 flex flex-col gap-1.5 transition-all duration-300 ${isOpen ? 'transform' : ''}`}>
  <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
  <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-6'}`}></span>
  <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}></span>
</div>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu fixed inset-0 bg-black z-40 flex flex-col items-center justify-center space-y-8 pt-20">
            <Link 
              href="/works" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              Works
            </Link>
            <Link 
              href="/team" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              Our Team
            </Link>
            <Link 
              href="/services" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/packages" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              Package
            </Link>

            <Link 
              href="/about" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/careers" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              Careers
            </Link>
            <Link 
              href="/contact" 
              className="text-2xl hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;