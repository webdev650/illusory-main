"use client";

import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";

import { contactAPI } from "../../../services/api";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const target = e.target;
    const formData = {
      name: target.name.value,
      email: target.email.value,
      phone: target.phone.value,
      company: target.company.value,
      serviceType: target.serviceType.value,
      budget: `${target.currency.value} ${target.amount.value}`,
      message: target.message.value,
      hearAboutUs: target.hearaboutus.value,
      contactMethod: target.contactmethod.value,
    };

    try {
      // 1. Submit to local backend using the service layer
      const result = await contactAPI.submit(formData);

      // 2. Submit to existing Google Script (optional/backup)
      const googleUrl = "https://script.google.com/macros/s/AKfycbyL0AF6deh6sA0VIls96foirEy1l8N72kNtukELe1qVL_6Y9UoGVC0RIgZ3H6mXrvwAuw/exec";
      
      // Fire and forget google script submission
      fetch(googleUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      }).catch(err => console.error("Google Script error:", err));

      if (result) {
        setSubmitStatus("success");
        target.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
      <div className="bg-gradient-to-r from-[#FF1284]/20 to-[#2407ff]/20 px-8 py-8 border-b border-white/10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Get In Touch</h2>
        <p className="text-gray-400 mt-2 font-medium">
          Let&apos;s discuss your project and bring your ideas to life
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF1284]/20 focus:border-[#FF1284] hover:border-white/20 text-white placeholder-gray-600"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#26E9FF]/20 focus:border-[#26E9FF] hover:border-white/20 text-white placeholder-gray-600"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF1284]/20 focus:border-[#FF1284] hover:border-white/20 text-white placeholder-gray-600"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#26E9FF]/20 focus:border-[#26E9FF] hover:border-white/20 text-white placeholder-gray-600"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="serviceType"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Service Type *
            </label>
            <div className="relative">
              <select
                id="serviceType"
                name="serviceType"
                required
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF1284]/20 focus:border-[#FF1284] hover:border-white/20 text-white appearance-none"
              >
                <option value="" className="bg-black">Select a service</option>
                <option value="graphic-design" className="bg-black">Graphic Design</option>
                <option value="social-media" className="bg-black">Social Media Marketing</option>
                <option value="digital-marketing" className="bg-black">Digital Marketing (SEO / Ads)</option>
                <option value="video-production" className="bg-black">Video Editing & Production</option>
                <option value="influencer-marketing" className="bg-black">Influencer Marketing</option>
                <option value="web-development" className="bg-black">Web Development</option>
                <option value="app-development" className="bg-black">App Development</option>
                <option value="interior-designing" className="bg-black">Interior Designing</option>
                <option value="event-management" className="bg-black">Event Management</option>
                <option value="product-shoot" className="bg-black">Product Shoot</option>
                <option value="wedding-shoot" className="bg-black">Wedding Shoot</option>
                <option value="event-shoot" className="bg-black">Event Shoot</option>
                <option value="logo-designing" className="bg-black">Logo Designing</option>
                <option value="brand-strategy" className="bg-black">Brand & Strategy</option>
                <option value="other" className="bg-black">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="currency-amount"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Estimated Budget
            </label>
            <div className="relative flex items-center">
              <select
                id="currency"
                name="currency"
                className="absolute left-3 h-full px-2 py-2 bg-transparent focus:outline-none text-gray-400"
              >
                <option value="INR" className="bg-black">₹</option>
                <option value="USD" className="bg-black">$</option>
                <option value="EUR" className="bg-black">€</option>
              </select>

              <input
                id="currency-amount"
                name="amount"
                type="number"
                placeholder="0.00"
                className="w-full pl-16 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#26E9FF]/20 focus:border-[#26E9FF] hover:border-white/20 text-white placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="hearaboutus"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              How Did You Hear About Us?
            </label>
            <div className="relative">
              <select
                id="hearaboutus"
                name="hearaboutus"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF1284]/20 focus:border-[#FF1284] hover:border-white/20 text-white"
              >
                <option value="" className="bg-black">Select an option</option>
                <option value="google" className="bg-black">Google Search</option>
                <option value="instagram" className="bg-black">Instagram</option>
                <option value="linkedin" className="bg-black">LinkedIn</option>
                <option value="referral" className="bg-black">Referral</option>
                <option value="client" className="bg-black">Existing Client</option>
                <option value="other" className="bg-black">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="contactmethod"
              className="block text-sm font-semibold text-gray-400 mb-2"
            >
              Preferred Contact Method
            </label>
            <div className="relative">
              <select
                id="contactmethod"
                name="contactmethod"
                className="w-full px-4 py-3 bg-white/5 border-2 appearance-none border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#26E9FF]/20 focus:border-[#26E9FF] hover:border-white/20 text-white"
              >
                <option value="" className="bg-black">Select contact method</option>
                <option value="email" className="bg-black">Email</option>
                <option value="phone" className="bg-black">Phone Call</option>
                <option value="whatsapp" className="bg-black">WhatsApp</option>
                <option value="none" className="bg-black">No preference</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-400 mb-2"
          >
            Project Description *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF1284]/20 focus:border-[#FF1284] hover:border-white/20 text-white placeholder-gray-600 resize-none"
            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
          />
        </div>

        {submitStatus === "success" && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <p>Message sent successfully! We'll get back to you soon.</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>Something went wrong. Please try again or contact us directly.</p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FF1284] to-[#2407ff] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FF1284]/50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,18,132,0.3)] hover:shadow-[0_0_30px_rgba(255,18,132,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Rebellion Message
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
