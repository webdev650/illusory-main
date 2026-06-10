
import { Metadata } from 'next';
import React from 'react'
import BestWorks from './components/best-works'
import { App } from '../components/App'
import Partners from '../components/Partners'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: "Our Work & Portfolio | Illusory Design Studios",
  description: "Explore our creative projects for brands like Swiggy, Nvidia, Allen Solly, Lakme, and more.",
  openGraph: {
    title: "Our Work & Portfolio | Illusory Design Studios",
    description: "Explore our creative projects for brands like Swiggy, Nvidia, Allen Solly, Lakme, and more.",
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