"use client";
import SafeImage from "../../../components/ui/SafeImage";
const projects = [
  {
    id: 1,
    title: "Pratyush K Rath",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066113/20250307-DSC_6708_sblpc0.jpg",
    description:
    "Every brand has a story waiting to be told, and for me, crafting that story is pure magic. Illusory is built on vision, creativity, and a touch of boldness – and we’re here to turn your dreams into realities that captivate.",
    tags:'CEO'
  },
  {
    id: 2,
    title: "Aparna Tripathy",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066109/Aparna_website-01_agwuid.jpg",
    description:
     "Illusory isn’t just a workplace; it’s a journey we take with every client. I’m here to make sure every detail aligns, every step flows, and every dream becomes something tangible. Together, we’re building more than brands; we’re building connections.",
    tags:'COO'
  },
  {
    id: 3,
    title: "Biswajit Nayak",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066110/20250307-DSC_6640_rtjc4f.jpg",
    description:
      "To me, marketing is more than strategy – it’s finding that spark that makes people feel and connect. At Illusory, we don’t just promote; we create stories that linger. Let’s make your brand unforgettable, one bold idea at a time.",
    tags:'CMO'
  },
  {
    id: 4,
    title: "Sreetam Panda",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066111/20250307-DSC_6676_fuateg.jpg",
    description:
      "Design is where logic meets imagination. I thrive on pushing the boundaries of what's possible, ensuring that every project we deliver is not only functional but also a visual masterpiece that resonates with the audience.",
    tags: 'Lead Designer'
  },
  {
    id: 5,
    title: "Addy Dash",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066113/20250307-DSC_6672_sawij3.jpg",
    description:
      "In the digital world, engagement is everything. My focus is on creating immersive experiences that bridge the gap between technology and emotion, making sure your brand's digital presence is as impactful as its vision.",
    tags: 'Creative Director'
  },
  {
    id: 6,
    title: "Amrit Mohanty",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066114/20250307-DSC_6791_1_m2aip4.jpg",
    description:
      "Excellence is in the details. I'm dedicated to refining every aspect of our visual production, from the first frame to the final cut, ensuring that every piece of content we produce is of the highest cinematic quality.",
    tags: 'Visual Head'
  },
  {
    id: 7,
    title: "Soumya Ranjan",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066112/20250307-DSC_6681_lldlmb.jpg",
    description:
      "Great brands are built on great communication. I work to ensure that your brand's voice is heard clearly and consistently across all channels, building lasting relationships and driving meaningful growth.",
    tags: 'Brand Strategist'
  },
  {
    id: 8,
    title: "Subham Kumar",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066108/20250307-DSC_6796_bfis9v.jpg",
    description:
      "Technology should empower creativity, not limit it. I bridge the gap between complex technical solutions and intuitive design, making sure that your brand's digital infrastructure is as robust as it is beautiful.",
    tags: 'Tech Lead'
  }
];
const Carousel = () => {
  
  return (
    <section
    
      
      className="min-h-screen py-[120px] w-full px-6 lg:px-20 flex justify-center"
    >
      <div className=" flex flex-col justify-between w-full max-w-7xl">
        <div>
          <p className="md:w-[400px]">
          Meet the Core Team -
          The engine behind Illusory, building brands that don’t just exist, but lead. Ideas get sharper, strategies get louder, and stories become unforgettable.
          </p>
        </div>
        <div
          style={{ scrollbarWidth: "none" }}
          className="flex flex-col md:flex-row overflow-x-auto gap-11 font-jakartaSans mt-20"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-none w-full lg:w-[480px] group cursor-pointer "
            >
             
              <div className="relative w-full flex flex-col h-full">   
                <div className="relative w-full h-[300px] overflow-hidden">
                  <SafeImage id="image_works"
                    src={project.image}
                    fill
                    className="w-full h-full object-cover"
                    alt={project.title}
                    />
                </div>
                <div className="flex flex-col p-6 md:p-10 gap-4 flex-grow">
                  <h1 className="hidden md:flex text-[#9F9F9F] text-[14px]">
                   {project.tags}
                  </h1>
                  <h1 className="text-3xl md:text-[40px] w-full md:w-[90%] leading-[120%] tracking-[-1.24px] font-[700]">
                    {project.title}
                  </h1>
                  <p className="text-[#9F9F9F] line-clamp-none">{project.description}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
