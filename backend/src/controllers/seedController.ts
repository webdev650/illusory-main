import { Request, Response } from "express";
import Project from "../models/Project";
import FAQ from "../models/FAQ";
import Service from "../models/Service";
import AboutSlide from "../models/AboutSlide";

const projects = [
  {
    navigation: "mco",
    title: "Sustainable Living in Odisha",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546181/1_g3flru.png",
    description: "My City Odisha (MCO) is a community-driven initiative focusing on sustainable urban development and heritage preservation.",
    tags: "Sustainability | Urban Development | Heritage"
  },
  {
    navigation: "addyfitness",
    title: "Fitness revolution in Motion",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546194/1_qrf6er.png",
    description: "Addy Fitness is redefining what it means to be fit. Fitness is more than just working out—it’s a mindset, a journey, and a way of life.",
    tags: "Branding | Social Media Growth | Wellness Community"
  },
  {
    navigation: "annapurna",
    title: "The Art of Baking",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546191/1_u0cg5w.png",
    description: "Annapurna Bakery is a heritage brand known for its artisanal breads and pastries. We updated their visual identity while preserving their traditional roots.",
    tags: "Food & Beverage | Brand Identity | Packaging"
  },
  {
    navigation: "desifunkaar",
    title: "Celebrating Cultural Narratives",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546178/1_nkricl.png",
    description: "Desi Funkaar is a platform for independent artists. We created a brand experience that is as vibrant and diverse as the artists it represents.",
    tags: "Culture | Talent Management | Experience Design"
  },
  {
    navigation: "addymeals",
    title: "Nutrition at Your Doorstep",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546186/1_z23spg.png",
    description: "Addy Meals brings healthy, delicious, and customized nutrition plans straight to you, making fitness goals easier to achieve.",
    tags: "Healthy Eating | Meal Prep | Wellness"
  },
  {
    navigation: "styletrends",
    title: "Leading the Fashion Curve",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546176/1_u1omv0.png",
    description: "Style Trends is your go-to source for the latest in fashion and lifestyle, curated for those who dare to stand out.",
    tags: "Fashion | Lifestyle | Editorial Design"
  },
  {
    navigation: "spectrum",
    title: "A Spectrum of Creativity",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546176/2_xy4c3i.png",
    description: "Spectrum is a platform that celebrates diversity in art and design, bringing together different perspectives to create something truly unique.",
    tags: "Art Curation | Creative Community | Diversity"
  },
  {
    navigation: "puraanesikke",
    title: "Preserving Numismatic Heritage",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546179/2_ngtsi5.png",
    description: "Puraane Sikke is dedicated to collectors and enthusiasts of rare coins and currency, providing a platform to explore and trade history.",
    tags: "Numismatics | Rare Coins | Historical Collection"
  },
  {
    navigation: "odishareality",
    title: "Redefining Real Estate in Odisha",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546184/2_brlr5j.png",
    description: "Odisha Realty brings the best property deals and real estate insights to the heart of Odisha, making home buying a seamless experience.",
    tags: "Real Estate | Property Consulting | Home Buying"
  },
  {
    navigation: "salty",
    title: "Jewellery that Speaks out",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546188/2_zmzfmi.png",
    description: "Salty isn’t just about jewelry—it’s about making a statement. Through visually stunning content, high-end branding, and an immersive digital experience.",
    tags: "Luxury Jewelry | High-End Accessories | Visual Storytelling"
  },
  {
    navigation: "annscafe",
    title: "Brewing Memories",
    image: "https://res.cloudinary.com/dtmqv7oqq/image/upload/v1782546190/1_lnfenb.png",
    description: "Ann's Cafe is more than just a coffee shop; it's a space where every cup is brewed with love and every visit becomes a cherished memory.",
    tags: "Cafe Culture | Coffee Branding | Community Space"
  }
];

const faqs = [
  {
    question: "What makes you unique?",
    answer: "Illusory Design Studios is a one-stop solution for all things creative, seamlessly blending design, strategy, and innovation. From concept to execution, we tailor our approach to meet diverse needs, ensuring every project captivates its audience, enhances brand presence, and delivers lasting impact—all under one roof."
  },
  {
    question: "Do you offer flexible packages or custom solutions?",
    answer: "Yes, Illusory Design Studios provides flexible packages and custom solutions tailored to each client’s specific requirements. We understand that no two projects are alike, so we collaborate closely with clients to create bespoke service packages that align with their vision, goals, and budget."
  },
  {
    question: "What types of businesses and industries do you specialize in?",
    answer: "We collaborate with businesses of all sizes, from visionary startups to established enterprises. Our expertise transcends industries, shaping compelling narratives and impactful designs across dynamic sectors, ensuring every brand stands out, engages meaningfully, and leaves a lasting impact. This versatility ensures that we provide innovative and effective solutions regardless of business type or industry."
  },
  {
    question: "How do you integrate trends and technologies into your work?",
    answer: "We stay ahead by continuously updating our knowledge and tools to incorporate the latest industry trends and technologies. Whether it’s advanced design software, data-driven digital marketing tools, or innovative content creation techniques, Illusory ensures clients benefit from cutting-edge solutions in every project."
  },
  {
    question: "What can I expect during the onboarding process with your team?",
    answer: "The onboarding process at Illusory is seamless and client-focused. We start with an in-depth consultation to understand your goals, followed by strategic planning to align our comprehensive services with your vision."
  },
  {
    question: "Do you work with businesses of all sizes and what is the project timeline?",
    answer: "Yes, we work with businesses of all sizes, from small enterprises to large organizations, across multiple industries. Project timelines vary based on the scope and complexity of the work but are defined during the consultation phase to ensure effective project management, seamless communication, and timely delivery."
  },
  {
    question: "How do you ensure quality across services, and how can I work with your team?",
    answer: "Illusory Design Studios employs a structured approach involving collaborative teams and multi-stage quality checks to maintain consistency across all our services, from creative design to marketing and production. To get started, reach out for an initial consultation where we’ll discuss your needs, outline our approach, and create a tailored action plan."
  },
  {
    question: "Do you offer online and offline branding services, including rebranding or scaling?",
    answer: "Definitely ! At Illusory, we provide a full spectrum of services that seamlessly blend digital and traditional branding. From website design and social media management to printed materials, interior design with architectural planning, and event promotion and execution, we cover it all."
  }
];

const services = [
  {
    link: "/services",
    textHead: "Creative Designing",
    words: [
      { text: "DESIGN", color: "#26E9FF" },
      { text: "UI/UX", color: "#000000" },
      { text: "BRANDING & PACKAGING DESIGN", color: "#FF1284" },
      { text: "LOGO DESIGNING", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Visual Production",
    words: [
      { text: "GRAPHICS", color: "#26E9FF" },
      { text: "2D & 3D ANIMATION", color: "#000000" },
      { text: "POST-PRODUCTION", color: "#FF1284" },
      { text: "STORYBOARDING", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Capturing Moments",
    words: [
      { text: "DRONE SHOOTS", color: "#26E9FF" },
      { text: "RETOUCHING", color: "#000000" },
      { text: "PRODUCT SHOOTS", color: "#FF1284" },
      { text: "PHOTOGRAPHY", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Event & Talent Management",
    words: [
      { text: "Event Planning", color: "#FF1284" },
      { text: "Artist & Influencer Management", color: "#26E9FF" },
      { text: "Corporate Events", color: "#000000" },
      { text: "Gaming Events", color: "#FF1284" },
      { text: "Virtual & Hybrid Events", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Digital Marketing",
    words: [
      { text: "Social Media", color: "#FF1284" },
      { text: "SEO", color: "#26E9FF" },
      { text: "Performance Ads", color: "#000000" },
      { text: "Content Strategy", color: "#FF1284" },
      { text: "Email & WhatsApp Marketing", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Web & App Development",
    words: [
      { text: "Websites", color: "#FF1284" },
      { text: "E-commerce", color: "#26E9FF" },
      { text: "Mobile Apps", color: "#000000" },
      { text: "Custom Solutions", color: "#FF1284" },
      { text: "UI/UX Development", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Branding",
    words: [
      { text: "Brand Identity", color: "#FF1284" },
      { text: "Development", color: "#26E9FF" },
      { text: "Strategy", color: "#000000" },
      { text: "Communication", color: "#FF1284" },
      { text: "Management", color: "#26E9FF" }
    ]
  }
];

const aboutSlides = [
  {
    section: "About Us",
    num: "01",
    title: "Rules? We Hack 'Em",
    body: "At Illusory Design Studios, creativity isn’t just a job—it’s a full-blown rebellion. We don’t conform, we break boundaries, we make things explode in ways people didn’t even know they needed."
  },
  {
    section: "About Us",
    num: "02",
    title: "Crafted to Stop Thumbs.",
    body: "In a world where everyone’s scrolling mindlessly, we create designs that make them hit pause. Our work is the kind that gets people talking, asking, “How the hell did they think of that?” every time."
  },
  {
    section: "About Us",
    num: "03",
    title: "No Limits. Just Big Dreams.",
    body: "We don’t believe in limitations. We see every project as an open canvas to push the envelope—creating something that leaves a mark, something unforgettable. Your brand deserves to be legendary."
  },
  {
    section: "About Us",
    num: "04",
    title: "The Playground of the Bold.",
    body: "From crazy visuals to viral campaigns, from influencer magic to unforgettable weddings—we work in every creative space possible. We’re not just creating; we’re disrupting the entire game."
  },
  {
    section: "Mission",
    num: "01",
    title: "Clients? Nah, We Roll with Visionaries",
    body: "This isn’t a service line — it’s a frontline. We move with the brands that break patterns and build presence. No gimmicks. No hand-holding. Just clear vision, sharp execution, and work that speaks before we do."
  },
  {
    section: "Mission",
    num: "02",
    title: "Brutal Precision: Built on Trust, Delivered in Pixels",
    body: "This isn’t a service line — it’s a frontline. We move with the brands that break patterns and build presence. No gimmicks. No hand-holding. Just clear vision, sharp execution, and work that speaks before we do."
  },
  {
    section: "Vision",
    num: "01",
    title: "Setting the Pace for the Future",
    body: "At Illusory, our vision is to lead—not follow—in shaping how brands engage, influence, and endure. We aspire to become a benchmark in creative innovation, where every idea sparks progress and every brand built sets the tone for what's next."
  },
  {
    section: "Vision",
    num: "02",
    title: "Building Legacy Through Limitless Growth",
    body: "We see beyond business—we see potential. Rooted in collaboration and driven by innovation, we aim for growth that outlasts and impact that resonates. Because in our vision, success isn’t seasonal—it’s generational."
  }
];

export const seedDatabase = async (req: Request, res: Response) => {
  try {
    // Clear existing data
    await Project.deleteMany({});
    await FAQ.deleteMany({});
    await Service.deleteMany({});
    await AboutSlide.deleteMany({});

    // Read configured cloud name (fallback to default)
    let activeCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!activeCloudName || activeCloudName === "undefined" || activeCloudName === "null" || activeCloudName.trim() === "") {
      activeCloudName = "dtmqv7oqq";
    }
    
    // Dynamically replace default developer cloud name in project images and videos
    const mappedProjects = projects.map((project: any) => {
      const mapped = { ...project };
      if (typeof mapped.image === "string" && mapped.image.includes("res.cloudinary.com/dtmqv7oqq/")) {
        mapped.image = mapped.image.replace(/res\.cloudinary\.com\/dtmqv7oqq\//g, `res.cloudinary.com/${activeCloudName}/`);
      }
      if (typeof mapped.video === "string" && mapped.video.includes("res.cloudinary.com/dtmqv7oqq/")) {
        mapped.video = mapped.video.replace(/res\.cloudinary\.com\/dtmqv7oqq\//g, `res.cloudinary.com/${activeCloudName}/`);
      }
      if (Array.isArray(mapped.gallery)) {
        mapped.gallery = mapped.gallery.map((img: any) => {
          if (typeof img === "string" && img.includes("res.cloudinary.com/dtmqv7oqq/")) {
            return img.replace(/res\.cloudinary\.com\/dtmqv7oqq\//g, `res.cloudinary.com/${activeCloudName}/`);
          }
          return img;
        });
      }
      return mapped;
    });

    // Seed new data
    await Project.insertMany(mappedProjects);
    await FAQ.insertMany(faqs);
    await Service.insertMany(services);
    await AboutSlide.insertMany(aboutSlides);

    res.json({ message: "Database seeded successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
