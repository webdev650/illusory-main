"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMLogAgreement() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form selections lists
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  // Onboarding form state
  const [onboardForm, setOnboardForm] = useState({
    contactPerson: "",
    companyName: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    industry: "",
    selectedPackage: "GROWTH",
    finalPrice: "",
    notes: "",
  });

  // Selected industry estimates for margin preview
  const [estimateData, setEstimateData] = useState<any>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const [onboardingStatusMsg, setOnboardingStatusMsg] = useState("");
  const [onboardingErrorMsg, setOnboardingErrorMsg] = useState("");
  const [submittingOnboard, setSubmittingOnboard] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_token");
    const savedUser = localStorage.getItem("illusory_user");

    if (!savedToken || !savedUser) {
      router.push("/packages/employee/login");
      return;
    }

    setToken(savedToken);
    setCurrentUser(JSON.parse(savedUser));
    fetchStatesList();
  }, [router]);

  // Fetch districts when state is updated in CRM form
  useEffect(() => {
    if (!onboardForm.state) {
      setDistricts([]);
      setIndustries([]);
      return;
    }
    const loadDistricts = async () => {
      try {
        const dists = await packageAPI.getDistricts(onboardForm.state);
        setDistricts(dists);
      } catch (err) {
        console.error("Error loading districts:", err);
      }
    };
    loadDistricts();
  }, [onboardForm.state]);

  // Fetch industries when district is updated in CRM form
  useEffect(() => {
    if (!onboardForm.state || !onboardForm.district) {
      setIndustries([]);
      return;
    }
    const loadIndustries = async () => {
      try {
        const inds = await packageAPI.getIndustries(onboardForm.state, onboardForm.district);
        setIndustries(inds);
      } catch (err) {
        console.error("Error loading industries:", err);
      }
    };
    loadIndustries();
  }, [onboardForm.state, onboardForm.district]);

  // Load industry estimate data to show margins dynamically inside CRM logger
  useEffect(() => {
    if (!onboardForm.industry) {
      setEstimateData(null);
      return;
    }
    const loadEstimate = async () => {
      setLoadingEstimate(true);
      try {
        const est = await packageAPI.getEstimate(onboardForm.industry);
        setEstimateData(est);
        
        // Auto pre-fill average price for selected package
        const rangeText = est.packages[onboardForm.selectedPackage.toLowerCase()]?.priceRange || "";
        const matches = rangeText.match(/\d+/g);
        if (matches && matches.length > 0) {
          const avg = matches.length === 2 
            ? Math.round((parseInt(matches[0]) + parseInt(matches[1])) / 2) 
            : parseInt(matches[0]);
          setOnboardForm(prev => ({ ...prev, finalPrice: `₹${avg.toLocaleString("en-IN")}` }));
        }
      } catch (err) {
        console.error("Error loading estimate:", err);
      } finally {
        setLoadingEstimate(false);
      }
    };
    loadEstimate();
  }, [onboardForm.industry, onboardForm.selectedPackage]);

  const fetchStatesList = async () => {
    try {
      const statesList = await packageAPI.getStates();
      setStates(statesList);
    } catch (err) {
      console.error("Error loading states:", err);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardForm.contactPerson || !onboardForm.companyName || !onboardForm.email || !onboardForm.phone || !onboardForm.finalPrice) {
      setOnboardingErrorMsg("Please fill out all required fields.");
      return;
    }

    setSubmittingOnboard(true);
    setOnboardingStatusMsg("");
    setOnboardingErrorMsg("");

    try {
      const payload = {
        name: onboardForm.contactPerson,
        businessName: onboardForm.companyName,
        email: onboardForm.email,
        phone: onboardForm.phone,
        state: onboardForm.state || "N/A",
        district: onboardForm.district || "N/A",
        industry: onboardForm.industry || "General",
        selectedPackage: onboardForm.selectedPackage.toUpperCase(),
        estimatedBudget: onboardForm.finalPrice,
        message: onboardForm.notes || `Contract logged by employee ID: ${currentUser?.employeeId}.`,
        status: "Converted", // Manual agreements are auto-converted
        assignedEmployee: currentUser?.fullName || currentUser?.name || ""
      };

      await packageAPI.submitLead(payload);
      setOnboardingStatusMsg("Contract agreement successfully registered! Client is onboarded.");
      
      // Reset form
      setOnboardForm({
        contactPerson: "",
        companyName: "",
        email: "",
        phone: "",
        state: "",
        district: "",
        industry: "",
        selectedPackage: "GROWTH",
        finalPrice: "",
        notes: "",
      });
      setEstimateData(null);
    } catch (err: any) {
      setOnboardingErrorMsg(err.message || "Failed to onboard client. Verify input parameters.");
    } finally {
      setSubmittingOnboard(false);
    }
  };

  const getMarginBreakdown = (budgetStr: string, packageTier: string) => {
    const numericMatches = budgetStr.match(/\d+/g);
    if (!numericMatches || numericMatches.length === 0) {
      return { price: 0, internalCost: 0, profit: 0, marginPct: 0 };
    }
    
    const prices = numericMatches.map((n) => parseFloat(n));
    const avgPrice = prices.reduce((s, v) => s + v, 0) / prices.length;
    
    let marginPct = 0.25; // default 25% for growth
    if (packageTier.toLowerCase() === "starter") {
      marginPct = 0.20; // 20%
    } else if (packageTier.toLowerCase() === "premium") {
      marginPct = 0.30; // 30%
    }

    const profit = Math.round(avgPrice * marginPct);
    const internalCost = Math.round(avgPrice * (1 - marginPct));

    return {
      price: Math.round(avgPrice),
      internalCost,
      profit,
      marginPct: Math.round(marginPct * 100)
    };
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in font-jakartaSans text-white">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Manual Contract Entry</h1>
        <p className="text-gray-400 text-sm mt-1">Onboard contracted client agreements directly by choosing locations and industries from MongoDB.</p>
      </div>

      {onboardingStatusMsg && (
        <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-sm">
          {onboardingStatusMsg}
        </div>
      )}

      {onboardingErrorMsg && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
          {onboardingErrorMsg}
        </div>
      )}

      <form onSubmit={handleOnboardSubmit} className="bg-zinc-950/40 border border-white/10 p-8 rounded-3xl space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Contact Person *</label>
            <input
              type="text"
              required
              value={onboardForm.contactPerson}
              onChange={(e) => setOnboardForm(p => ({ ...p, contactPerson: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Company Name *</label>
            <input
              type="text"
              required
              value={onboardForm.companyName}
              onChange={(e) => setOnboardForm(p => ({ ...p, companyName: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              placeholder="Company / Shop Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              value={onboardForm.email}
              onChange={(e) => setOnboardForm(p => ({ ...p, email: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              placeholder="client@company.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Phone Number *</label>
            <input
              type="tel"
              required
              value={onboardForm.phone}
              onChange={(e) => setOnboardForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              placeholder="+91 99999 88888"
            />
          </div>
        </div>

        {/* DROPDOWN LOGIC: State -> District -> Industry from MongoDB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">State *</label>
            <select
              required
              value={onboardForm.state}
              onChange={(e) => setOnboardForm(p => ({ ...p, state: e.target.value, district: "", industry: "" }))}
              className="w-full bg-black border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-pink-500 text-xs"
            >
              <option value="">Select State</option>
              {states.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">District *</label>
            <select
              required
              disabled={!onboardForm.state}
              value={onboardForm.district}
              onChange={(e) => setOnboardForm(p => ({ ...p, district: e.target.value, industry: "" }))}
              className="w-full bg-black border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-pink-500 text-xs disabled:opacity-40"
            >
              <option value="">Select District</option>
              {districts.map(dst => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Industry *</label>
            <select
              required
              disabled={!onboardForm.district}
              value={onboardForm.industry}
              onChange={(e) => setOnboardForm(p => ({ ...p, industry: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-pink-500 text-xs disabled:opacity-40"
            >
              <option value="">Select Industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Package and pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Selected Package Tier</label>
            <select
              value={onboardForm.selectedPackage}
              onChange={(e) => setOnboardForm(p => ({ ...p, selectedPackage: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
            >
              <option value="STARTER">Starter Package</option>
              <option value="GROWTH">Growth Package</option>
              <option value="PREMIUM">Premium Package</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Final Contracted Price *</label>
            <input
              type="text"
              required
              value={onboardForm.finalPrice}
              onChange={(e) => setOnboardForm(p => ({ ...p, finalPrice: e.target.value }))}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              placeholder="E.g. ₹55,000"
            />
          </div>
        </div>

        {/* DYNAMIC MARGIN PREVIEW */}
        {estimateData && !loadingEstimate && (
          <div className="bg-white/5 border border-pink-500/30 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-pink-400 uppercase font-extrabold tracking-widest">
              Authorized Employee Margin Review
            </span>
            
            {(() => {
              const activeTier = onboardForm.selectedPackage.toLowerCase();
              const activePkg = estimateData.packages[activeTier];
              if (!activePkg) return null;

              const breakdown = getMarginBreakdown(onboardForm.finalPrice, onboardForm.selectedPackage);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Est. Range (Sheet Values)</span>
                    <span className="font-bold text-white">{activePkg.priceRange}</span>
                  </div>
                  <div>
                    <span className="text-red-400 block font-bold">Internal Cost Base (80-70%)</span>
                    <span className="font-bold text-red-300">₹{breakdown.internalCost.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-green-400 block font-bold">Estimated Profit Margin</span>
                    <span className="font-bold text-green-300">
                      ₹{breakdown.profit.toLocaleString("en-IN")}{" "}
                      <span className="text-green-500">({breakdown.marginPct}%)</span>
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Agreement Scope Notes</label>
          <textarea
            rows={4}
            value={onboardForm.notes}
            onChange={(e) => setOnboardForm(p => ({ ...p, notes: e.target.value }))}
            className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all text-xs"
            placeholder="Record custom revision counts, specialized campaign inclusions, kick-off dates, etc..."
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={submittingOnboard}
            className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 text-xs shadow-lg shadow-pink-500/10"
          >
            {submittingOnboard ? "Registering Client..." : "Log Contract Agreement"}
          </button>
        </div>
      </form>
    </div>
  );
}
