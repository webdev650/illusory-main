import React from 'react'
import { CircleCheck, Plus } from 'lucide-react'
import IllusoryLogo from "../../components/assets/Illusory Logo.svg"
import Image from 'next/image'
const CareerOpportunities = () => {
  return (
    <section className='section-class font-jakartaSans'>
        <div className='max-w-7xl w-full text-center flex flex-col items-center'>
        <div>
            <h1 className='text-4xl font-bold'>Top Job Picks for you</h1>
        </div>
        <div className='max-w-5xl w-full mt-20 flex flex-col gap-10'>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left flex flex-col gap-1'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India (Remote)</h1>
                            <h1 className='text-sm flex items-center gap-2'><span className=''><CircleCheck/></span>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India</h1>
                            <h1 className='text-sm'>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div ><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India</h1>
                            <h1 className='text-sm'>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div ><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India</h1>
                            <h1 className='text-sm'>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div ><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India</h1>
                            <h1 className='text-sm'>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div ><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India</h1>
                            <h1 className='text-sm'>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <div className='flex gap-4 items-center'>
                        <div ><Image src={IllusoryLogo} alt=''/></div>
                        <div className='text-left'>
                            <h1 className='text-[18px]'>Frontend Developer</h1>
                            <h1 className='text-sm'>Illusory-India</h1>
                            <h1 className='text-sm'>Actively Hiring</h1>
                        </div>
                    </div>
                    <div className='rotate-45'>
                    <Plus/>
                    </div>
                </div>
        </div>
        </div>
      
    </section>
  )
}

export default CareerOpportunities