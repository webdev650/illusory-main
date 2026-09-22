"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, ExternalLink, Sparkles } from "lucide-react";
import { CategoryItem } from "./CategoryDropdown";

interface VideoPanelProps {
  category: CategoryItem;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({ category }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Reset playback and error state whenever category changes
  useEffect(() => {
    setIsPlaying(false);
    setHasVideoError(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [category.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setHasVideoError(true));
      }
    }
  };

  return (
    <div
      className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 transform-gpu"
      style={{
        background: "linear-gradient(145deg, rgba(20, 20, 30, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(236, 72, 153, 0.15)",
      }}
    >
      {/* Video Container Aspect Ratio 16:9 */}
      <div className="relative aspect-video w-full bg-black/90 overflow-hidden group">
        {/* Poster frame image fallback / overlay */}
        <img
          src={category.poster}
          alt={category.label}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Video Player element (lazy loaded src) */}
        <video
          ref={videoRef}
          src={category.videoUrl}
          poster={category.poster}
          preload="none"
          loop
          muted
          playsInline
          onError={() => setHasVideoError(true)}
          className="w-full h-full object-cover"
        />

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Big Play / Pause Overlay Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause Video" : "Play Showcase Video"}
          className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-2xl shadow-pink-600/50 backdrop-blur-md transition-all duration-300 group-hover:bg-pink-500 hover:scale-110">
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            )}
          </div>
        </button>

        {/* Placeholder / Video Pending Notice overlay if error loading mp4 asset */}
        {hasVideoError && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
            <Sparkles className="w-10 h-10 text-pink-400 animate-spin" />
            <h4 className="text-xl font-bold font-jakartaSans text-white">
              Interactive 3D Preview Frame
            </h4>
            <p className="text-sm text-gray-400 max-w-md">
              Full 4K showreel video asset for {category.label} currently rendering in studio pipeline.
            </p>
          </div>
        )}

        {/* Client Tag Badge */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-mono bg-black/60 backdrop-blur-md text-pink-400 border border-pink-500/30">
            {category.label}
          </span>
        </div>
      </div>

      {/* Showcase Metadata Panel */}
      <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-mono">
            Featured Client Work
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-jakartaSans text-white">
            {category.clientName}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Action Button */}
        <Link
          href={category.projectUrl}
          className="shrink-0 group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-sm transition-all duration-300 border border-white/20"
        >
          <span>Explore Project</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
};
