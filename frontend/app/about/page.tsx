import { Metadata } from 'next';
import React from "react";
import { App } from "../components/App";
import Bento from "./components/about-bento/bento";
import Carousel from "./components/about-bento/carousel";
import Marquee from "../components/Marquee";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Illusory Design Studios — our story, mission, and approach to creative design and digital marketing.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "About Us",
    description: "Learn about Illusory Design Studios — our story, mission, and approach to creative design and digital marketing.",
    url: "https://www.illusorydesignstudios.com/about",
    type: "website",
  }
};

const About = () => {
  return (
    <>
      <App
        head1="We don't"
        head2="follow trends"
        head3="We set them."
        head4=""
      />
      <Bento />
      <Carousel/>
      <Marquee/>
      <FAQ/>
      <Footer/>
    </>
  );
};

export default About;
