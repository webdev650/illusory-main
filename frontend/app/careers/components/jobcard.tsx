import React from 'react';
import { CircleCheck, Plus } from 'lucide-react';
import Image from 'next/image';
import IllusoryLogo from "../../components/assets/Illusory Logo.svg";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  isRemote?: boolean;
  isActivelyHiring: boolean;
  isActive?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  isRemote = false,
  isActivelyHiring,
  isActive = false,
}) => {
  return (
    <div className={`w-full flex justify-between items-center group cursor-pointer border-l-4 transition-all p-4 bg-white ${isActive ? "border-blue-600 bg-blue-50/10 shadow-sm" : "border-transparent hover:border-gray-200"}`}>
      <div className="flex gap-4 items-center">
        <div className="flex-shrink-0">
          <Image src={IllusoryLogo} alt="Illusory Logo" className="w-10 h-10 object-contain" />
        </div>
        <div className="text-left flex flex-col gap-1">
          <h1 className={`text-[18px] font-semibold transition-colors ${isActive ? "text-blue-600" : "text-black group-hover:text-gray-600"}`}>
            {title}
          </h1>
          <h1 className="text-sm text-gray-500">
            {company} — {location}
          </h1>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "border-blue-200 bg-blue-100/50 text-blue-700" : "border-blue-100 bg-blue-50/50 text-blue-600"}`}>
              {isRemote ? "Remote" : "On-site"}
            </span>
            <span className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "border-purple-200 bg-purple-100/50 text-purple-700" : "border-purple-100 bg-purple-50/50 text-purple-600"}`}>
              Full-time
            </span>
            <button className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-wider transition-all ${isActive ? "bg-blue-600 border-blue-600 text-white" : "border-black text-white bg-black hover:bg-white hover:text-black hover:border-black"}`}>
              Apply
            </button>
            <button className="px-3 py-1 border border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-all">
              Save
            </button>
          </div>

          {isActivelyHiring && (
            <h1 className="text-sm flex items-center gap-2 text-green-600 font-semibold mt-2 animate-pulse">
              <CircleCheck size={16} className="text-green-500" />
              Actively Hiring
            </h1>
          )}
        </div>
      </div>
      <div className={`rotate-45 transition-all ${isActive ? "text-blue-600 scale-110" : "text-gray-400 group-hover:text-black"}`}>
        <Plus size={24} />
      </div>
    </div>
  );
};


export default JobCard;