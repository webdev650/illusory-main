import { connectToDatabase } from './mongodb';
import Job from './models/Job';
import { jobs as staticJobs } from '../careers/data/jobs';

export async function seedJobsIfNeeded() {
  await connectToDatabase();
  
  const count = await Job.countDocuments();
  if (count > 0) {
    return;
  }

  console.log("Seeding jobs collection because it is empty...");

  const mappedJobs = staticJobs.map((job) => {
    // 1. Determine department from title
    let department = "Creative & Operations";
    const titleLower = job.title.toLowerCase();
    if (titleLower.includes("designer") || titleLower.includes("graphic") || titleLower.includes("brand")) {
      department = "Design";
    } else if (titleLower.includes("marketing") || titleLower.includes("marketer") || titleLower.includes("pr") || titleLower.includes("influencer")) {
      department = "Marketing";
    } else if (titleLower.includes("developer") || titleLower.includes("full stack") || titleLower.includes("tech")) {
      department = "Engineering";
    } else if (titleLower.includes("manager") || titleLower.includes("operations") || titleLower.includes("hr") || titleLower.includes("finance") || titleLower.includes("bd") || titleLower.includes("executive")) {
      department = "Operations & Management";
    } else if (titleLower.includes("video") || titleLower.includes("editor") || titleLower.includes("cinematographer") || titleLower.includes("creator")) {
      department = "Media & Production";
    }

    // 2. Determine workMode from location
    let workMode = "On-site";
    const locLower = job.location.toLowerCase();
    if (locLower.includes("hybrid")) {
      workMode = "Hybrid";
    } else if (locLower.includes("remote")) {
      workMode = "Remote";
    }

    // 3. Determine employmentType
    const employmentType = "Full-time";

    // 4. Map references
    const referenceId = String(job.id).padStart(3, '0');

    return {
      referenceId,
      title: job.title,
      department,
      location: job.location,
      employmentType,
      workMode,
      description: job.overview,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      lookingFor: job.lookingFor,
      experience: job.experience,
      qualification: job.qualification,
      company: job.company || "Illusory",
      isActivelyHiring: job.isActivelyHiring,
      isRemote: workMode === "Remote",
    };
  });

  await Job.insertMany(mappedJobs);
  console.log(`Successfully seeded ${mappedJobs.length} jobs into MongoDB!`);
}
