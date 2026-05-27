"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { projectsAPI } from "../../../services/api";
import { cleanCloudinaryUrl } from "../../lib/cloudinary";

import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import { WorksDesLayout } from "@/app/components/WorksDesLayout";
import HorizontalScroll from "@/app/components/HorizontalScroll";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getOne(slug as string);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!project) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Project not found</div>;

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];

  return (
    <>
      <WorksDesLayout
        logo={null} // Dynamic projects might not have a specific SVG logo in the backend yet
        title={project.title}
        subtitle={project.tags}
      />

      <section className="section-class">
        <div className="max-w-7xl w-full mx-auto">
          <div className="w-full flex flex-col lg:flex-row gap-10">
            <p className="max-w-2xl text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.video && (
            <div className="mt-20 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <video
                src={cleanCloudinaryUrl(project.video)}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-10">Project Gallery</h2>
            <HorizontalScroll images={images} />
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="flex w-full justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full font-jakartaSans py-[120px]">
          <div className="flex justify-between items-center border-t border-white/10 pt-10">
            <Link
              href="/works"
              className="hover:text-[#FF1284] transition duration-300 text-xl font-bold flex items-center gap-2"
            >
              ← Back to All Works
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </>
  );
};

export default ProjectDetail;
