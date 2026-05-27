"use client";

import React, { useEffect, useRef, useState } from "react";
import { App } from "../components/App";
import { packageAPI } from "../../services/api";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function PackagesPage() {
  // DB-driven data states
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [popularIndustries, setPopularIndustries] = useState<string[]>([]);
  const [servicePackages, setServicePackages] = useState<any[]>([]);

  // Selection & filter states
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedIndustryChip, setSelectedIndustryChip] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Accordion details expansion states
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<any>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  // Modal & Form Lead states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackageTier, setSelectedPackageTier] = useState<"starter" | "growth" | "premium" | "">("");
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState("");
  const [leadErrorMsg, setLeadErrorMsg] = useState("");

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch initial dynamic data from MongoDB collections on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statesData, pkgsData] = await Promise.all([
          packageAPI.getStates(),
          packageAPI.getServicePackages()
        ]);
        setStates(statesData);
        setServicePackages(pkgsData);
      } catch (err) {
        console.error("Error loading package data from DB:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch districts when state is updated
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setSelectedDistrict("");
      setPopularIndustries([]);
      setSelectedIndustryChip("");
      return;
    }

    const fetchDistricts = async () => {
      try {
        const dists = await packageAPI.getDistricts(selectedState);
        setDistricts(dists);
        setSelectedDistrict("");
        setPopularIndustries([]);
        setSelectedIndustryChip("");
      } catch (err) {
        console.error("Error loading districts:", err);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // Fetch popular industries when district is updated
  useEffect(() => {
    if (!selectedState || !selectedDistrict) {
      setPopularIndustries([]);
      setSelectedIndustryChip("");
      return;
    }

    const fetchIndustries = async () => {
      try {
        const inds = await packageAPI.getIndustries(selectedState, selectedDistrict);
        setPopularIndustries(inds);
        setSelectedIndustryChip("");
      } catch (err) {
        console.error("Error loading popular industries:", err);
      }
    };
    fetchIndustries();
  }, [selectedState, selectedDistrict]);

  // Handle accordion inline expansion
  const toggleExpandIndustry = async (industryName: string) => {
    if (expandedIndustry === industryName) {
      setExpandedIndustry(null);
      setExpandedData(null);
      return;
    }

    setExpandedIndustry(industryName);
    setExpandedData(null);
    setLoadingEstimate(true);

    try {
      const data = await packageAPI.getEstimate(industryName);
      setExpandedData(data);
      
      // Smooth scroll to card
      setTimeout(() => {
        cardRefs.current[industryName]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } catch (err) {
      console.error("Error loading estimate details:", err);
    } finally {
      setLoadingEstimate(false);
    }
  };

  // Open lead capture form and prepopulate parameters
  const triggerLeadQuote = (tier: "starter" | "growth" | "premium") => {
    setSelectedPackageTier(tier);
    setIsModalOpen(true);
    setLeadSuccessMsg("");
    setLeadErrorMsg("");
  };

  // Submit Lead Form
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone) {
      setLeadErrorMsg("Please fill out all required fields.");
      return;
    }

    setSubmittingLead(true);
    setLeadSuccessMsg("");
    setLeadErrorMsg("");

    try {
      const selectedPkgInfo = expandedData?.packages[selectedPackageTier || "growth"];
      
      const leadPayload = {
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        businessName: onboardBusinessName(),
        state: selectedState || "N/A",
        district: selectedDistrict || "N/A",
        industry: expandedIndustry || "General",
        selectedPackage: selectedPackageTier ? selectedPackageTier.toUpperCase() : "GROWTH",
        estimatedBudget: selectedPkgInfo?.priceRange || "Custom Quote",
        message: leadForm.message || `Request for ${expandedIndustry} - ${selectedPackageTier.toUpperCase()} package.`,
        status: "New",
      };

      await packageAPI.submitLead(leadPayload);
      setLeadSuccessMsg("Request submitted! Our team will send confirmation shortly.");
      setLeadForm({ name: "", email: "", phone: "", message: "" });
      
      setTimeout(() => {
        setIsModalOpen(false);
        setLeadSuccessMsg("");
      }, 2500);
    } catch (err: any) {
      setLeadErrorMsg(err.message || "Failed to submit request. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  // Helper to extract or generate business name
  const onboardBusinessName = () => {
    return `${expandedIndustry || "Client"} Business`;
  };

  // Filtering Logic for Industry Cards
  const filteredPackages = servicePackages.filter((pkg) => {
    // 1. Search Query filter (checks category, industry, and subsegments)
    const matchesSearch = searchQuery
      ? [pkg.category, pkg.industry, pkg.subSegments]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    // 2. Clicked Popular Industry chip filter
    const matchesChip = selectedIndustryChip
      ? pkg.industry.toLowerCase() === selectedIndustryChip.toLowerCase()
      : true;

    return matchesSearch && matchesChip;
  });

  return (
    <>
      {/* 3D background Canvas overlay */}
      <App
        head1="Data-driven"
        head2="packages for"
        head3="your business"
        head4="success."
      />

      <section className="relative bg-black text-white py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
        {/* Glow meshes */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[130px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-pink-500 text-sm tracking-wider uppercase font-semibold">
              Interactive Estimator
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-jakartaSans mt-2 tracking-tight">
              Bespoke Package Calculator
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mt-4">
              All plans and options are driven dynamically from our MongoDB templates. Pick your location and select an industry to expand detailed content deliverables.
            </p>
          </div>

          {/* SECTION 1: LOCATION FILTER */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl mb-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              
              {/* Location selector dropdowns */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Filter by Location (State & District)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* State selector */}
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="">Select State</option>
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  {/* District selector */}
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-40"
                    disabled={!selectedState}
                  >
                    <option value="">Select District</option>
                    {districts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic industry text search query */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Search Industry or Category
                </label>
                <input
                  type="text"
                  placeholder="Type to filter e.g. Cafe, B2B, Tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

            </div>

            {/* Popular industries filter chips (converted from popularIndustries string) */}
            {selectedDistrict && (
              <div className="border-t border-white/10 pt-6 mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Popular Industries in {selectedDistrict}
                </h4>
                {popularIndustries.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setSelectedIndustryChip("")}
                      className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        !selectedIndustryChip
                          ? "bg-white text-black border-transparent"
                          : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      All ({filteredPackages.length})
                    </button>
                    {popularIndustries.map((ind) => {
                      const isChipSelected = selectedIndustryChip.toLowerCase() === ind.toLowerCase();
                      return (
                        <button
                          key={ind}
                          onClick={() => setSelectedIndustryChip(ind)}
                          className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                            isChipSelected
                              ? "bg-gradient-to-r from-pink-500 to-violet-600 border-transparent text-white"
                              : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                          }`}
                        >
                          {ind}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs">No specific industries logged for this area. Browse general cards below.</p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: INDUSTRY GRID */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold tracking-tight font-jakartaSans">
                Available Industries ({filteredPackages.length})
              </h3>
              {selectedIndustryChip && (
                <button
                  onClick={() => setSelectedIndustryChip("")}
                  className="text-pink-500 text-xs font-bold hover:underline"
                >
                  Clear Chip Filter
                </button>
              )}
            </div>

            {filteredPackages.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-400 text-sm">No industry cards match your query in database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => {
                  const isExpanded = expandedIndustry === pkg.industry;
                  return (
                    <div
                      key={pkg._id}
                      ref={(el) => { cardRefs.current[pkg.industry] = el; }}
                      className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 flex flex-col justify-between ${
                        isExpanded ? "ring-2 ring-pink-500/80 shadow-[0_0_40px_rgba(236,72,153,0.1)]" : ""
                      }`}
                    >
                      <div>
                        {/* Upper row: category and type */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] uppercase font-extrabold tracking-widest text-pink-500">
                            {pkg.category}
                          </span>
                          <span className="bg-white/10 text-gray-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            {pkg.type || "Service"}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xl font-bold text-white mb-2">{pkg.industry}</h4>
                        
                        {/* Subsegment info */}
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                          {pkg.subSegments}
                        </p>
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => toggleExpandIndustry(pkg.industry)}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex justify-center items-center gap-2 ${
                          isExpanded
                            ? "bg-white text-black"
                            : "bg-white/10 hover:bg-white/15 text-white"
                        }`}
                      >
                        {isExpanded ? "▲ Close Packages" : "▼ View Packages"}
                      </button>

                      {/* SECTION 4: DYNAMIC ACCORDION UI (INLINE EXPANSION) */}
                      {isExpanded && (
                        <div className="border-t border-white/10 pt-6 mt-6 w-full transition-all duration-500">
                          {loadingEstimate ? (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mb-2"></div>
                              <p className="text-gray-400 text-xs">Computing database pricing...</p>
                            </div>
                          ) : expandedData ? (
                            <div className="space-y-8 animate-fade-in">
                              
                              {/* 3 Tier Estimates Grid */}
                              <div className="grid grid-cols-1 gap-6">
                                
                                {/* Starter, Growth, Premium packages details */}
                                {["starter", "growth", "premium"].map((tierKey) => {
                                  const tier = expandedData.packages[tierKey];
                                  const isGrowth = tierKey === "growth";
                                  return (
                                    <div
                                      key={tierKey}
                                      className={`p-6 rounded-xl border flex flex-col justify-between transition-all ${
                                        isGrowth
                                          ? "bg-gradient-to-r from-zinc-900 to-black border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.05)]"
                                          : "bg-black/40 border-white/10"
                                      }`}
                                    >
                                      <div>
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <span className="text-[10px] text-pink-400 uppercase tracking-widest font-extrabold">{tierKey} package</span>
                                            <h5 className="text-lg font-bold text-white mt-0.5">{tier.name}</h5>
                                          </div>
                                          <span className="text-xs font-bold text-gray-400">Timeline: {tier.timeline}</span>
                                        </div>

                                        {/* Cost */}
                                        <div className="my-4">
                                          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            {tier.priceRange}
                                          </span>
                                        </div>

                                        {/* Render parsed monthly metrics */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3 rounded-lg text-xs mb-4">
                                          <div>
                                            <span className="text-gray-400 block">Posts</span>
                                            <span className="font-bold text-white text-sm">{tier.posts}</span>
                                          </div>
                                          <div>
                                            <span className="text-gray-400 block">Reels</span>
                                            <span className="font-bold text-white text-sm">{tier.reels}</span>
                                          </div>
                                          <div>
                                            <span className="text-gray-400 block">Stories</span>
                                            <span className="font-bold text-white text-sm">{tier.stories}</span>
                                          </div>
                                          <div>
                                            <span className="text-gray-400 block">Carousels</span>
                                            <span className="font-bold text-white text-sm">{tier.carousels}</span>
                                          </div>
                                        </div>

                                        {/* Deliverables details bullet points */}
                                        <div className="border-t border-white/5 pt-3">
                                          <h6 className="text-[10px] uppercase text-gray-400 font-extrabold mb-2">Scope Deliverables:</h6>
                                          <ul className="text-xs text-gray-300 space-y-2">
                                            {tier.deliverables.split(",").map((del: string, idx: number) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <span className="text-pink-500">✓</span>
                                                <span>{del.trim()}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>

                                      {/* Get Quote button trigger */}
                                      <button
                                        onClick={() => triggerLeadQuote(tierKey as any)}
                                        className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-2.5 rounded-lg text-xs mt-5 transition-all"
                                      >
                                        Get Quote
                                      </button>
                                    </div>
                                  );
                                })}

                              </div>

                            </div>
                          ) : (
                            <p className="text-gray-500 text-xs text-center">Failed to load estimation.</p>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scope rules comparators */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12">
            <h4 className="text-xl font-bold mb-6 font-jakartaSans text-center md:text-left">Scope Boundaries & Project Rules</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                <h5 className="font-bold text-gray-200 mb-2">1. Paid Ads Excluded</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  All budget estimates describe Illusory design and marketing work. Meta Ad spend budgets or search campaign bills are funded directly by the client.
                </p>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                <h5 className="font-bold text-gray-200 mb-2">2. Dynamic Multipliers</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Our calculations adjust automatically based on industry complexity multipliers (low: 0.8x, medium: 1.25x, high: 2.5x) and parsed monthly reel deliverables.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-200 mb-2">3. Visual Production add-ons</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Bespoke additions like dynamic three.js components, commercial photo shoots, and catalog builders are estimated upon request during kickoff.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: AUTO FILLED LEAD FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-zinc-950 border border-white/15 p-8 rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold font-jakartaSans text-white">Request Bespoke Proposal</h3>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
              Auto-filled details for your request:
            </p>

            {/* Prepopulated details summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Industry</span>
                <span className="font-bold text-white">{expandedIndustry}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Package Tier</span>
                <span className="font-bold text-pink-400 uppercase">{selectedPackageTier}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Estimated Budget</span>
                <span className="font-bold text-white">{expandedData?.packages[selectedPackageTier || ""]?.priceRange}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Location</span>
                <span className="font-bold text-white truncate">
                  {selectedDistrict ? `${selectedDistrict}, ` : ""}{selectedState || "General"}
                </span>
              </div>
            </div>

            {leadSuccessMsg && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-xs">
                {leadSuccessMsg}
              </div>
            )}

            {leadErrorMsg && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs">
                {leadErrorMsg}
              </div>
            )}

            {/* User Details Entry */}
            <form onSubmit={handleLeadSubmit} className="mt-6 space-y-4 font-jakartaSans">
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
                    placeholder="+91 99999 88888"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Special Custom Requirements</label>
                <textarea
                  rows={3}
                  value={leadForm.message}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all text-xs"
                  placeholder="E.g. We also need custom web portal components or monthly video shoot add-ons..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-2/3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-xs"
                >
                  {submittingLead ? "Submitting..." : "Submit Quote Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FAQ />
      <Footer />
    </>
  );
}
