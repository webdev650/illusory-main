import React from 'react'
import { App } from '../components/App'
// import CareerOpportunities from './components/career'
import JobListings from './components/joblist'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

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