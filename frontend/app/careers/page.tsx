import { Metadata } from 'next';
import React from 'react';
import { App } from '../components/App';
import JobListings from './components/joblist';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { connectToDatabase } from '../lib/mongodb';
import Job from '../lib/models/Job';
import { seedJobsIfNeeded } from '../lib/seedJobs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Illusory team. We're looking for creative designers, marketers, and developers.",
  openGraph: {
    title: "Careers",
    description: "Join the Illusory team. We're looking for creative designers, marketers, and developers.",
    url: "https://www.illusorydesignstudios.com/careers",
    type: "website",
  }
};

const Career = async () => {
  let serializableJobs: any[] = [];
  
  try {
    // Ensure jobs are seeded if database is empty
    await seedJobsIfNeeded();
    
    // Connect and fetch jobs
    await connectToDatabase();
    const jobsFromDb = await Job.find({}).sort({ referenceId: 1 }).lean();
    
    // Format jobs to match the exact Job interface used by UI components
    serializableJobs = jobsFromDb.map((job: any) => ({
      id: job.referenceId,
      title: job.title,
      company: job.company || 'Illusory',
      location: job.location,
      experience: job.experience,
      qualification: job.qualification,
      overview: job.description, // description maps to overview in UI
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      lookingFor: job.lookingFor || [],
      isActivelyHiring: job.isActivelyHiring,
      isRemote: job.isRemote,
      applyEmail: 'operations@illusorydesignstudios.com',
      applySubject: `Application – ${job.title} (#${job.referenceId})`,
    }));
  } catch (error) {
    console.error("Failed to load jobs from database, falling back to static:", error);
  }

  return (
    <>
      <App
        head1='Join the dream'
        head2='team and build'
        head3='the future'
        head4=''
      />
      <JobListings initialJobs={serializableJobs} />
      <FAQ />
      <Footer />
    </>
  );
};

export default Career;