"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Copy, Check, ExternalLink, Clock } from "lucide-react";

interface LocationMapProps {
  className?: string;
  showTitle?: boolean;
}

export default function LocationMap({ className = "", showTitle = true }: LocationMapProps) {
  const [copied, setCopied] = useState(false);

  const address = "1007, Shri Ramnagar Marg, Sriram Nagar, Old Town, Bhubaneswar, Odisha 751002";
  const mapsUrl = "https://maps.app.goo.gl/yMF8TgPaac4tVdCv6";
  const embedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.686708632653!2d85.83327097538091!3d20.23033571472196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7003867582b%3A0xeb7a3109131c23cf!2sIllusory%20Design%20Studios%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1790070357342!5m2!1sen!2sin";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full ${className}`}>
      {showTitle && (
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF1284]/10 border border-[#FF1284]/20 text-[#FF1284] text-sm font-semibold tracking-wider uppercase mb-4">
            <MapPin className="w-4 h-4" />
            Our Studio Location
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Visit Illusory Design Studios
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Located in the heart of Bhubaneswar. Drop by for a cup of coffee and let&apos;s build something extraordinary together.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto">
        {/* Left Info Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF1284]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF1284]/30 transition-all duration-500" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#26E9FF]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#26E9FF]/30 transition-all duration-500" />

          <div className="relative z-10 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#FF1284] uppercase tracking-widest">
                Headquarters
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Illusory Design Studios PVT LTD
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 text-gray-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#FF1284] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Address</p>
                  <p className="text-base text-gray-200 leading-relaxed font-medium mt-0.5">
                    1007, Shri Ramnagar Marg, Sriram Nagar, Old Town, Bhubaneswar, Odisha 751002
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#26E9FF] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Studio Hours</p>
                  <p className="text-base text-gray-200 font-medium mt-0.5">
                    Mon - Sat: 9:30 AM - 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-white/10 space-y-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FF1284] to-[#e00d72] hover:from-[#e00d72] hover:to-[#FF1284] text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,18,132,0.3)] hover:shadow-[0_0_25px_rgba(255,18,132,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
              <ExternalLink className="w-4 h-4 ml-auto opacity-70" />
            </a>

            <button
              onClick={handleCopyAddress}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Address Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Copy Full Address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Embedded Google Map */}
        <div className="lg:col-span-7 h-[420px] lg:h-auto min-h-[380px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative shadow-2xl group">
          <iframe
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Illusory Design Studios Google Maps Location"
            className="w-full h-full rounded-3xl transition-opacity duration-300"
          />
        </div>
      </div>
    </div>
  );
}
