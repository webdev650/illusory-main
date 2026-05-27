"use client";
import React , {  useEffect, useRef, useState,  } from "react";
import { faqAPI } from "../../services/api";
import gsap from "gsap";

const FAQ: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await faqAPI.getAll();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);



    const [openId, setOpenId] = useState<string | null>(null);
  
    const toggleQuestion = (id: string) => {
      setOpenId(openId === id ? null : id);
    };

  
    const container = useRef(null);
    useEffect(() => {
      const tl = gsap.timeline({ paused: true });
  
      tl.to([container.current, '#faqplus'], {
        opacity: 1,
        duration: 1.2,
        backgroundColor: "white",
        color: "black",
        stroke: "black",  
        fill: 'black',   
        ease: "power3.out",
      })
      tl.reverse();
  
      const handleScroll = () => {
        const servicesElement = document.querySelector("#faq");
  
        if (servicesElement) {
          const rect = servicesElement.getBoundingClientRect();
  
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            tl.play();
          } else {
            tl.reverse();
          }
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [container]);
  return (
    
    <section id="faq" ref={container} className="min-h-screen py-[120px] w-full flex justify-center px-6 lg:px-20">
      <div className=" w-full max-w-7xl ">
        <p className="md:w-[400px]">
        Got questions? Good. We love curiosity—it means you’re thinking. Whether it&apos;s about our process, services, or the magic behind the scenes, we’ve got answers.
        </p>

        <div className="mt-[80px] font-jakartaSans">
          {questions.map(({ _id, question, answer }) => (
            <div  key={_id} onClick={() => toggleQuestion(_id)} className=" py-6 cursor-pointer border-b-[1px] border-[#D3D3D3]">
              <div className=" font-jakartaSans ">
                <div className="flex justify-between font-rethinkSans ">
                  <h1 className="text-2xl md:text-3xl w-full md:w-[640px] leading-[150%] md:leading-[44px] font-[600] tracking-[-0.64px]">
                    {question}
                  </h1>
                  <svg
                    className={`w-[24px] h-[24px] transition-transform duration-300 hidden md:flex  ${
                      openId === _id ? 'rotate-45' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      id="faqplus"
                      d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.48043 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                      fill="#FCFCFD"
                    />
                  </svg>
                </div>

                <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      openId === _id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[#9F9F9F] leading-[150%] font-medium max-w-[640px]">
                        {answer}
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;