"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { careersAPI } from "../../../services/api";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
  } | null;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, job }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolioUrl: "",
    coverLetter: "",
  });

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        jobId: job.id,
        jobTitle: job.title,
      };

      await careersAPI.apply(payload);
      setSubmitStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        portfolioUrl: "",
        coverLetter: "",
      });
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 3000);
    } catch (err: any) {
      console.error("Application error:", err);
      setSubmitStatus("error");
      setErrorMessage(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
            setSubmitStatus(null);
          }
        }} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,102,255,0.15)] z-10 overflow-y-auto max-h-[90vh] text-white font-jakartaSans transition-all duration-300 animate-fade-in">
        <button
          onClick={() => {
            onClose();
            setSubmitStatus(null);
          }}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors text-xl disabled:opacity-50"
        >
          ✕
        </button>

        {submitStatus === "success" ? (
          <div className="py-8 text-center space-y-5">
            <div className="inline-flex p-4 bg-green-500/10 rounded-full text-green-400 mb-2 animate-bounce">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h3 className="text-2xl font-bold">Application Received!</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              Your application for <span className="text-white font-semibold">{job.title}</span> has been logged. Our operations team will reach out to you shortly.
            </p>
          </div>
        ) : (
          <>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-500">Apply Online</span>
              <h3 className="text-2xl font-bold mt-1 text-white tracking-tight">{job.title}</h3>
              <p className="text-gray-400 text-xs mt-1">Ref Reference: #{job.id.padStart(3, '0')}</p>
            </div>

            {submitStatus === "error" && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2.5 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder="+91 99999 88888"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Resume & Portfolio URL *</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  required
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="https://behance.net/john or Google Drive Link"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Cover Letter / Note</label>
                <textarea
                  name="coverLetter"
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all text-xs resize-none"
                  placeholder="Tell us why you want to join our design rebellion..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setSubmitStatus(null);
                  }}
                  disabled={isSubmitting}
                  className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-all text-xs disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-xs flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
