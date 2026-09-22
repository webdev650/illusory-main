"use client";

import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

interface LocationMapProps {
  className?: string;
}

export default function LocationMap({ className = "" }: LocationMapProps) {
  const address = "1007, Shri Ramnagar Marg, Sriram Nagar, Old Town, Bhubaneswar, Odisha 751002";
  const mapsUrl = "https://maps.app.goo.gl/yMF8TgPaac4tVdCv6";
  const embedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.686708632653!2d85.83327097538091!3d20.23033571472196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7003867582b%3A0xeb7a3109131c23cf!2sIllusory%20Design%20Studios%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1790070357342!5m2!1sen!2sin";

  return (
    <section className={`w-full max-w-7xl mx-auto my-12 ${className}`}>
      {/* Main Container Card matching reference UI */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Top Header Section: Split into Left (Heading & Subtitle) & Right (Contacts & Address) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 md:mb-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Need help? Get in touch
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed">
              Feel free to reach out to us for any inquiries or assistance. We&apos;re here to help!
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 pt-2 lg:pt-0">
            {/* Contacts Row */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-900 shrink-0 mt-1" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-base">Contacts</h4>
                <a
                  href="mailto:business@illusorydesignstudios.com"
                  className="block text-slate-600 hover:text-[#FF1284] text-sm transition-colors break-all"
                >
                  business@illusorydesignstudios.com
                </a>
                <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <a href="tel:7681842303" className="hover:text-slate-900 transition-colors">+91 7681842303</a>
                  <span>•</span>
                  <a href="tel:8763923036" className="hover:text-slate-900 transition-colors">+91 8763923036</a>
                </div>
              </div>
            </div>

            {/* Address Row */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-900 shrink-0 mt-1" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-base">Address</h4>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-600 hover:text-[#FF1284] text-sm leading-snug transition-colors"
                >
                  {address}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Full-Width Google Map */}
        <div className="w-full h-[380px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-100">
          <iframe
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Illusory Design Studios Map Location"
            className="w-full h-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
