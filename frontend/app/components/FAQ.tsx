"use client";

import React, { useEffect, useRef, useState } from "react";
import { faqAPI } from "../../services/api";
import gsap from "gsap";

const defaultFaqs = [
  {
    _id: "faq-1",
    question: "Do you offer flexible packages or custom solutions?",
    answer:
      "Yes, absolutely! We tailor every engagement specifically to your brand goals, timeline, and budget requirements, ensuring maximum ROI without unnecessary fluff.",
  },
  {
    _id: "faq-2",
    question: "What types of businesses and industries do you specialize in?",
    answer:
      "We partner with ambitious startups, mid-sized enterprises, and industry leaders across Tech, E-commerce, Real Estate, Travel, Lifestyle, and Retail.",
  },
  {
    _id: "faq-3",
    question: "How do you ensure quality across services, and how can I work with your team?",
    answer:
      "Our structured 4-phase methodology—Research, Blueprint, Execution, and Polish—guarantees exceptional quality at every single milestone.",
  },
  {
    _id: "faq-4",
    question: "How do you integrate trends and technologies into your work?",
    answer:
      "We blend timeless design principles with state-of-the-art WebGL animations, Next.js 14, AI integrations, and dynamic micro-interactions.",
  },
  {
    _id: "faq-5",
    question: "What can I expect during the onboarding process with your team?",
    answer:
      "Onboarding is seamless and fast: a dedicated discovery workshop, clear project roadmap, direct team communication channels, and weekly sprint demos.",
  },
  {
    _id: "faq-6",
    question: "What makes Illusory Design Studios unique?",
    answer:
      "We don't just build websites or logos—we craft emotional brand experiences that convert casual visitors into lifetime brand advocates.",
  },
];

const FAQ: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await faqAPI.getAll();
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(defaultFaqs);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setQuestions(defaultFaqs);
      }
    };
    fetchFAQs();
  }, []);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.to(container.current, {
      opacity: 1,
      duration: 1.2,
      backgroundColor: "white",
      color: "black",
      ease: "power3.out",
    });
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

  const displayList = questions.length > 0 ? questions : defaultFaqs;

  return (
    <section
      id="faq"
      ref={container}
      className="min-h-screen py-[60px] md:py-[80px] w-full flex justify-center px-6 lg:px-20 transition-colors duration-500"
    >
      <div className="w-full max-w-7xl flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-black/5 w-fit text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Frequently Asked Questions
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-rethinkSans tracking-tight leading-[115%]">
            Got Questions? <span className="text-blue-600">We&apos;ve Got Answers.</span>
          </h2>
          
          <p className="md:w-[540px] text-neutral-600 text-sm sm:text-base font-general leading-relaxed">
            Got questions? Good. We love curiosity—it means you&apos;re thinking. Whether it&apos;s about our process, services, or the magic behind the scenes, we&apos;ve got you covered.
          </p>
        </div>

        {/* FAQ Accordion Cards List */}
        <div className="flex flex-col gap-4 font-jakartaSans">
          {displayList.map(({ _id, question, answer }, index) => {
            const isOpen = openId === _id;
            const itemNumber = (index + 1).toString().padStart(2, "0");

            return (
              <div
                key={_id || index}
                onClick={() => toggleQuestion(_id)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-5 sm:p-7 ${
                  isOpen
                    ? "bg-neutral-50/90 border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30"
                    : "bg-transparent border-black/10 hover:border-black/25 hover:bg-neutral-50/50"
                }`}
              >
                {/* Accordion Title Row */}
                <div className="flex items-center justify-between gap-4 font-rethinkSans">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Index Badge */}
                    <span
                      className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                        isOpen
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-black/5 text-neutral-500 group-hover:bg-black/10 group-hover:text-black"
                      }`}
                    >
                      {itemNumber}
                    </span>

                    {/* Single-line Question Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis flex-1 pr-2 text-justify">
                      {question}
                    </h3>
                  </div>

                  {/* Toggle Button Icon */}
                  <div
                    className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-blue-600 text-white rotate-45 shadow-md shadow-blue-500/30"
                        : "bg-black/5 text-black group-hover:bg-black/10"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </div>

                {/* Animated Accordion Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-black/10"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal text-justify max-w-full sm:max-w-4xl pl-0 sm:pl-[52px]">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;