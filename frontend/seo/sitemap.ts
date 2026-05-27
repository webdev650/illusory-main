import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from 'sitemap';
import { createWriteStream } from 'fs';

async function generateSitemap(): Promise<void> {
  const sitemapStream = new SitemapStream({ hostname: 'https://www.illusorydesignstudios.com' });

  const urls: SitemapItemLoose[] = [
    { url: '/', changefreq: EnumChangefreq.DAILY, priority: 1.0 },
    { url: '/about', changefreq: EnumChangefreq.WEEKLY, priority: 0.8 },
    { url: '/contact', changefreq: EnumChangefreq.MONTHLY, priority: 0.7 },
    { url: '/services', changefreq: EnumChangefreq.WEEKLY, priority: 0.9 },
    { url: '/works', changefreq: EnumChangefreq.WEEKLY, priority: 0.8 },
    { url: '/careers', changefreq: EnumChangefreq.MONTHLY, priority: 0.5 },
    { url: '/team', changefreq: EnumChangefreq.MONTHLY, priority: 0.5 },

    // Policies
    { url: '/policies/privacy', changefreq: EnumChangefreq.YEARLY, priority: 0.3 },
    { url: '/policies/refund', changefreq: EnumChangefreq.YEARLY, priority: 0.3 },
    { url: '/policies/terms', changefreq: EnumChangefreq.YEARLY, priority: 0.3 },

    // Works Description
    { url: '/worksdescription/advertising-corporate', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
    { url: '/worksdescription/brand-identity', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
    { url: '/worksdescription/creative-designing', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
    { url: '/worksdescription/digital-marketing', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
    { url: '/worksdescription/event-artist-management', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
    { url: '/worksdescription/photography', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
    { url: '/worksdescription/visual-production', changefreq: EnumChangefreq.MONTHLY, priority: 0.6 },
  ];

  urls.forEach((url) => sitemapStream.write(url));
  sitemapStream.end();

  const sitemap: string = await streamToPromise(sitemapStream).then((sm) => sm.toString());

  createWriteStream('./public/sitemap.xml').write(sitemap);

  console.log('✅ Sitemap generated successfully!');
}

generateSitemap();
