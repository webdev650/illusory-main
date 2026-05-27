
import React from 'react'
import BestWorks from './components/best-works'
import { App } from '../components/App'
import Partners from '../components/Partners'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

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