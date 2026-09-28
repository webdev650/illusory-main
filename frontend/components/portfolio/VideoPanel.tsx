"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, ExternalLink, Sparkles, Maximize2 } from "lucide-react";
import { CategoryItem } from "./CategoryDropdown";

interface VideoPanelProps {
  category: CategoryItem;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({ category }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      } else {
        videoRef.current.requestFullscreen().catch(console.error);
      }
    }
  };

  const badgeGradient = category.badgeColor || "from-pink-500 to-purple-600";
  const glowStyle = category.glowColor || "rgba(236, 72, 153, 0.3)";

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 transform-gpu group/panel"
      style={{
        background: "linear-gradient(145deg, rgba(18, 18, 28, 0.95) 0%, rgba(8, 8, 14, 0.98) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: `0 30px 60px rgba(0, 0, 0, 0.85), 0 0 50px ${glowStyle}`,
      }}
    >
      {/* Background Neon Theme Glow Ambient */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ background: glowStyle }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ background: glowStyle }}
      />

      {/* Video Container Aspect Ratio 16:9 */}
      <div className="relative aspect-video w-full bg-black overflow-hidden group/video">
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

        {/* Overlay Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none z-20" />

        {/* Top Badges & Controls */}
        <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
          {/* Category Tag & Feature Tag */}
          <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
            <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-gradient-to-r ${badgeGradient} shadow-lg shadow-pink-500/20 uppercase tracking-wider`}>
              {category.label}
            </span>
            {category.tag && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 backdrop-blur-md text-white/90 border border-white/15">
                {category.tag}
              </span>
            )}
          </div>

          {/* Fullscreen Button */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Audio Control */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-3 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-xl"
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
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${badgeGradient} text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 group-hover/btn:scale-110 ${
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

        {/* Error overlay fallback */}
        {hasVideoError && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
            <Sparkles className="w-10 h-10 text-pink-400 animate-spin" />
            <h4 className="text-xl font-bold font-jakartaSans text-white">
              Interactive 3D Showreel
            </h4>
            <p className="text-sm text-gray-400 max-w-md">
              Showreel video stream for {category.label} buffering...
            </p>
          </div>
        )}
      </div>

      {/* Showcase Metadata Panel */}
      <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-b from-transparent to-white/[0.03] relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold">
              FEATURED CLIENT WORK
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-jakartaSans text-white tracking-tight">
            {category.clientName}
          </h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Action Button */}
        <Link
          href={category.projectUrl}
          className={`shrink-0 group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r ${badgeGradient} text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-pink-500/20 hover:scale-105`}
        >
          <span>Explore Case Study</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
};
