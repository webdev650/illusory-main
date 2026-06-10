import { Metadata } from 'next';
import React from 'react'
import { App } from '../components/App'
// import CareerOpportunities from './components/career'
import JobListings from './components/joblist'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: "Careers | Illusory Design Studios",
  description: "Join the Illusory team. We're looking for creative designers, marketers, and developers.",
  openGraph: {
    title: "Careers | Illusory Design Studios",
    description: "Join the Illusory team. We're looking for creative designers, marketers, and developers.",
    url: "https://www.illusorydesignstudios.com/careers",
    type: "website",
  }
};

const Career = () => {
  return (
    <>
      <App
    head1='Join the dream'
    head2='team and build'
    head3='the future'
    head4=''
    />
    {/* <CareerOpportunities/> */}
    <JobListings/>
    <FAQ/>
    <Footer/>
    </>
  

  )
}

export default Career