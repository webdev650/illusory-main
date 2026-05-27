'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/917681842303"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-28 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform duration-300 group flex items-center gap-2"
      aria-label="Chat on WhatsApp"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold">
        Chat with us
      </span>
      <MessageCircle className="w-8 h-8" />
    </a>
  );
};

export default WhatsAppButton;
