import { Metadata } from "next";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Partners from "../components/Partners";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ServiceRail } from "@/components/portfolio/ServiceRail";
import { WebsiteShowcase } from "@/components/portfolio/WebsiteShowcase";

export const metadata: Metadata = {
  title: "Portfolio Showcase | 3D Interactive Design Experience",
  description: "Experience Illusory Design Studios' portfolio in motion. 3D scroll showcase of 9 core capabilities and 20 industry website designs.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Portfolio Showcase | Illusory Design Studios",
    description: "3D scroll showcase of 9 core capabilities and 20 industry website designs.",
    url: "https://www.illusorydesignstudios.com/portfolio",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <div className="bg-black text-white min-h-screen relative overflow-x-hidden">
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <Navbar />
      </div>

      {/* Full Page Flow following site theme */}
      <main className="relative">
        <PortfolioHero />
        <ServiceRail />
        <WebsiteShowcase />
        <Partners />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
