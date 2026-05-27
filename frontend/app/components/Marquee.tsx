"use client"
import React from 'react'
import TextMarquee from "react-fast-marquee";

const Marquee = () => {
  return (
<section className='py-[120px]'>
    <div className=''>
    <TextMarquee autoFill={true} gradient={true} gradientColor='black' gradientWidth={200} className='text-[56px] font-[700]'>
<h1 className=' ml-8 tracking-[-2.24px] font-jakartaSans'>AI driven solutions</h1>
<h1 className='ml-8'>•</h1>
<h1 className=' ml-8 tracking-[-2.24px] font-jakartaSans'>Front-end</h1>
<h1 className='ml-8'>•</h1>
<h1 className=' ml-8 tracking-[-2.24px] font-jakartaSans'>Branding</h1>
<h1 className='ml-8'>•</h1>
<h1 className=' ml-8 tracking-[-2.24px] font-jakartaSans'>UI/UX</h1>
<h1 className='ml-8 '>•</h1>
</TextMarquee>
    </div>
</section>
)
}

export default Marquee