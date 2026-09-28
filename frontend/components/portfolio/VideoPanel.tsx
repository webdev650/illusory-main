"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, ExternalLink, Sparkles } from "lucide-react";
import { CategoryItem } from "./CategoryDropdown";

interface VideoPanelProps {
  category: CategoryItem;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({ category }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Auto-play video whenever category changes
  useEffect(() => {
    setIsVideoLoaded(false);
    setHasVideoError(false);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsVideoLoaded(true);
          })
          .catch((err) => {
            console.warn("Autoplay attempt failed:", err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => {
                setIsPlaying(false);
              });
            }
          });
      }
    }
  }, [category.id, category.videoUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsVideoLoaded(true);
          })
          .catch(() => setHasVideoError(true));
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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
      <div className="relative aspect-video w-full bg-black overflow-hidden group">
        {/* Video Player element */}
        <video
          key={category.id}
          ref={videoRef}
          src={category.videoUrl}
          poster={category.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => setIsVideoLoaded(true)}
          onPlaying={() => {
            setIsVideoLoaded(true);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasVideoError(true)}
          className="w-full h-full object-cover relative z-0"
        />

        {/* Poster image fallback overlay (fades out as video plays) */}
        <img
          src={category.poster}
          alt={category.label}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 pointer-events-none ${
            isVideoLoaded && isPlaying ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-20" />

        {/* Audio Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-gray-300" /> : <Volume2 className="w-5 h-5 text-pink-400" />}
          </button>
        </div>

        {/* Center Play/Pause Control Overlay */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20 group/btn"
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-2xl shadow-pink-600/50 backdrop-blur-md transition-all duration-300 group-hover/btn:scale-110 ${
              isPlaying ? "opacity-0 group-hover/btn:opacity-100" : "opacity-100 scale-105"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            )}
          </div>
        </div>

        {/* Error / Rendering overlay fallback */}
        {hasVideoError && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
            <Sparkles className="w-10 h-10 text-pink-400 animate-spin" />
            <h4 className="text-xl font-bold font-jakartaSans text-white">
              Interactive 3D Showreel
            </h4>
            <p className="text-sm text-gray-400 max-w-md">
              Full 4K showreel video asset for {category.label} currently rendering in studio pipeline.
            </p>
          </div>
        )}

        {/* Client Tag Badge */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
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
