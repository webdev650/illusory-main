
import { Metadata } from 'next';
import React from 'react'
import BestWorks from './components/best-works'
import { App } from '../components/App'
import Partners from '../components/Partners'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: "Our Work & Portfolio",
  description: "Explore our creative projects, branding, and digital design portfolio by Illusory Design Studios.",
  openGraph: {
    title: "Our Work & Portfolio",
    description: "Explore our creative projects, branding, and digital design portfolio by Illusory Design Studios.",
    url: "https://www.illusorydesignstudios.com/works",
    type: "website",
  }
};

const Works = () => {
  return (
    <> 
    <App
      head1="Experts in"
      head2="bringing"
      head3="brands to life"
      head4="digitally."
      />
    <BestWorks/>
    <Partners/>
    <FAQ/>
    <Footer/>
    </>
  )
}

export default Works