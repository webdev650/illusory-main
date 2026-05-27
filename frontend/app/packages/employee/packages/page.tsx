"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMPackages() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [packages, setPackages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Selector / Modal states
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [packageForm, setPackageForm] = useState({
    serialNumber: "",
    category: "",
    industry: "",
    subSegments: "",
    type: "",
    basic: "",
    basicDeliverables: "",
    standard: "",
    standardDeliverables: "",
    premium: "",
    premiumDeliverables: ""
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_token");
    const savedUser = localStorage.getItem("illusory_user");

    if (!savedToken || !savedUser) {
      router.push("/packages/employee/login");
      return;
    }

    setToken(savedToken);
    setCurrentUser(JSON.parse(savedUser));
    fetchPackagesData(savedToken);
  }, [router]);

  const fetchPackagesData = async (authToken: string) => {
    setLoading(true);
    try {
      const pkgs = await packageAPI.getServicePackages();
      setPackages(pkgs || []);
      
      const cats = await packageAPI.getCategories();
      setCategories(cats || []);

      const locs = await packageAPI.getLocations(authToken);
      setLocations(locs || []);
    } catch (err) {
      console.error("Error loading packages data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse post/reel/story counts
  const parseMetrics = (text: string) => {
    let posts = 12;
    let reels = 4;
    let stories = 15;
    let carousels = 2;
    let hasWebsite = false;

    if (!text) return { posts, reels, stories, carousels, hasWebsite };
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("website") || lowerText.includes("portal") || lowerText.includes("landing page")) {
      hasWebsite = true;
    }

    const postMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:posts|content|creatives|pieces)/);
    if (postMatch) {
      const minVal = parseInt(postMatch[1]);
      const maxVal = postMatch[2] ? parseInt(postMatch[2]) : minVal;
      posts = Math.round((minVal + maxVal) / 2);
    }

    const reelMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:reels|shorts|videos)/);
    if (reelMatch) {
      const minVal = parseInt(reelMatch[1]);
      const maxVal = reelMatch[2] ? parseInt(reelMatch[2]) : minVal;
      reels = Math.round((minVal + maxVal) / 2);
    }

    const storyMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:stories|engagements)/);
    if (storyMatch) {
      const minVal = parseInt(storyMatch[1]);
      const maxVal = storyMatch[2] ? parseInt(storyMatch[2]) : minVal;
      stories = Math.round((minVal + maxVal) / 2);
    } else {
      stories = Math.round(posts * 1.5);
    }

    const carouselMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:carousels)/);
    if (carouselMatch) {
      const minVal = parseInt(carouselMatch[1]);
      const maxVal = carouselMatch[2] ? parseInt(carouselMatch[2]) : minVal;
      carousels = Math.round((minVal + maxVal) / 2);
    }

    return { posts, reels, stories, carousels, hasWebsite };
  };

  // Helper to determine pricing tier and pricing range
  const getPricingMetrics = (pkg: any) => {
    // We can fetch estimate pricing values directly from estimate formula client side
    // Starter: Base Min/Max with deliverables base additions
    const starterMetrics = parseMetrics(pkg.basicDeliverables || "");
    const growthMetrics = parseMetrics(pkg.standardDeliverables || "");
    const premiumMetrics = parseMetrics(pkg.premiumDeliverables || "");

    const getPrices = (tier: string, metrics: any) => {
      let multiplier = 1.0;
      const name = (pkg.category + " " + pkg.industry).toLowerCase();
      
      if (name.includes("hospital") || name.includes("healthcare") || name.includes("medical") || name.includes("clinic") || name.includes("doctor")) {
        multiplier = 2.5;
      } else if (name.includes("tech") || name.includes("software") || name.includes("saas") || name.includes("it services") || name.includes("corporate") || name.includes("b2b")) {
        multiplier = 2.0;
      } else if (name.includes("real estate") || name.includes("property") || name.includes("interior") || name.includes("architecture")) {
        multiplier = 1.8;
      } else if (name.includes("cafe") || name.includes("restaurant") || name.includes("food") || name.includes("bakery") || name.includes("hotel") || name.includes("resort")) {
        multiplier = 1.5;
      } else if (name.includes("beauty") || name.includes("salon") || name.includes("spa") || name.includes("fashion") || name.includes("boutique") || name.includes("makeup") || name.includes("textile")) {
        multiplier = 1.25;
      } else if (name.includes("ngo") || name.includes("foundation") || name.includes("social")) {
        multiplier = 0.8;
      }

      let basePriceMin = 5000;
      let basePriceMax = 10000;
      let timeline = "15 days";

      if (tier === "growth") {
        basePriceMin = 10000;
        basePriceMax = 20000;
        timeline = "30 days";
      } else if (tier === "premium") {
        basePriceMin = 20000;
        basePriceMax = 40000;
        timeline = "45 days";
      }

      const postCost = metrics.posts * 150;
      const reelCost = metrics.reels * 800;
      const storyCost = metrics.stories * 50;
      const carouselCost = metrics.carousels * 300;
      const websiteCost = metrics.hasWebsite ? 8000 : 0;

      const deliverablesCost = postCost + reelCost + storyCost + carouselCost + websiteCost;

      let finalMin = (basePriceMin + deliverablesCost) * multiplier;
      let finalMax = (basePriceMax + deliverablesCost) * multiplier;

      finalMin = Math.round(finalMin / 1000) * 1000;
      finalMax = Math.round(finalMax / 1000) * 1000;

      if (finalMin < 5000) finalMin = 5000;
      if (finalMax < finalMin + 5000) finalMax = finalMin + 5000;

      let marginPct = 0.20;
      if (tier === "growth") marginPct = 0.25;
      if (tier === "premium") marginPct = 0.30;
      
      const internalCost = Math.round(finalMin * (1 - marginPct));
      const profit = Math.round(finalMin * marginPct);

      return {
        min: finalMin,
        max: finalMax,
        sellingPrice: finalMin,
        internalCost,
        profit,
        marginPct: Math.round(marginPct * 100),
        timeline
      };
    };

    return {
      starter: getPrices("starter", starterMetrics),
      growth: getPrices("growth", growthMetrics),
      premium: getPrices("premium", premiumMetrics)
    };
  };

  const getSuitableLocations = (pkgIndustry: string) => {
    if (!locations) return [];
    const matches = locations.filter((loc: any) => {
      const inds = (loc.popularIndustries || "")
        .split(",")
        .map((s: string) => s.trim().toLowerCase());
      return inds.includes(pkgIndustry.toLowerCase());
    });
    return matches.map((m: any) => `${m.district}, ${m.state}`);
  };

  const handleOpenEdit = (pkg: any) => {
    setSelectedPkg(pkg);
    setPackageForm({
      serialNumber: String(pkg.serialNumber || ""),
      category: pkg.category || "",
      industry: pkg.industry || "",
      subSegments: pkg.subSegments || "",
      type: pkg.type || "",
      basic: pkg.basic || "",
      basicDeliverables: pkg.basicDeliverables || "",
      standard: pkg.standard || "",
      standardDeliverables: pkg.standardDeliverables || "",
      premium: pkg.premium || "",
      premiumDeliverables: pkg.premiumDeliverables || ""
    });
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setPackageForm({
      serialNumber: String(packages.length + 1),
      category: "",
      industry: "",
      subSegments: "",
      type: "B2B",
      basic: "STARTER",
      basicDeliverables: "12 Posts, 4 Reels, 15 Stories, 2 Carousel",
      standard: "GROWTH",
      standardDeliverables: "24 Posts, 15 Reels, 36 Stories, 4 Carousel",
      premium: "PREMIUM",
      premiumDeliverables: "36 Posts, 24 Reels, 50 Stories, 8 Carousel + Website + SEO + Branding"
    });
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const payload = {
        ...packageForm,
        serialNumber: Number(packageForm.serialNumber)
      };
      const response = await packageAPI.createServicePackage(payload, token);
      if (response.success) {
        setPackages(prev => [...prev, response.servicePkg].sort((a, b) => a.serialNumber - b.serialNumber));
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedPkg) return;

    try {
      const payload = {
        ...packageForm,
        serialNumber: Number(packageForm.serialNumber)
      };
      const response = await packageAPI.updateServicePackage(selectedPkg._id, payload, token);
      if (response.success) {
        setPackages(prev =>
          prev.map(p => (p._id === selectedPkg._id ? response.servicePkg : p)).sort((a, b) => a.serialNumber - b.serialNumber)
        );
        setIsEditModalOpen(false);
        if (selectedPkg && selectedPkg._id === response.servicePkg._id) {
          setSelectedPkg(response.servicePkg);
        }
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to permanently delete this package?")) return;

    try {
      await packageAPI.deleteServicePackage(id, token);
      setPackages(prev => prev.filter(p => p._id !== id));
      setIsViewDrawerOpen(false);
      setSelectedPkg(null);
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const isPrivileged = currentUser?.role.toLowerCase() === "admin" || currentUser?.role.toLowerCase() === "manager";

  return (
    <div className="space-y-8 animate-fade-in relative font-jakartaSans text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Packages Registry</h1>
          <p className="text-gray-400 text-sm mt-1">Review dynamic package deliverables, timelines, suitability, and employee costing breakdowns.</p>
        </div>
        <div className="flex gap-3">
          {isPrivileged && (
            <button
              onClick={handleOpenAdd}
              className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 rounded-xl px-4 py-2 text-sm font-bold transition-all"
            >
              + Create Service Package
            </button>
          )}
          <button
            onClick={() => token && fetchPackagesData(token)}
            disabled={loading}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all"
          >
            {loading ? "Syncing..." : "↻ Sync DB"}
          </button>
        </div>
      </div>

      {/* Main Grid/Table */}
      {loading && packages.length === 0 ? (
        <div className="py-12 text-center text-gray-500">Retrieving catalog packages...</div>
      ) : packages.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm">No packages found in the database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const pricing = getPricingMetrics(pkg);
            const starterMetrics = parseMetrics(pkg.basicDeliverables);
            const growthMetrics = parseMetrics(pkg.standardDeliverables);
            const premiumMetrics = parseMetrics(pkg.premiumDeliverables);

            return (
              <div
                key={pkg._id}
                className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-pink-500/30 transition-all duration-300 relative overflow-hidden group shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 rounded">
                      {pkg.category || "General"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold"># {pkg.serialNumber}</span>
                  </div>

                  <h3 className="text-lg font-bold mt-3 text-white group-hover:text-pink-400 transition-colors">
                    {pkg.industry}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 italic line-clamp-1">{pkg.subSegments || "All sectors"}</p>

                  {/* Deliverables summary */}
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500">Growth Tier Deliverables</span>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed line-clamp-2">
                        {pkg.standardDeliverables || "N/A"}
                      </p>
                      <div className="flex gap-2.5 mt-1.5 text-[10px] text-gray-400">
                        <span>📝 {growthMetrics.posts} Posts</span>
                        <span>🎥 {growthMetrics.reels} Reels</span>
                        <span>📱 {growthMetrics.stories} Stories</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown (Employee Only) */}
                  <div className="mt-5 p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <span className="text-[9px] uppercase font-bold text-pink-400 tracking-wider">Pricing Breakdown (Employee Only)</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-1">
                      <div className="border-r border-white/5">
                        <span className="text-[9px] text-gray-500 block">Starter</span>
                        <span className="font-bold text-white">₹{pricing.starter.sellingPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="border-r border-white/5">
                        <span className="text-[9px] text-gray-500 block">Growth</span>
                        <span className="font-bold text-white">₹{pricing.growth.sellingPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block">Premium</span>
                        <span className="font-bold text-white">₹{pricing.premium.sellingPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    
                    {/* Growth cost detail preview */}
                    <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2 mt-1">
                      <div>
                        <span className="text-gray-500">Growth Cost:</span>
                        <span className="text-red-400 font-bold ml-1">₹{pricing.growth.internalCost.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Margin:</span>
                        <span className="text-green-400 font-extrabold ml-1">₹{pricing.growth.profit.toLocaleString("en-IN")} ({pricing.growth.marginPct}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedPkg(pkg);
                      setIsViewDrawerOpen(true);
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2 rounded-xl text-xs transition-all text-center"
                  >
                    View Details
                  </button>
                  {isPrivileged && (
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-300 font-bold px-3 py-2 rounded-xl text-xs transition-all"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PACKAGE DETAIL SHEET */}
      {isViewDrawerOpen && selectedPkg && (() => {
        const pricing = getPricingMetrics(selectedPkg);
        const suitable = getSuitableLocations(selectedPkg.industry);
        return (
          <div className="fixed inset-0 z-50 overflow-hidden font-jakartaSans text-white">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewDrawerOpen(false)} />
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-lg bg-zinc-950 border-l border-white/10 p-6 md:p-8 flex flex-col justify-between overflow-y-auto relative shadow-2xl">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                        Package Specifications
                      </span>
                      <h2 className="text-2xl font-bold mt-2">{selectedPkg.industry}</h2>
                      <p className="text-gray-400 text-xs mt-0.5">Category: {selectedPkg.category}</p>
                    </div>
                    <button onClick={() => setIsViewDrawerOpen(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
                  </div>

                  <div className="space-y-6 text-sm">
                    {/* Sub segments */}
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Sub Segments</span>
                      <p className="text-xs text-gray-300 mt-1">{selectedPkg.subSegments || "General Segment"}</p>
                    </div>

                    {/* Suitability */}
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Suitable Locations suitability</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {suitable.length === 0 ? (
                          <span className="text-xs text-gray-500">No matching suitable districts mapped.</span>
                        ) : (
                          suitable.map((loc, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-full">
                              📍 {loc}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Starter details */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white">Starter Package ({pricing.starter.timeline})</span>
                        <span className="text-xs font-bold text-pink-400">₹{pricing.starter.sellingPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-gray-400 italic mt-1">{selectedPkg.basicDeliverables}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-gray-500">Internal Cost Base:</span>
                          <span className="text-red-400 font-bold ml-1">₹{pricing.starter.internalCost.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Profit:</span>
                          <span className="text-green-400 font-bold ml-1">₹{pricing.starter.profit.toLocaleString("en-IN")} ({pricing.starter.marginPct}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Growth details */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white">Growth Package ({pricing.growth.timeline})</span>
                        <span className="text-xs font-bold text-pink-400">₹{pricing.growth.sellingPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-gray-400 italic mt-1">{selectedPkg.standardDeliverables}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-gray-500">Internal Cost Base:</span>
                          <span className="text-red-400 font-bold ml-1">₹{pricing.growth.internalCost.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Profit:</span>
                          <span className="text-green-400 font-bold ml-1">₹{pricing.growth.profit.toLocaleString("en-IN")} ({pricing.growth.marginPct}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Premium details */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white">Premium Package ({pricing.premium.timeline})</span>
                        <span className="text-xs font-bold text-pink-400">₹{pricing.premium.sellingPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-gray-400 italic mt-1">{selectedPkg.premiumDeliverables}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-gray-500">Internal Cost Base:</span>
                          <span className="text-red-400 font-bold ml-1">₹{pricing.premium.internalCost.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Profit:</span>
                          <span className="text-green-400 font-bold ml-1">₹{pricing.premium.profit.toLocaleString("en-IN")} ({pricing.premium.marginPct}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Internal Notes</span>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                        Complexity Multiplier: {
                          selectedPkg.industry.toLowerCase().includes("hospital") || selectedPkg.industry.toLowerCase().includes("healthcare") ? "2.5x (High Tier Complexity)" :
                          selectedPkg.industry.toLowerCase().includes("tech") || selectedPkg.industry.toLowerCase().includes("software") ? "2.0x" :
                          selectedPkg.industry.toLowerCase().includes("real estate") ? "1.8x" : "1.5x / 1.0x"
                        }. Rates dynamically calculated base values derived from imported excel formulas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex gap-3">
                  {isPrivileged && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(selectedPkg)}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 font-bold py-2.5 rounded-xl text-xs transition-all text-white text-center"
                      >
                        Edit Package Parameters
                      </button>
                      <button
                        onClick={() => handleDeletePackage(selectedPkg._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 font-bold py-2.5 px-4 rounded-xl text-xs transition-all text-center"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Create Service Package</h3>
                <p className="text-xs text-gray-400 mt-1">Configure service deliverables and multipliers.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Serial Number</label>
                  <input
                    type="number"
                    required
                    value={packageForm.serialNumber}
                    onChange={(e) => setPackageForm(p => ({ ...p, serialNumber: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Healthcare"
                    value={packageForm.category}
                    onChange={(e) => setPackageForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Industry Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Gym Branding"
                    value={packageForm.industry}
                    onChange={(e) => setPackageForm(p => ({ ...p, industry: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sub Segments</label>
                  <input
                    type="text"
                    placeholder="E.g. Fitness / Yoga Studio"
                    value={packageForm.subSegments}
                    onChange={(e) => setPackageForm(p => ({ ...p, subSegments: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Business Type</label>
                  <select
                    value={packageForm.type}
                    onChange={(e) => setPackageForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Starter Package Deliverables *</label>
                  <textarea
                    rows={2}
                    required
                    value={packageForm.basicDeliverables}
                    onChange={(e) => setPackageForm(p => ({ ...p, basicDeliverables: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Growth Package Deliverables *</label>
                  <textarea
                    rows={2}
                    required
                    value={packageForm.standardDeliverables}
                    onChange={(e) => setPackageForm(p => ({ ...p, standardDeliverables: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Premium Package Deliverables *</label>
                  <textarea
                    rows={2}
                    required
                    value={packageForm.premiumDeliverables}
                    onChange={(e) => setPackageForm(p => ({ ...p, premiumDeliverables: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl border border-white/10 text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Create Service Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Edit Package Specifications</h3>
                <p className="text-xs text-gray-400 mt-1">Configure service deliverables and multipliers without touching code.</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Serial Number</label>
                  <input
                    type="number"
                    required
                    value={packageForm.serialNumber}
                    onChange={(e) => setPackageForm(p => ({ ...p, serialNumber: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={packageForm.category}
                    onChange={(e) => setPackageForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Industry Name</label>
                  <input
                    type="text"
                    required
                    value={packageForm.industry}
                    onChange={(e) => setPackageForm(p => ({ ...p, industry: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sub Segments</label>
                  <input
                    type="text"
                    value={packageForm.subSegments}
                    onChange={(e) => setPackageForm(p => ({ ...p, subSegments: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Business Type</label>
                  <select
                    value={packageForm.type}
                    onChange={(e) => setPackageForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Starter Package Deliverables *</label>
                  <textarea
                    rows={2}
                    required
                    value={packageForm.basicDeliverables}
                    onChange={(e) => setPackageForm(p => ({ ...p, basicDeliverables: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Growth Package Deliverables *</label>
                  <textarea
                    rows={2}
                    required
                    value={packageForm.standardDeliverables}
                    onChange={(e) => setPackageForm(p => ({ ...p, standardDeliverables: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Premium Package Deliverables *</label>
                  <textarea
                    rows={2}
                    required
                    value={packageForm.premiumDeliverables}
                    onChange={(e) => setPackageForm(p => ({ ...p, premiumDeliverables: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl border border-white/10 text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
