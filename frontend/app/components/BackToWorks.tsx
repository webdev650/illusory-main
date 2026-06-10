"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const BackToWorks = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/works")}
      className="group inline-flex items-center gap-2 text-customGrey hover:text-white font-jakartaSans font-medium text-sm transition-colors duration-300 pointer-events-auto"
      aria-label="Back to Works"
    >
      <ArrowLeft 
        size={16} 
        className="transform transition-transform duration-300 group-hover:-translate-x-1" 
      />
      <span>Back to Works</span>
    </button>
  );
};

export default BackToWorks;
