import React from "react";
import { App } from "../components/App";
import Bento from "./components/about-bento/bento";
import Carousel from "./components/about-bento/carousel";
import Marquee from "../components/Marquee";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

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
