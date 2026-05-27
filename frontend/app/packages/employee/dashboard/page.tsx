"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({
    totalLeads: 0,
    convertedLeads: 0,
    monthlyRevenue: "₹0",
    onboardingCount: 0,
    employeeStrength: 1,
    totalIndustries: 0,
    totalPackages: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_token");
    if (!savedToken) {
      router.push("/packages/employee/login");
      return;
    }
    setToken(savedToken);
    fetchDashboardData(savedToken);
  }, [router]);

  const fetchDashboardData = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await packageAPI.getDashboard(authToken);
      setStats(data.stats);
      setRecentLeads(data.leads.slice(0, 5)); // show top 5 recent leads
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading && recentLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mb-4" />
        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Syncing Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-jakartaSans text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time business pipeline metrics, conversion performance, and active catalogs.</p>
        </div>
        <button
          onClick={() => token && fetchDashboardData(token)}
          disabled={loading}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all text-white flex items-center gap-2"
        >
          {loading ? "Refreshing..." : "↻ Refresh Stats"}
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-all" />
          <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Leads</span>
          <p className="text-3xl font-bold mt-2 text-white">{stats.totalLeads}</p>
          <span className="text-[10px] text-gray-500 block mt-2">All submitted estimations</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl group-hover:bg-green-500/10 transition-all" />
          <span className="text-green-400 text-xs uppercase tracking-wider font-bold">Converted Leads</span>
          <p className="text-3xl font-bold mt-2 text-green-400">{stats.convertedLeads}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Closed agreements & sales</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-all" />
          <span className="text-violet-400 text-xs uppercase tracking-wider font-bold">Revenue Generated</span>
          <p className="text-3xl font-bold mt-2 text-violet-400">{stats.monthlyRevenue}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Sum of converted budgets</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
          <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold">Monthly Onboarding</span>
          <p className="text-3xl font-bold mt-2 text-cyan-400">{stats.onboardingCount}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Active client onboarding</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-300">
          <span className="text-yellow-400 text-xs uppercase tracking-wider font-bold">Total Industries</span>
          <p className="text-3xl font-bold mt-2 text-white">{stats.totalIndustries}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Configured in MongoDB</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
          <span className="text-orange-400 text-xs uppercase tracking-wider font-bold">Total Packages</span>
          <p className="text-3xl font-bold mt-2 text-white">{stats.totalPackages}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Active service packages (tiers)</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all duration-300">
          <span className="text-teal-400 text-xs uppercase tracking-wider font-bold">Employee Strength</span>
          <p className="text-3xl font-bold mt-2 text-white">{stats.employeeStrength}</p>
          <span className="text-[10px] text-gray-500 block mt-2">Registered personnel accounts</span>
        </div>
      </div>

      {/* Recent Lead Pipeline Section */}
      <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Recent Pipelines</h2>
          <Link
            href="/packages/employee/leads"
            className="text-xs text-pink-400 hover:text-pink-300 hover:underline font-bold transition-all"
          >
            Manage Pipeline →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">No recent leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Industry / Package</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 text-gray-400 text-xs">{formatDate(lead.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{lead.name}</p>
                      <p className="text-gray-500 text-xs">{lead.businessName}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-white text-xs">{lead.industry}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{lead.selectedPackage}</p>
                    </td>
                    <td className="py-3.5 px-4 text-white text-sm font-semibold">{lead.estimatedBudget}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold rounded-full px-2 py-1 inline-block border ${
                          lead.status === "Converted" || lead.status === "Won"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : lead.status === "Contacted"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            : lead.status === "Lost"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-pink-500/10 text-pink-400 border-pink-500/20"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
