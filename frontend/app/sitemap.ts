import { MetadataRoute } from 'next';
import { connectToDatabase } from './lib/mongodb';
import Job from './lib/models/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.illusorydesignstudios.com';
  const routes = [
    '', '/services', '/works', '/team', '/about',
    '/contact', '/careers', '/packages',
    '/policies/privacy-policy', '/policies/refund-policy',
    '/policies/terms-service', '/policies/use-policy'
  ];

  const staticSitemap = routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    await connectToDatabase();
    // Query active jobs from MongoDB
    const activeJobs = await Job.find({ isActivelyHiring: true }).lean();
    
    const dynamicJobsSitemap = activeJobs.map((job: any) => {
      // Slugify title: "Graphic Designer" -> "graphic-designer"
      const slug = job.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const refId = String(job.referenceId).padStart(3, '0');
      
      return {
        url: `${base}/careers/${slug}-${refId}`,
        lastModified: new Date(job.datePosted || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });

    return [...staticSitemap, ...dynamicJobsSitemap];
  } catch (error) {
    console.error("Error generating dynamic sitemap from MongoDB:", error);
    return staticSitemap;
  }
}
