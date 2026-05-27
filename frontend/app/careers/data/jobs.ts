export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  qualification: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  lookingFor: string[];
  applyEmail: string;
  applySubject: string;
  isActivelyHiring: boolean;
  isRemote?: boolean;
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Graphic Designer',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '1–2 Years (Agency/Corporate Experience Preferred)',
    qualification: 'Bachelor’s Degree in any stream (Design-related fields preferred, but not mandatory)',
    overview: 'We are looking for a creative and detail-oriented Graphic Designer with a strong understanding of visual storytelling and brand communication. The ideal candidate should have hands-on experience working in a professional (agency or corporate) environment and be capable of delivering high-quality creatives across multiple platforms.',
    responsibilities: [
      'Design engaging creatives for social media, digital campaigns, and branding',
      'Maintain consistency with brand guidelines across all visual outputs',
      'Collaborate with marketing and content teams for campaign execution',
      'Handle multiple projects while meeting deadlines efficiently',
      'Contribute innovative ideas to enhance overall creative output'
    ],
    requirements: [
      'Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
      'Basic understanding of UI tools like Figma is a plus',
      'Strong sense of typography, color, and layout',
      'Prior experience in an agency or corporate setup',
      'Ability to take feedback and iterate quickly',
      'Strong portfolio showcasing real client or project work'
    ],
    lookingFor: [
      'Someone who understands “design for business, not just aesthetics”',
      'Ability to work in a fast-paced environment',
      'Professional attitude with accountability',
      'A mindset to grow, experiment, and improve'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Graphic Designer',
    isActivelyHiring: false
  },
  {
    id: '2',
    title: 'Video Editor',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '1–2 Years (Agency/Corporate Experience Preferred)',
    qualification: 'Bachelor’s Degree in any stream (Media/Film/Design preferred, but not mandatory)',
    overview: 'We are looking for a skilled and creative Video Editor who can craft high-impact visual content for digital platforms. The ideal candidate should have experience working on social media content, ad creatives, and brand videos, with a strong understanding of storytelling, pacing, and audience engagement.',
    responsibilities: [
      'Edit short-form content (Reels, Ads, Shorts) with high engagement potential',
      'Work on brand videos, promotional content, and event highlights',
      'Add motion graphics, transitions, sound design, and effects to enhance quality',
      'Collaborate with the creative and marketing team for campaign execution',
      'Optimize videos based on platform trends and performance',
      'Manage multiple projects while meeting deadlines'
    ],
    requirements: [
      'Proficiency in Adobe Premiere Pro and After Effects',
      'Basic knowledge of color grading and sound design',
      'Understanding of social media trends (Instagram, YouTube, etc.)',
      'Strong sense of timing, storytelling, and visual flow',
      'Ability to work under tight deadlines',
      'Portfolio showcasing real projects (reels, ads, brand videos)'
    ],
    lookingFor: [
      'Someone who knows how to make content go viral, not just edit clips',
      'Strong understanding of hook, retention, and pacing',
      'Creative thinker who can bring fresh ideas to the table',
      'Professional attitude and team collaboration mindset'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Video Editor',
    isActivelyHiring: false
  },
  {
    id: '3',
    title: 'Brand Designer',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '2–4 Years (Strong Branding/Agency Experience Required)',
    qualification: 'Bachelor’s Degree in Design, Fine Arts, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a strategic and creative Brand Designer who can build strong and cohesive brand identities. The ideal candidate should have experience in creating complete branding systems—from logos and visual identity to brand guidelines—while ensuring consistency across all touchpoints.',
    responsibilities: [
      'Develop brand identities including logos, color palettes, typography, and visual systems',
      'Create brand guidelines and ensure consistency across all platforms',
      'Work on brand strategy along with the creative team',
      'Translate business objectives into strong visual storytelling',
      'Collaborate with graphic designers and marketing teams for execution',
      'Handle multiple branding projects across different industries'
    ],
    requirements: [
      'Strong expertise in Adobe Illustrator, Photoshop, and branding tools',
      'Deep understanding of typography, color theory, and layout systems',
      'Experience in logo design and brand identity creation',
      'Ability to present and justify design concepts',
      'Strong portfolio showcasing branding projects (not just social media creatives)',
      'Agency or corporate branding experience preferred'
    ],
    lookingFor: [
      'Someone who thinks beyond design—into brand strategy',
      'Ability to build memorable and scalable brand identities',
      'Attention to detail and consistency across every element',
      'A designer who understands premium and modern brand aesthetics'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Brand Designer',
    isActivelyHiring: true
  },
  {
    id: '4',
    title: 'Performance Marketer',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '2–4 Years (Agency/Performance Marketing Experience Required)',
    qualification: 'Bachelor’s Degree in Marketing, Business, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a data-driven and result-oriented Performance Marketer who can plan, execute, and optimize paid campaigns across digital platforms. The ideal candidate should have hands-on experience in managing ad budgets, generating leads, and driving measurable ROI for clients.',
    responsibilities: [
      'Plan, execute, and manage paid ad campaigns (Meta, Google, etc.)',
      'Optimize campaigns for leads, conversions, and ROI',
      'Conduct audience research, targeting, and funnel building',
      'Perform A/B testing on creatives, copies, and landing pages',
      'Track performance using analytics tools and generate reports',
      'Collaborate with creative and content teams for high-performing ad creatives',
      'Manage budgets efficiently and scale winning campaigns'
    ],
    requirements: [
      'Strong hands-on experience with Meta Ads and Google Ads',
      'Understanding of conversion tracking (Pixel, Events, Google Analytics)',
      'Knowledge of funnel strategy and lead generation systems',
      'Ability to analyze data and take actionable decisions',
      'Experience in handling multiple client accounts',
      'Strong communication and reporting skills'
    ],
    lookingFor: [
      'Someone who focuses on results, not just impressions or reach',
      'Ability to scale campaigns profitably',
      'Strong analytical mindset with attention to detail',
      'A problem-solver who can adapt quickly to changes'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Performance Marketer',
    isActivelyHiring: false
  },
  {
    id: '5',
    title: 'Digital Marketing Specialist',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '1–3 Years (Agency/Corporate Experience Preferred)',
    qualification: 'Bachelor’s Degree in Marketing, Business, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a versatile and proactive Digital Marketing Specialist who can manage and execute end-to-end digital marketing activities. The ideal candidate should have a strong understanding of social media, content strategy, SEO basics, and campaign execution.',
    responsibilities: [
      'Plan and execute digital marketing campaigns across platforms',
      'Manage social media accounts and content calendars',
      'Coordinate with design and video teams for content creation',
      'Assist in running and optimizing campaigns (in collaboration with performance team)',
      'Handle basic SEO, website updates, and content optimization',
      'Track performance metrics and generate reports',
      'Stay updated with digital trends and platform changes'
    ],
    requirements: [
      'Good understanding of social media platforms (Instagram, LinkedIn, YouTube)',
      'Basic knowledge of SEO and content marketing',
      'Familiarity with tools like Meta Business Suite, Google Analytics, etc.',
      'Strong coordination and communication skills',
      'Ability to manage multiple brands/projects',
      'Creative thinking with a data-driven approach'
    ],
    lookingFor: [
      'Someone who can execute consistently, not just plan',
      'A multitasker who can handle content, coordination, and strategy',
      'Strong ownership mindset',
      'Ability to work in a fast-paced agency environment'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Digital Marketing Specialist',
    isActivelyHiring: false
  },
  {
    id: '6',
    title: 'Brand Activation Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site + Field Work)',
    experience: '1–3 Years (Event/Activation/On-ground Marketing Experience Preferred)',
    qualification: 'Bachelor’s Degree in any stream (Marketing/Event Management preferred)',
    overview: 'We are looking for a dynamic and execution-focused Brand Activation Executive who can manage and execute on-ground marketing activities, events, and brand campaigns. The ideal candidate should be comfortable working in fast-paced environments and handling multiple aspects of event execution and coordination.',
    responsibilities: [
      'Plan and execute on-ground brand activations, events, and promotional campaigns',
      'Coordinate with vendors, venues, and internal teams for smooth execution',
      'Manage logistics, setup, and breakdown of events',
      'Ensure brand visibility and experience standards are maintained at all touchpoints',
      'Handle on-site challenges and provide quick solutions',
      'Assist in client coordination and reporting post-events',
      'Travel as required for events and activations'
    ],
    requirements: [
      'Prior experience in event management, activations, or on-ground marketing',
      'Strong coordination and organizational skills',
      'Ability to handle pressure and tight timelines',
      'Good communication and interpersonal skills',
      'Problem-solving mindset with quick decision-making ability',
      'Willingness to work flexible hours and travel'
    ],
    lookingFor: [
      'Someone who can execute flawlessly on ground',
      'A “doer” mindset, not just planner',
      'High energy, proactive, and responsible',
      'Ability to represent the company professionally in front of clients'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Brand Activation Executive',
    isActivelyHiring: false
  },
  {
    id: '7',
    title: 'Social Media Manager',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '1–3 Years (Agency/Brand Handling Experience Preferred)',
    qualification: 'Bachelor’s Degree in Marketing, Communication, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a creative and strategic Social Media Manager who can plan, manage, and grow brand presence across digital platforms. The ideal candidate should have experience in content strategy, audience engagement, and brand communication, with a strong understanding of current trends and platform dynamics.',
    responsibilities: [
      'Develop and execute social media strategies for multiple brands',
      'Plan and manage content calendars across platforms (Instagram, LinkedIn, etc.)',
      'Coordinate with graphic designers and video editors for content creation',
      'Write captions, hooks, and content briefs aligned with brand voice',
      'Monitor engagement, respond to audience interactions, and build community',
      'Analyze performance metrics and optimize content strategies',
      'Stay updated with trends and implement them creatively'
    ],
    requirements: [
      'Strong understanding of Instagram, LinkedIn, and short-form content trends',
      'Good copywriting and communication skills',
      'Experience with social media tools and analytics',
      'Ability to manage multiple client accounts',
      'Creative thinking with a strategic mindset',
      'Prior agency experience preferred'
    ],
    lookingFor: [
      'Someone who understands content + psychology + trends',
      'Ability to grow accounts, not just maintain them',
      'Strong sense of brand tone and storytelling',
      'A proactive thinker who brings ideas, not just executes'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Social Media Manager',
    isActivelyHiring: false
  },
  {
    id: '8',
    title: 'Full Stack Developer',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '2–4 Years (Agency/Product Development Experience Preferred)',
    qualification: 'Bachelor’s Degree in Computer Science, IT, or related field (preferred but not mandatory)',
    overview: 'We are looking for a skilled Full Stack Developer who can build, manage, and optimize web platforms, landing pages, and digital products. The ideal candidate should have strong technical expertise in both front-end and back-end development, with an understanding of performance, scalability, and user experience.',
    responsibilities: [
      'Develop and maintain websites, landing pages, and web applications',
      'Build high-converting landing pages for marketing campaigns',
      'Handle both front-end (UI/UX) and back-end development',
      'Optimize website performance, speed, and responsiveness',
      'Integrate APIs, CRM tools, and third-party services',
      'Work closely with marketing and design teams for execution',
      'Ensure website security, debugging, and regular maintenance'
    ],
    requirements: [
      'Proficiency in HTML, CSS, JavaScript',
      'Experience with frameworks like React, Node.js (or similar)',
      'Knowledge of backend technologies (PHP, Python, or Node)',
      'Experience with databases (MySQL, MongoDB, etc.)',
      'Familiarity with CMS platforms (WordPress, Webflow is a plus)',
      'Understanding of SEO basics and website optimization',
      'Strong problem-solving and debugging skills'
    ],
    lookingFor: [
      'Someone who can build fast and efficiently, not overcomplicate things',
      'Ability to create marketing-focused landing pages (conversion-first mindset)',
      'A developer who understands business + tech alignment',
      'Ownership mindset with attention to detail'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Full Stack Developer',
    isActivelyHiring: false
  },
  {
    id: '9',
    title: 'Business Development Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '1–3 Years (Agency/Service Sales Experience Preferred)',
    qualification: 'Bachelor’s Degree in Business, Marketing, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a proactive and result-driven Business Development Executive who can generate leads, build client relationships, and drive revenue growth. The ideal candidate should have experience in selling marketing, branding, or creative services and be confident in client communication and deal closing.',
    responsibilities: [
      'Identify and generate new business opportunities through outbound and inbound channels',
      'Pitch agency services (branding, digital marketing, events, etc.) to potential clients',
      'Conduct meetings, presentations, and follow-ups with prospects',
      'Build and maintain long-term client relationships',
      'Coordinate with internal teams to understand service offerings',
      'Prepare proposals, quotations, and closing deals',
      'Achieve monthly/quarterly sales targets'
    ],
    requirements: [
      'Strong communication and negotiation skills',
      'Basic understanding of digital marketing and branding services',
      'Experience in lead generation, cold outreach, and client handling',
      'Confidence in pitching and presenting ideas',
      'Ability to handle rejection and maintain consistency',
      'Target-oriented mindset'
    ],
    lookingFor: [
      'Someone who can bring business, not just conversations',
      'Strong persuasion and relationship-building skills',
      'Self-driven and highly motivated individual',
      'Professional approach in handling clients'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Business Development Executive',
    isActivelyHiring: true
  },
  {
    id: '10',
    title: 'Project Manager',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '2–5 Years (Agency/Project Management Experience Required)',
    qualification: 'Bachelor’s Degree in Business, Management, or related field (preferred but not mandatory)',
    overview: 'We are looking for a highly organized and detail-oriented Project Manager who can oversee multiple client projects, ensure timely delivery, and streamline internal workflows. The ideal candidate should have experience in managing creative, marketing, or event-based projects within a fast-paced environment.',
    responsibilities: [
      'Manage end-to-end execution of client projects and campaigns',
      'Coordinate between design, video, marketing, and operations teams',
      'Create timelines, task flows, and ensure deadline adherence',
      'Communicate with clients for updates, feedback, and approvals',
      'Identify bottlenecks and resolve workflow challenges proactively',
      'Maintain quality control across all deliverables',
      'Track project progress and report to leadership'
    ],
    requirements: [
      'Strong organizational and time management skills',
      'Experience with project management tools (Trello, Asana, ClickUp, etc.)',
      'Ability to handle multiple clients/projects simultaneously',
      'Excellent communication and client-handling skills',
      'Problem-solving mindset with attention to detail',
      'Prior agency or event management experience preferred'
    ],
    lookingFor: [
      'Someone who can bring structure to chaos',
      'A strong coordinator who keeps everyone accountable',
      'Calm under pressure and solution-oriented',
      'Ability to balance client expectations + team capacity'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Project Manager',
    isActivelyHiring: false
  },
  {
    id: '11',
    title: 'Cinematographer',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site + Field Work)',
    experience: '1–3 Years (Agency/Production/Event Experience Preferred)',
    qualification: 'Bachelor’s Degree in Film, Media, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a creative and technically skilled Cinematographer who can capture high-quality visual content for brand campaigns, events, and digital platforms. The ideal candidate should have a strong understanding of camera techniques, lighting, and storytelling, along with basic video editing skills to support the post-production process.',
    responsibilities: [
      'Shoot high-quality videos for events, brand campaigns, and social media content',
      'Plan shots, framing, and lighting setups based on creative briefs',
      'Collaborate with the creative and video editing team',
      'Handle camera equipment, lenses, and basic audio setup',
      'Perform basic video editing (clip selection, rough cuts, syncing) when required',
      'Ensure smooth on-ground execution during shoots',
      'Travel for outdoor shoots and event coverage',
      'Maintain and manage equipment responsibly'
    ],
    requirements: [
      'Hands-on experience with professional cameras (Sony, Canon, etc.)',
      'Strong understanding of lighting, framing, and composition',
      'Basic video editing skills with good command over Adobe Premiere Pro',
      'Ability to perform rough cuts and organize footage efficiently',
      'Ability to work in fast-paced shoot environments',
      'Creative eye for storytelling and aesthetics',
      'Portfolio showcasing real shoots (events, ads, brand videos)'
    ],
    lookingFor: [
      'Someone who can shoot premium visuals and support the editing process',
      'Strong creative vision with practical execution skills',
      'Ability to adapt quickly during live shoots',
      'A team player with high energy and professionalism'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Cinematographer',
    isActivelyHiring: false
  },
  {
    id: '12',
    title: 'Brand Research Analyst',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '1–3 Years (Market Research / Strategy / Agency Experience Preferred)',
    qualification: 'Bachelor’s Degree in Marketing, Business, Economics, or related field (preferred but not mandatory)',
    overview: 'We are looking for a detail-oriented and analytical Brand Research Analyst who can gather insights, study market trends, and support strategic decision-making for branding and marketing campaigns. The ideal candidate should be curious, data-driven, and capable of translating research into actionable insights.',
    responsibilities: [
      'Conduct market research, competitor analysis, and industry benchmarking',
      'Analyze consumer behavior, trends, and audience insights',
      'Support brand strategy, positioning, and campaign planning',
      'Prepare research reports, presentations, and strategic insights',
      'Assist in pitch decks and client proposals with data-backed inputs',
      'Work closely with creative, marketing, and strategy teams',
      'Track campaign performance insights and suggest improvements'
    ],
    requirements: [
      'Strong analytical and research skills',
      'Good understanding of branding, marketing, and consumer psychology',
      'Ability to collect, interpret, and present data clearly',
      'Proficiency in tools like Excel, Google Sheets, and presentation tools',
      'Basic knowledge of digital analytics (Google Analytics, social insights)',
      'Strong written and verbal communication skills'
    ],
    lookingFor: [
      'Someone who asks “why” before “what”',
      'Ability to convert data into real strategic decisions',
      'Curiosity-driven mindset with attention to detail',
      'A thinker who can support both creative and business teams'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Brand Research Analyst',
    isActivelyHiring: false
  },
  {
    id: '13',
    title: 'PR Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha',
    experience: '1–2 Years',
    qualification: 'Bachelor’s Degree in PR, Communications, or Journalism',
    overview: 'Join us as a PR Executive to manage public relations and media outreach for our clients.',
    responsibilities: [
      'Develop and execute PR campaigns',
      'Build and maintain relationships with media personnel',
      'Draft press releases and media kits',
      'Monitor and report on media coverage'
    ],
    requirements: [
      'Excellent writing and communication skills',
      'Understanding of the media landscape',
      'Experience in media relations or PR agency',
      'Strong networking abilities'
    ],
    lookingFor: [
      'A confident communicator and networker',
      'Proactive and persistent',
      'Creative storyteller'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – PR Executive',
    isActivelyHiring: false
  },
  {
    id: '14',
    title: 'Event Manager',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site + Field Work)',
    experience: '2–5 Years (Event Management / Agency Experience Required)',
    qualification: 'Bachelor’s Degree in Event Management, Business, or related field (preferred but not mandatory)',
    overview: 'We are looking for an experienced and highly organized Event Manager who can plan, manage, and execute events from concept to completion. The ideal candidate should have strong leadership skills, vendor management experience, and the ability to handle client expectations while ensuring flawless execution.',
    responsibilities: [
      'Plan and execute events, brand activations, and promotional campaigns',
      'Manage end-to-end event lifecycle including budgeting, planning, and execution',
      'Coordinate with vendors, venues, artists, and internal teams',
      'Handle client communication, presentations, and approvals',
      'Oversee on-ground execution and ensure quality standards',
      'Manage event budgets, timelines, and logistics',
      'Identify and resolve challenges proactively during events',
      'Prepare post-event reports and analysis'
    ],
    requirements: [
      'Proven experience in event management or agency environment',
      'Strong leadership and team coordination skills',
      'Excellent vendor management and negotiation abilities',
      'Ability to handle high-pressure situations and tight deadlines',
      'Good communication and client-handling skills',
      'Willingness to travel and work flexible hours'
    ],
    lookingFor: [
      'Someone who can own an event from idea to execution',
      'Strong problem-solving mindset under pressure',
      'Ability to manage both clients and internal teams efficiently',
      'A professional who ensures premium event experiences'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Event Manager',
    isActivelyHiring: false
  },
  {
    id: '15',
    title: 'Influencer Marketing Specialist',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '1–3 Years (Influencer/Agency/Digital Marketing Experience Preferred)',
    qualification: 'Bachelor’s Degree in Marketing, Communication, or related field (preferred but not mandatory)',
    overview: 'We are looking for a creative and well-connected Influencer Marketing Specialist who can plan and execute influencer-driven campaigns. The ideal candidate should have experience in identifying the right creators, managing collaborations, and delivering impactful brand campaigns.',
    responsibilities: [
      'Identify and onboard relevant influencers/creators across platforms',
      'Plan and execute influencer marketing campaigns',
      'Negotiate deliverables, timelines, and commercials with influencers',
      'Manage end-to-end communication and coordination with creators',
      'Ensure content aligns with brand guidelines and campaign objectives',
      'Track campaign performance and prepare reports',
      'Build and maintain long-term relationships with influencers'
    ],
    requirements: [
      'Strong understanding of Instagram, YouTube, and creator ecosystems',
      'Experience in influencer outreach and campaign execution',
      'Good negotiation and communication skills',
      'Ability to manage multiple campaigns simultaneously',
      'Basic understanding of campaign metrics and performance tracking',
      'Existing influencer network is a plus'
    ],
    lookingFor: [
      'Someone who understands influence, not just follower count',
      'Ability to identify the right creator for the right brand',
      'Strong coordination and relationship management skills',
      'A result-driven mindset focused on campaign impact'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Influencer Marketing Specialist',
    isActivelyHiring: false
  },
  {
    id: '16',
    title: 'Content Creator',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '0–2 Years (Freshers with strong content portfolio can apply)',
    qualification: 'Bachelor’s Degree in any stream (Media/Communication preferred but not mandatory)',
    overview: 'We are looking for a creative and energetic content creator who can ideate, shoot, and execute engaging content for social media platforms. The ideal candidate should be comfortable in front of the camera and have a strong understanding of trends, storytelling, and audience engagement.',
    responsibilities: [
      'Create engaging short-form content (Reels, Shorts, etc.)',
      'Ideate content concepts based on trends and brand requirements',
      'Shoot content using phone or camera setups',
      'Collaborate with video editors and social media team',
      'Participate in on-camera content when required',
      'Stay updated with social media trends and viral formats',
      'Assist in content planning and execution for campaigns'
    ],
    requirements: [
      'Strong understanding of Instagram, YouTube Shorts, and content trends',
      'Basic shooting skills (mobile/camera)',
      'Creativity and ability to generate content ideas',
      'Confidence in front of the camera (important)',
      'Basic understanding of editing tools is a plus',
      'Portfolio or sample content (must)'
    ],
    lookingFor: [
      'Someone who can create content that grabs attention in the first 3 seconds',
      'High energy, creative mindset, and consistency',
      'Ability to adapt quickly to trends',
      'A creator who understands what works, not just what looks good'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Content Creator',
    isActivelyHiring: true
  },
  {
    id: '17',
    title: 'Event Operations Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site + Field Work)',
    experience: '1–3 Years (Event/Operations/On-ground Execution Experience Preferred)',
    qualification: 'Bachelor’s Degree in any stream (Event Management preferred but not mandatory)',
    overview: 'We are looking for a detail-oriented and execution-focused Event Operations Executive who can handle on-ground logistics, coordination, and smooth execution of events. The ideal candidate should be highly organized, proactive, and capable of managing multiple operational aspects under tight timelines.',
    responsibilities: [
      'Handle on-ground execution of events and brand activations',
      'Manage logistics, setup, and dismantling of event infrastructure',
      'Coordinate with vendors, suppliers, and internal teams',
      'Ensure timelines and operational workflows are followed',
      'Supervise manpower, equipment, and event setup',
      'Troubleshoot and resolve on-ground issues efficiently',
      'Support the Event Manager in execution and coordination'
    ],
    requirements: [
      'Prior experience in event operations or similar roles',
      'Strong coordination and organizational skills',
      'Ability to handle pressure and dynamic environments',
      'Good communication and teamwork skills',
      'Problem-solving mindset with quick decision-making ability',
      'Willingness to travel and work flexible hours'
    ],
    lookingFor: [
      'Someone who can execute without supervision',
      'A highly responsible and proactive individual',
      'Ability to manage chaos and bring structure on ground',
      'Strong ownership mindset'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Event Operations Executive',
    isActivelyHiring: false
  },
  {
    id: '18',
    title: 'HR & Operations Manager',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '1–3 Years (HR + Operations / Agency / Startup Experience Required)',
    qualification: 'Bachelor’s Degree in HR, Business Administration, or related field (MBA preferred but not mandatory)',
    overview: 'We are looking for a highly organized and people-focused HR & Operations Manager who can manage internal team operations, hiring, and overall workflow efficiency. The ideal candidate should have experience in both human resources and operational management, ensuring smooth day-to-day functioning of the organization.',
    responsibilities: [
      'Manage end-to-end recruitment and hiring processes',
      'Handle onboarding, training, and employee engagement',
      'Maintain HR policies, attendance, and performance tracking',
      'Address employee concerns and ensure a healthy work culture',
      'Manage payroll coordination and compliance basics',
      'Oversee daily office operations and workflow management',
      'Coordinate between departments to ensure smooth execution',
      'Improve internal processes and efficiency',
      'Support leadership in planning and execution of company initiatives',
      'Ensure deadlines, systems, and accountability across teams'
    ],
    requirements: [
      'Strong understanding of HR processes and operations management',
      'Excellent communication and interpersonal skills',
      'Experience with hiring, employee handling, and team coordination',
      'Strong organizational and problem-solving skills',
      'Ability to manage multiple responsibilities simultaneously',
      'Experience in agency/startup environment preferred'
    ],
    lookingFor: [
      'Someone who can bring structure, discipline, and clarity',
      'A people-oriented professional with leadership mindset',
      'Strong decision-making and conflict resolution skills',
      'High ownership and accountability'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – HR and Operations Manager',
    isActivelyHiring: false
  },
  {
    id: '19',
    title: 'Finance Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '1–3 Years (Accounting/Finance Experience Preferred)',
    qualification: 'Bachelor’s Degree in Commerce, Finance, or Accounting (B.Com / M.Com preferred)',
    overview: 'We are looking for a detail-oriented and reliable Finance Executive who can manage day-to-day financial operations, maintain accurate records, and support financial planning. The ideal candidate should have strong knowledge of accounting principles and be capable of handling company finances efficiently.',
    responsibilities: [
      'Maintain financial records, invoices, and transactions',
      'Handle accounts payable and receivable',
      'Manage billing, vendor payments, and client invoicing',
      'Track expenses and maintain budget records',
      'Assist in preparing financial reports and statements',
      'Ensure compliance with basic tax and regulatory requirements',
      'Coordinate with external accountants or auditors when required'
    ],
    requirements: [
      'Strong knowledge of accounting principles',
      'Experience with Tally, Excel, or similar accounting tools',
      'Attention to detail and accuracy',
      'Basic understanding of GST, invoicing, and taxation',
      'Good organizational and time management skills',
      'Ability to handle confidential financial data responsibly'
    ],
    lookingFor: [
      'Someone who can keep finances clean, clear, and structured',
      'High level of accuracy and accountability',
      'A reliable professional who ensures smooth financial operations',
      'Ability to support decision-making with basic financial insights'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Finance Executive',
    isActivelyHiring: false
  },
  {
    id: '20',
    title: 'Brand Strategist',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '3–6 Years (Branding/Strategy/Agency Experience Required)',
    qualification: 'Bachelor’s Degree in Marketing, Business, Communication, or related field (preferred but not mandatory)',
    overview: 'We are looking for a strategic and insight-driven Brand Strategist who can define brand positioning, messaging, and direction for clients. The ideal candidate should be capable of translating business goals into clear brand strategies that guide design, content, and marketing efforts.',
    responsibilities: [
      'Develop brand positioning, messaging, and communication frameworks',
      'Conduct market research, competitor analysis, and audience insights',
      'Define brand tone, voice, and storytelling direction',
      'Work closely with Brand Designers and Creative Teams',
      'Contribute to campaign planning and brand strategy decks',
      'Support pitch presentations with strategic direction',
      'Ensure consistency across all brand touchpoints'
    ],
    requirements: [
      'Strong understanding of branding, marketing, and consumer behavior',
      'Experience in strategy development and brand positioning',
      'Excellent research, analytical, and thinking skills',
      'Strong communication and presentation abilities',
      'Ability to convert insights into actionable strategies',
      'Prior agency experience preferred'
    ],
    lookingFor: [
      'Someone who can think deeply, not just execute',
      'Ability to connect business goals with creative direction',
      'Strong storytelling and strategic clarity',
      'A professional who can guide teams with clear direction'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Brand Strategist',
    isActivelyHiring: false
  },
  {
    id: '21',
    title: 'Merchandise & Apparel Designer',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site / Hybrid)',
    experience: '1–3 Years (Fashion/Apparel/Streetwear Experience Preferred)',
    qualification: 'Bachelor’s Degree in Fashion Design, Textile Design, or related field (preferred but not mandatory)',
    overview: 'We are looking for a creative and trend-driven Merchandise & Apparel Designer who can design unique and high-quality apparel for our brand. The ideal candidate should have a strong understanding of streetwear culture, fashion trends, and print design, with the ability to create designs that resonate with modern audiences.',
    responsibilities: [
      'Design graphics and concepts for T-shirts, hoodies, and apparel collections',
      'Develop seasonal/drop-based collections aligned with brand vision',
      'Work on typography, illustrations, and print-ready artwork',
      'Coordinate with production teams for print quality and execution',
      'Research fashion trends, streetwear culture, and audience preferences',
      'Create mockups and presentation decks for new collections',
      'Maintain consistency in brand identity across apparel'
    ],
    requirements: [
      'Strong skills in Adobe Illustrator, Photoshop, or similar tools',
      'Understanding of garment design, print techniques, and fabric basics',
      'Knowledge of streetwear trends and Gen Z fashion culture',
      'Creativity in typography, graphics, and concept building',
      'Ability to create print-ready files and production guidelines',
      'Portfolio showcasing apparel or merchandise design work'
    ],
    lookingFor: [
      'Someone who can create designs people actually want to wear',
      'Strong sense of culture, trend, and individuality',
      'Ability to think in collections, not just single designs',
      'A designer who understands limited drops & exclusivity mindset'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Merchandise & Apparel Designer',
    isActivelyHiring: false
  },
  {
    id: '22',
    title: 'HR Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '0–2 Years (Freshers with HR internships can apply)',
    qualification: 'Bachelor’s Degree in HR, Business Administration, or related field (MBA/HR preferred but not mandatory)',
    overview: 'We are looking for a proactive and detail-oriented HR Executive who can support daily HR operations, recruitment processes, and employee coordination. The ideal candidate should be organized, people-friendly, and capable of handling multiple HR tasks efficiently.',
    responsibilities: [
      'Assist in end-to-end recruitment (screening, scheduling interviews, follow-ups)',
      'Manage onboarding and documentation of new hires',
      'Maintain employee records, attendance, and HR databases',
      'Support employee engagement activities and internal communication',
      'Coordinate with different teams for HR-related requirements',
      'Assist in payroll coordination and basic compliance tasks',
      'Handle day-to-day HR administrative activities'
    ],
    requirements: [
      'Basic understanding of HR processes and recruitment',
      'Good communication and interpersonal skills',
      'Strong organizational and coordination abilities',
      'Familiarity with MS Excel and HR tools (preferred)',
      'Ability to handle confidential information responsibly',
      'Positive attitude and willingness to learn'
    ],
    lookingFor: [
      'Someone who is organized, responsive, and people-friendly',
      'A quick learner with a proactive mindset',
      'Ability to manage multiple tasks efficiently',
      'Strong ownership in daily responsibilities'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – HR Executive',
    isActivelyHiring: false
  },
  {
    id: '23',
    title: 'Operations Executive',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '1–3 Years (Operations / Agency / Coordination Experience Preferred)',
    qualification: 'Bachelor’s Degree in Business Administration, Management, or related field (preferred but not mandatory)',
    overview: 'We are looking for a highly organized and proactive Operations Executive who can manage daily workflows, coordinate between teams, and ensure smooth execution of projects. The ideal candidate should be detail-oriented and capable of handling multiple responsibilities efficiently in a fast-paced environment.',
    responsibilities: [
      'Coordinate between different teams (design, marketing, events, etc.)',
      'Track project progress and ensure deadlines are met',
      'Manage internal workflows, task allocation, and follow-ups',
      'Assist in client coordination and communication',
      'Maintain documentation, reports, and operational records',
      'Identify process gaps and suggest improvements',
      'Support leadership in day-to-day operations'
    ],
    requirements: [
      'Strong organizational and time management skills',
      'Good communication and coordination abilities',
      'Ability to multitask and handle pressure',
      'Familiarity with tools like Excel, Google Sheets, and task management tools',
      'Problem-solving mindset with attention to detail',
      'Prior agency/startup experience preferred'
    ],
    lookingFor: [
      'Someone who can bring order to daily chaos',
      'A reliable executor who ensures things get done',
      'Strong follow-up and accountability mindset',
      'Ability to manage multiple moving parts efficiently'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Operations Executive',
    isActivelyHiring: false
  },
  {
    id: '24',
    title: 'Operations Associate',
    company: 'Illusory',
    location: 'Bhubaneswar, Odisha (On-site)',
    experience: '0–1 Year (Freshers / Interns can apply)',
    qualification: 'Bachelor’s Degree in Business Administration, Management, or any relevant field (preferred but not mandatory)',
    overview: 'We are looking for a motivated and detail-oriented Operations Associate who can support daily operational activities and assist teams in ensuring smooth workflow. This is an entry-level role ideal for individuals looking to build a career in operations and project management.',
    responsibilities: [
      'Assist in coordinating tasks between different teams',
      'Support in tracking project progress and deadlines',
      'Help maintain reports, data, and documentation',
      'Assist in internal communication and follow-ups',
      'Support client coordination (when required)',
      'Help identify and report operational issues',
      'Perform day-to-day administrative and operational tasks'
    ],
    requirements: [
      'Good communication and coordination skills',
      'Basic knowledge of MS Excel / Google Sheets',
      'Strong willingness to learn and adapt',
      'Organized and detail-oriented mindset',
      'Ability to follow instructions and meet deadlines',
      'Positive attitude and team-oriented approach'
    ],
    lookingFor: [
      'Someone who is eager to learn and grow',
      'A reliable support system for the team',
      'Quick learner with a proactive mindset',
      'Strong discipline and consistency'
    ],
    applyEmail: 'operations@illusorydesignstudios.com',
    applySubject: 'Application – Operations Associate',
    isActivelyHiring: false
  }
];
