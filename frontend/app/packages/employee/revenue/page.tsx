"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMRevenue() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [convertedLeads, setConvertedLeads] = useState<any[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_token");
    const savedUser = localStorage.getItem("illusory_user");

    if (!savedToken || !savedUser) {
      router.push("/packages/employee/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setToken(savedToken);
    setCurrentUser(parsedUser);

    // Guard path: Admin / Manager only
    const role = parsedUser.role.toLowerCase();
    if (role !== "admin" && role !== "manager") {
      router.push("/packages/employee/dashboard");
      return;
    }

    fetchRevenueData(savedToken);
  }, [router]);

  const fetchRevenueData = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await packageAPI.getDashboard(authToken);
      const allLeads = data.leads || [];
      setTotalLeadsCount(allLeads.length);
      
      const converted = allLeads.filter(
        (l: any) => l.status === "Converted" || l.status === "Won"
      );
      setConvertedLeads(converted);
    } catch (err) {
      console.error("Error loading revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse numeric budget
  const parseBudget = (budgetStr: string) => {
    const matches = (budgetStr || "").match(/\d+/g);
    if (!matches || matches.length === 0) return 0;
    const nums = matches.map((m) => parseFloat(m));
    return nums.reduce((s, v) => s + v, 0) / nums.length;
  };

  // Helper to calculate profit margins
  const getMargins = (budgetVal: number, packageTier: string) => {
    let marginPct = 0.25; // 25% default (Growth)
    const tier = (packageTier || "").toLowerCase();
    if (tier === "starter") {
      marginPct = 0.20;
    } else if (tier === "premium") {
      marginPct = 0.30;
    }
    const profit = Math.round(budgetVal * marginPct);
    const cost = Math.round(budgetVal * (1 - marginPct));
    return { cost, profit, marginPct };
  };

  // Calculations
  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;
  
  let starterCount = 0;
  let growthCount = 0;
  let premiumCount = 0;

  convertedLeads.forEach((lead) => {
    const budgetVal = parseBudget(lead.estimatedBudget || "");
    const tier = (lead.selectedPackage || "").toUpperCase();
    
    if (tier === "STARTER") starterCount++;
    else if (tier === "PREMIUM") premiumCount++;
    else growthCount++;

    const { cost, profit } = getMargins(budgetVal, tier);
    
    totalRevenue += budgetVal;
    totalCost += cost;
    totalProfit += profit;
  });

  const conversionRate = totalLeadsCount > 0 ? Math.round((convertedLeads.length / totalLeadsCount) * 100) : 0;
  const avgProfitMarginPct = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  if (loading && convertedLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mb-4" />
        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Loading Financial Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative font-jakartaSans text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Revenue Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">Review conversion margins, aggregate profit channels, and package tier distribution metrics.</p>
        </div>
        <button
          onClick={() => token && fetchRevenueData(token)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all"
        >
          ↻ Refresh Ledger
        </button>
      </div>

      {/* Stats counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-950/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Closed Deals Revenue</span>
          <p className="text-3xl font-bold mt-2 text-white">₹{Math.round(totalRevenue).toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Gross contracted billing</span>
        </div>

        <div className="bg-zinc-950/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <span className="text-red-400 text-xs uppercase tracking-wider font-bold">Estimated Cost Base</span>
          <p className="text-3xl font-bold mt-2 text-red-400">₹{Math.round(totalCost).toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Delivery overhead allocation</span>
        </div>

        <div className="bg-zinc-950/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <span className="text-green-400 text-xs uppercase tracking-wider font-bold">Net Profit Margin</span>
          <p className="text-3xl font-bold mt-2 text-green-400">₹{Math.round(totalProfit).toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Average: {avgProfitMarginPct}% profit margin</span>
        </div>

        <div className="bg-zinc-950/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
          <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold">Conversion Rate</span>
          <p className="text-3xl font-bold mt-2 text-cyan-400">{conversionRate}%</p>
          <span className="text-[10px] text-gray-500 block mt-2">Converted {convertedLeads.length} of {totalLeadsCount} leads</span>
        </div>
      </div>

      {/* Package Tier Popularity and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tier Distribution graph representation */}
        <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold mb-6">Package Tier Distribution</h2>
          <div className="space-y-6">
            {/* Starter Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-300">STARTER PACKAGE (20% margin)</span>
                <span>{starterCount} sales</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3.5 border border-white/5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-600 h-full rounded-full transition-all"
                  style={{ width: `${convertedLeads.length > 0 ? (starterCount / convertedLeads.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Growth Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-300">GROWTH PACKAGE (25% margin)</span>
                <span>{growthCount} sales</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3.5 border border-white/5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-violet-600 h-full rounded-full transition-all"
                  style={{ width: `${convertedLeads.length > 0 ? (growthCount / convertedLeads.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Premium Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-300">PREMIUM PACKAGE (30% margin)</span>
                <span>{premiumCount} sales</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3.5 border border-white/5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full rounded-full transition-all"
                  style={{ width: `${convertedLeads.length > 0 ? (premiumCount / convertedLeads.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ledger List */}
        <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold mb-6">Recent Sales Conversions</h2>
          {convertedLeads.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">No conversions registered yet.</div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {convertedLeads.slice(0, 5).map((lead) => {
                const budgetVal = parseBudget(lead.estimatedBudget || "");
                const { cost, profit, marginPct } = getMargins(budgetVal, lead.selectedPackage);
                return (
                  <div key={lead._id} className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-pink-500/10 p-3 rounded-xl transition-all">
                    <div>
                      <p className="text-sm font-bold text-white">{lead.businessName || lead.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{lead.industry} | {lead.selectedPackage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">₹{Math.round(budgetVal).toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Profit: ₹{profit.toLocaleString("en-IN")} ({Math.round(marginPct * 100)}%)</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
