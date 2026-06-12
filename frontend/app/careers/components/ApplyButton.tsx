"use client";

import React, { useState } from "react";
import { ApplyModal } from "./ApplyModal";

interface ApplyButtonProps {
  job: {
    id: string;
    title: string;
  };
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({ job }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsApplyModalOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 w-full md:w-auto"
      >
        Apply Online Now
      </button>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
      />
    </>
  );
};
