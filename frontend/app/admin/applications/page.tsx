"use client";

import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Search, 
  Filter, 
  Download, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  Eye, 
  Copy, 
  Check, 
  LogOut,
  ChevronDown,
  FileSpreadsheet,
  Globe
} from "lucide-react";

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  portfolioLink?: string;
  coverNote?: string;
  status: string;
  appliedAt: string;
  source: string;
}

interface Job {
  _id: string;
  referenceId: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isActivelyHiring: boolean;
}

export default function AdminApplicationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState("all");
  
  // Tabs: "applicants" | "linkedin"
  const [activeTab, setActiveTab] = useState<"applicants" | "linkedin">("applicants");
  
  // Expanded cover letters
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  
  // Copy state for LinkedIn job details
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_admin_token");
    if (savedToken) {
      setIsAuthenticated(true);
      fetchDashboardData(savedToken);
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      
      localStorage.setItem("illusory_admin_token", data.token);
      setIsAuthenticated(true);
      fetchDashboardData(data.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("illusory_admin_token");
    setIsAuthenticated(false);
    setApplications([]);
    setJobs([]);
    setPassword("");
  };

  const fetchDashboardData = async (token: string) => {
    setIsLoadingData(true);
    setDataError("");
    
    try {
      const res = await fetch("/api/admin/applications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.error || "Failed to load data");
      }
      
      setApplications(data.applications || []);
      setJobs(data.jobs || []);
    } catch (err: any) {
      setDataError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoadingData(false);
      setIsLoadingAuth(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("illusory_admin_token");
    if (!token) return;
    
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update status");
      }
      
      // Update local state
      setApplications(prev => 
        prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
      );
    } catch (err: any) {
      alert(err.message || "Error updating application status");
    }
  };

  // Export LinkedIn CSV
  const handleExportCSV = () => {
    if (jobs.length === 0) return;
    
    const activeJobs = jobs.filter(job => job.isActivelyHiring);
    if (activeJobs.length === 0) {
      alert("No active jobs available to export.");
      return;
    }
    
    // Header columns
    const headers = [
      "Job Title",
      "Company",
      "Location",
      "Workplace Type",
      "Employment Type",
      "Department",
      "Job Description",
      "Responsibilities",
      "Requirements",
      "Reference ID"
    ];
    
    // Construct CSV rows
    const rows = activeJobs.map(job => {
      const cleanDesc = job.description.replace(/"/g, '""').replace(/\n/g, ' ');
      const cleanResp = job.responsibilities.join("; ").replace(/"/g, '""');
      const cleanReqs = job.requirements.join("; ").replace(/"/g, '""');
      
      return [
        `"${job.title}"`,
        `"Illusory Design Studios"`,
        `"${job.location}"`,
        `"${job.workMode}"`,
        `"${job.employmentType}"`,
        `"${job.department}"`,
        `"${cleanDesc}"`,
        `"${cleanResp}"`,
        `"${cleanReqs}"`,
        `"${job.referenceId}"`
      ];
    });
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `illusory_active_jobs_linkedin_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, jobId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedJobId(jobId);
    setTimeout(() => setCopiedJobId(null), 2000);
  };

  // Filter application list
  const filteredApplications = applications.filter(app => {
    const matchStatus = selectedStatus === "all" || app.status === selectedStatus;
    const matchJob = selectedJob === "all" || app.jobTitle === selectedJob;
    return matchStatus && matchJob;
  });

  // Calculate statistics
  const totalApps = applications.length;
  const newApps = applications.filter(a => a.status === "new").length;
  const reviewedApps = applications.filter(a => a.status === "reviewed").length;
  const shortlistedApps = applications.filter(a => a.status === "shortlisted").length;
  const hiredApps = applications.filter(a => a.status === "hired").length;

  // Render loading auth screen
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-jakartaSans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  // Render Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-jakartaSans relative overflow-hidden">
        {/* Glow Spots */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-950/70 border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,102,255,0.05)] backdrop-blur-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">ILLUSORY</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Careers Management</p>
          </div>

          <div className="flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full w-14 h-14 mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-center mb-2">Restricted Access</h3>
          <p className="text-gray-400 text-xs text-center mb-6 leading-relaxed">
            Enter the administrative password to manage job applications and sync job descriptions.
          </p>

          {loginError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="🔑 Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 transition-all text-sm text-center tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-jakartaSans relative pb-20">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Topbar */}
      <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">ILLUSORY</span>
            <span className="text-xs text-gray-500 border-l border-white/20 pl-3 font-semibold uppercase tracking-widest">Admin Console</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/30 hover:text-red-400 rounded-xl text-xs font-bold transition-all bg-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 mt-8">
        
        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Applications</p>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold mt-3">{totalApps}</p>
            <p className="text-[10px] text-gray-500 mt-1">Total submitted via web</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">New</p>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-yellow-400">{newApps}</p>
            <p className="text-[10px] text-gray-500 mt-1">Awaiting review</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Reviewed</p>
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-cyan-400">{reviewedApps}</p>
            <p className="text-[10px] text-gray-500 mt-1">CVs viewed</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Shortlisted</p>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-purple-400">{shortlistedApps}</p>
            <p className="text-[10px] text-gray-500 mt-1">Selected for interviews</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm col-span-2 md:col-span-1">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-wider text-green-400">Hired</p>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-green-400">{hiredApps}</p>
            <p className="text-[10px] text-gray-500 mt-1">Offers accepted</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 mb-8 gap-6">
          <button
            onClick={() => setActiveTab("applicants")}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === "applicants" 
                ? "text-blue-500" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Applicant Submissions ({filteredApplications.length})
            {activeTab === "applicants" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("linkedin")}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === "linkedin" 
                ? "text-blue-500" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            LinkedIn Manual Posting
            {activeTab === "linkedin" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Dynamic Panel Rendering */}
        {dataError ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center text-red-300">
            <p className="font-bold mb-2">Error Loading Dashboard</p>
            <p className="text-xs">{dataError}</p>
            <button
              onClick={() => fetchDashboardData(localStorage.getItem("illusory_admin_token") || "")}
              className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/40 hover:bg-red-500/40 rounded-xl text-xs font-bold transition-all"
            >
              Retry
            </button>
          </div>
        ) : isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4" />
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Loading dynamic resources...</p>
          </div>
        ) : activeTab === "applicants" ? (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-zinc-950 border border-white/10 p-5 rounded-2xl">
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-500">Filter By Role</span>
                <div className="relative">
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm appearance-none outline-none focus:border-blue-500 transition-all text-white font-medium"
                  >
                    <option value="all">All Job Listings</option>
                    {Array.from(new Set(applications.map((app) => app.jobTitle))).map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-500">Filter By Status</span>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm appearance-none outline-none focus:border-blue-500 transition-all text-white font-medium"
                  >
                    <option value="all">All Application Statuses</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Applicants List Grid */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="bg-zinc-900/20 border border-white/5 rounded-2xl py-16 text-center text-gray-400 italic">
                  No applicant submissions match the chosen filters.
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const isExpanded = expandedAppId === app._id;
                  const dateFormatted = new Date(app.appliedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div 
                      key={app._id} 
                      className="bg-zinc-950/60 border border-white/10 hover:border-white/20 p-6 rounded-2xl transition-all relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                    >
                      {/* Left border indicator based on status */}
                      <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        app.status === "new" ? "bg-yellow-500" :
                        app.status === "reviewed" ? "bg-cyan-500" :
                        app.status === "shortlisted" ? "bg-purple-500" :
                        app.status === "rejected" ? "bg-red-500" : "bg-green-500"
                      }`} />

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-2">
                        {/* Summary details */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white tracking-tight">{app.fullName}</h3>
                            <span className="text-[10px] uppercase font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded">
                              {app.jobTitle} (Ref: #{app.jobId})
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">{dateFormatted}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-400">
                            <span>📧 <a href={`mailto:${app.email}`} className="hover:text-blue-400 hover:underline">{app.email}</a></span>
                            <span>📞 <a href={`tel:${app.phone}`} className="hover:text-blue-400 hover:underline">{app.phone}</a></span>
                            {app.portfolioLink && (
                              <span>🔗 <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Portfolio</a></span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Status & Action Row */}
                        <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                          {/* Resume download button */}
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                          >
                            <Download className="w-3.5 h-3.5" />
                            View CV
                          </a>

                          {/* Status Select dropdown */}
                          <div className="relative">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              className={`appearance-none bg-zinc-900 border text-xs font-bold uppercase tracking-wider rounded-xl pl-4 pr-10 py-2.5 focus:outline-none transition-all ${
                                app.status === "new" ? "border-yellow-500/30 text-yellow-400" :
                                app.status === "reviewed" ? "border-cyan-500/30 text-cyan-400" :
                                app.status === "shortlisted" ? "border-purple-500/30 text-purple-400" :
                                app.status === "rejected" ? "border-red-500/30 text-red-400" : "border-green-500/30 text-green-400"
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                              <option value="hired">Hired</option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
                          </div>

                          {/* Collapse Toggle */}
                          {app.coverNote && (
                            <button
                              onClick={() => setExpandedAppId(isExpanded ? null : app._id)}
                              className="p-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-xl hover:text-blue-400 transition-colors text-xs font-semibold uppercase tracking-widest px-3"
                            >
                              {isExpanded ? "Hide Note" : "Show Note"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Cover Letter Note */}
                      {app.coverNote && isExpanded && (
                        <div className="mt-5 pt-5 border-t border-white/5 text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap">
                          <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-2">Cover Letter / Note:</p>
                          {app.coverNote}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <>
            {/* LinkedIn Sync Info and CSV Export */}
            <div className="bg-zinc-950 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-500" />
                  LinkedIn Job Feed
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-2xl">
                  Export all active job listings into a LinkedIn-structured CSV file. You can upload this directly on LinkedIn's admin panel, or copy details of individual listings using the cards below.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/10 shrink-0"
              >
                <Download className="w-4 h-4" />
                Export Active Jobs CSV
              </button>
            </div>

            {/* Job Listings Cards for Copying */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.filter(job => job.isActivelyHiring).length === 0 ? (
                <div className="col-span-2 bg-zinc-900/20 border border-white/5 rounded-2xl py-16 text-center text-gray-400 italic">
                  No active job listings found in MongoDB.
                </div>
              ) : (
                jobs.filter(job => job.isActivelyHiring).map((job) => {
                  const formattedText = `Job Title: ${job.title}
Company: Illusory Design Studios
Location: ${job.location}
Workplace Type: ${job.workMode}
Employment Type: ${job.employmentType}
Department: ${job.department}

Job Description:
${job.description}

Key Responsibilities:
${job.responsibilities.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Requirements:
${job.requirements.map((r, i) => `- ${r}`).join("\n")}

Apply Link: https://www.illusorydesignstudios.com/careers/${job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${job.referenceId}
Reference ID: #${job.referenceId}
`;

                  const isCopied = copiedJobId === job._id;

                  return (
                    <div key={job._id} className="bg-zinc-950/60 border border-white/10 p-6 rounded-2xl relative flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
                            <span className="text-[10px] uppercase font-bold text-gray-400">{job.department}</span>
                          </div>
                          <span className="text-xs font-mono text-gray-500 bg-white/5 px-2.5 py-1 border border-white/10 rounded">
                            Ref: #{job.referenceId}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-400 bg-black/40 p-4 rounded-xl border border-white/5">
                          <div>
                            <p className="text-[9px] uppercase font-bold text-gray-500">Location</p>
                            <p className="font-semibold text-white mt-0.5">{job.location}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-bold text-gray-500">Workplace Type</p>
                            <p className="font-semibold text-white mt-0.5">{job.workMode}</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-[9px] uppercase font-bold text-gray-500">Employment Type</p>
                            <p className="font-semibold text-white mt-0.5">{job.employmentType}</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-[9px] uppercase font-bold text-gray-500">Status</p>
                            <p className="font-semibold text-green-400 flex items-center gap-1 mt-0.5">
                              <Globe className="w-3.5 h-3.5" /> Active
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(formattedText, job._id)}
                        className={`w-full flex items-center justify-center gap-2 border font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all mt-4 ${
                          isCopied
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-white/5 border-white/10 hover:border-blue-500/40 hover:text-blue-400"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied to Clipboard!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy LinkedIn Details
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
