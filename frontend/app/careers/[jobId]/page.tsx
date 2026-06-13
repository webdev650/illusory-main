import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Mail, MapPin, Briefcase, GraduationCap, CheckCircle } from 'lucide-react';
import { ApplyButton } from '../components/ApplyButton';
import { connectToDatabase } from '../../lib/mongodb';
import Job from '../../lib/models/Job';

interface PageProps {
  params: {
    jobId: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const jobs = await Job.find({}).lean();
    return jobs.map((job: any) => ({
      jobId: job.referenceId,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  let jobDoc: any = null;

  try {
    await connectToDatabase();
    
    // Parse reference ID from parameter (e.g. "graphic-designer-001" -> "001" or "1" -> "1")
    const match = params.jobId.match(/(\d+)$/);
    const extractRefId = match ? match[1] : params.jobId;
    const normalizedRefId = extractRefId.padStart(3, '0');
    const fallbackRefId = parseInt(extractRefId, 10).toString();

    jobDoc = await Job.findOne({
      $or: [
        { referenceId: normalizedRefId },
        { referenceId: fallbackRefId },
        { referenceId: params.jobId }
      ]
    }).lean();
  } catch (err) {
    console.error("Failed to fetch job from database:", err);
  }

  if (!jobDoc) {
    notFound();
  }

  // Map database document to matching UI interface
  const job = {
    id: jobDoc.referenceId,
    title: jobDoc.title,
    company: jobDoc.company || 'Illusory',
    location: jobDoc.location,
    experience: jobDoc.experience,
    qualification: jobDoc.qualification,
    overview: jobDoc.description,
    responsibilities: jobDoc.responsibilities || [],
    requirements: jobDoc.requirements || [],
    lookingFor: jobDoc.lookingFor || [],
    isActivelyHiring: jobDoc.isActivelyHiring,
    isRemote: jobDoc.isRemote,
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: `Application – ${jobDoc.title} (#${jobDoc.referenceId})`,
  };

  // Structured Data Schema for Google for Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: `
      <p>${job.overview}</p>
      <h3>Key Responsibilities</h3>
      <ul>
        ${job.responsibilities.map((r: string) => `<li>${r}</li>`).join('')}
      </ul>
      <h3>Requirements</h3>
      <ul>
        ${job.requirements.map((r: string) => `<li>${r}</li>`).join('')}
      </ul>
    `,
    datePosted: jobDoc.datePosted ? new Date(jobDoc.datePosted).toISOString() : new Date().toISOString(),
    validThrough: jobDoc.validThrough ? new Date(jobDoc.validThrough).toISOString() : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Illusory Design Studios',
      sameAs: 'https://www.illusorydesignstudios.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bhubaneswar',
        addressRegion: 'Odisha',
        addressCountry: 'IN',
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-black font-jakartaSans">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/careers"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Careers
          </Link>
          {job.isActivelyHiring && (
            <div className="flex items-center gap-1.5 px-3 py-1 border border-green-200 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50">
              <CheckCircle size={12} />
              Actively Hiring
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-12 border-b border-gray-100 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {job.title.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 border border-blue-100 bg-blue-50/30 flex items-center justify-center text-blue-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Location</p>
                  <p className="text-sm font-medium text-black">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 border border-purple-100 bg-purple-50/30 flex items-center justify-center text-purple-600">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Experience</p>
                  <p className="text-sm font-medium text-black">{job.experience}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 border border-orange-100 bg-orange-50/30 flex items-center justify-center text-orange-600">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Qualification</p>
                  <p className="text-sm font-medium text-black">{job.qualification}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-gray-400 text-xs">
                  ID
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Job Reference</p>
                  <p className="text-sm font-medium text-black">#{job.id.padStart(3, '0')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Role Overview */}
          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider flex items-center gap-2 text-blue-600">
              <span className="w-8 h-[2px] bg-blue-600 inline-block"></span>
              Role Overview
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {job.overview}
            </p>
          </section>

          {/* Key Responsibilities */}
          <section>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2 text-purple-600">
              <span className="w-8 h-[2px] bg-purple-600 inline-block"></span>
              Key Responsibilities
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.responsibilities.map((item: string, index: number) => (
                <li key={index} className="flex gap-4 p-4 border border-gray-100 hover:border-gray-300 transition-colors">
                  <span className="text-gray-300 font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-[2px] bg-black inline-block"></span>
              Requirements
            </h2>
            <div className="space-y-3">
              {job.requirements.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-black shrink-0 transition-transform group-hover:scale-150"></div>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What We're Looking For */}
          <section className="bg-gray-50/50 p-8 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wider text-blue-600">
              What We&apos;re Looking For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.lookingFor.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 border border-blue-600 rotate-45 shrink-0 bg-blue-50"></div>
                  <p className="text-gray-900 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How to Apply */}
          <section className="border-2 border-transparent bg-gray-900 p-8 md:p-12 text-center text-white rounded-xl">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ready to make an impact?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              If you&apos;re passionate about design and innovation, we&apos;d love to hear from you.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <ApplyButton job={{ id: job.id, title: job.title }} />

              <div className="text-left p-6 border border-gray-700 bg-gray-800 shadow-xl w-full md:w-auto">
                <p className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4">Or Apply via Email</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-400" />
                    <p className="text-sm">
                      Send CV &amp; Portfolio to: <br />
                      <span className="font-bold text-white break-all">{job.applyEmail}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 flex justify-center text-purple-400 font-bold text-[10px]">SUB</div>
                    <p className="text-sm">
                      Subject Line: <br />
                      <span className="font-mono bg-gray-700 px-2 py-1 text-xs text-purple-300">{job.applySubject}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
