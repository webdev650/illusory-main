'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import JobCard from './jobcard';
import { JobDetailsContent } from './jobdetails';
import { jobs } from '../data/jobs';

const JobListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0].id);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.find(j => j.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [searchTerm, filteredJobs, selectedJobId]);

  return (
    <section className="font-jakartaSans bg-white min-h-screen">
      {/* Header - Fixed height */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 border border-transparent bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Top Job <span className="text-blue-600">Picks</span>
                </h1>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                  {filteredJobs.length} Positions Available
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-1 max-w-2xl gap-4 w-full">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by role, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                />
              </div>
              <button className="px-6 py-3 border border-gray-100 flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-600 transition-all font-semibold uppercase text-[10px] tracking-widest bg-white">
                <Filter size={14} />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Split Pane */}
      <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-108px)] overflow-hidden">
        
        {/* Left Pane - Job List (Scrollable) */}
        <div className="w-full lg:w-[450px] border-r border-gray-100 overflow-y-auto custom-scrollbar bg-gray-50/30">
          <div className="flex flex-col divide-y divide-gray-100">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 px-6">
                <p className="text-gray-400 italic text-sm">No jobs match your search</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJobId(job.id)}
                  className="w-full transition-all"
                >
                  <JobCard
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    isActivelyHiring={job.isActivelyHiring}
                    isRemote={job.isRemote}
                    isActive={selectedJobId === job.id}
                  />
                </div>
              ))
            )}
          </div>
          
          {/* Footer Info inside list */}
          <div className="p-8 text-center border-t border-gray-100 bg-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <TrendingUp size={12} />
              Stay updated with new roles
            </div>
          </div>
        </div>

        {/* Right Pane - Job Details (Sticky/Scrollable) */}
        <div className="hidden lg:block flex-1 overflow-y-auto bg-white custom-scrollbar relative">
          {selectedJob ? (
            <div className="h-full flex flex-col">
              {/* Sticky Top Action Bar for Detail View */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-50 px-8 py-4 flex justify-end">
                <Link 
                  href={`/careers/${selectedJob.id}`}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  View Full Page 
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex-1">
                <JobDetailsContent job={selectedJob} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 italic">
              Select a job to view details
            </div>
          )}
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </section>
  );
};

export default JobListings;