"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMLeads() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("");

  // Modal / Drawer states
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Edit Form state
  const [editForm, setEditForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    industry: "",
    selectedPackage: "",
    estimatedBudget: "",
    status: "",
    assignedEmployee: "",
    message: ""
  });

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

    fetchData(savedToken, parsedUser);
  }, [router]);

  const fetchData = async (authToken: string, user: any) => {
    setLoading(true);
    try {
      // Fetch dashboard which returns all leads
      const data = await packageAPI.getDashboard(authToken);
      
      // Filter leads client-side if user is a basic employee
      const allLeads = data.leads || [];
      if (user.role.toLowerCase() === "employee") {
        const filtered = allLeads.filter(
          (l: any) => 
            l.assignedEmployee === user.name || 
            l.assignedEmployee === user.employeeId ||
            (l.message && l.message.includes(`employee ID: ${user.employeeId}`))
        );
        setLeads(filtered);
      } else {
        setLeads(allLeads);
      }

      // Fetch employees for dropdown if admin or manager
      if (user.role.toLowerCase() === "admin" || user.role.toLowerCase() === "manager") {
        const emps = await packageAPI.getEmployees(authToken);
        setEmployees(emps || []);
      }
    } catch (err: any) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (!token) return;
    try {
      await packageAPI.updateLeadStatus(leadId, newStatus, token);
      setLeads(prev =>
        prev.map(l => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      alert(`Status modification failed: ${err.message}`);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;

    try {
      await packageAPI.deleteLead(leadId, token);
      setLeads(prev => prev.filter(l => l._id !== leadId));
      setIsViewDrawerOpen(false);
      setSelectedLead(null);
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const handleOpenEditModal = (lead: any) => {
    setSelectedLead(lead);
    setEditForm({
      name: lead.name || "",
      businessName: lead.businessName || "",
      email: lead.email || "",
      phone: lead.phone || "",
      state: lead.state || "",
      district: lead.district || "",
      industry: lead.industry || "",
      selectedPackage: lead.selectedPackage || "",
      estimatedBudget: lead.estimatedBudget || "",
      status: lead.status || "",
      assignedEmployee: lead.assignedEmployee || "",
      message: lead.message || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedLead) return;

    try {
      const response = await packageAPI.updateLead(selectedLead._id, editForm, token);
      if (response.success) {
        setLeads(prev =>
          prev.map(l => (l._id === selectedLead._id ? { ...l, ...editForm } : l))
        );
        setIsEditModalOpen(false);
        setSelectedLead((prev: any) => ({ ...prev, ...editForm }));
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleConvertLead = async (lead: any) => {
    if (!token) return;
    try {
      // Set status to Won (or Converted)
      const targetStatus = "Converted";
      await packageAPI.updateLeadStatus(lead._id, targetStatus, token);
      setLeads(prev =>
        prev.map(l => (l._id === lead._id ? { ...l, status: targetStatus } : l))
      );
      if (selectedLead && selectedLead._id === lead._id) {
        setSelectedLead((prev: any) => ({ ...prev, status: targetStatus }));
      }
      alert(`Lead successfully converted & onboarding initiated!`);
    } catch (err: any) {
      alert(`Conversion failed: ${err.message}`);
    }
  };

  // Profit Margin Calculator Helper
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

  // Filtered Leads mapping
  const filteredLeads = leads.filter((lead) => {
    const searchVal = searchTerm.toLowerCase();
    const matchSearch =
      (lead.name || "").toLowerCase().includes(searchVal) ||
      (lead.businessName || "").toLowerCase().includes(searchVal) ||
      (lead.email || "").toLowerCase().includes(searchVal) ||
      (lead.phone || "").toLowerCase().includes(searchVal) ||
      (lead.industry || "").toLowerCase().includes(searchVal);

    const matchStatus = statusFilter ? lead.status === statusFilter : true;
    const matchPackage = packageFilter ? lead.selectedPackage === packageFilter : true;

    return matchSearch && matchStatus && matchPackage;
  });

  const isPrivileged = currentUser?.role.toLowerCase() === "admin" || currentUser?.role.toLowerCase() === "manager";

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-jakartaSans">Customer Lead CRM</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isPrivileged 
              ? "Review, edit, assign, and delete lead pipelines across all studio workers."
              : "Review your assigned customer leads, update statuses, and log pricing agreements."}
          </p>
        </div>
        <button
          onClick={() => token && currentUser && fetchData(token, currentUser)}
          disabled={loading}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all text-white"
        >
          {loading ? "Syncing..." : "↻ Refresh List"}
        </button>
      </div>

      {/* Filters Panel */}
      <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Search Leads</label>
          <input
            type="text"
            placeholder="Name, business, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Package Filter</label>
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">All Packages</option>
            <option value="STARTER">Starter</option>
            <option value="GROWTH">Growth</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setPackageFilter("");
            }}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-2 border border-white/10 rounded-xl text-xs transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {loading && filteredLeads.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Retrieving Leads pipeline...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No matching customer leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Industry / Package</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  const breakdown = getMarginBreakdown(lead.estimatedBudget || "", lead.selectedPackage || "");
                  return (
                    <tr key={lead._id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4 text-gray-400 text-xs align-top">
                        {formatDate(lead.createdAt || lead.date)}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <p className="font-bold text-white text-sm">{lead.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{lead.businessName}</p>
                        <p className="text-gray-500 text-[10px]">{lead.email} | {lead.phone}</p>
                      </td>
                      <td className="py-4 px-4 align-top text-xs text-gray-300">
                        <p>{lead.district}</p>
                        <p className="text-gray-500 text-[10px]">{lead.state}</p>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-white">
                          {lead.selectedPackage}
                        </span>
                        <p className="text-gray-300 text-xs mt-1 font-semibold">{lead.industry}</p>
                      </td>
                      <td className="py-4 px-4 align-top text-xs text-gray-300">
                        {lead.assignedEmployee || <span className="text-yellow-500/80 font-semibold">Unassigned</span>}
                      </td>
                      <td className="py-4 px-4 text-center align-top">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`text-[10px] font-bold rounded-full px-2.5 py-1.5 focus:outline-none border cursor-pointer ${
                            lead.status === "Converted" || lead.status === "Won"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : lead.status === "Contacted"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : lead.status === "Lost"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-pink-500/10 text-pink-400 border-pink-500/20"
                          }`}
                        >
                          <option value="New" className="bg-zinc-950 text-white">New</option>
                          <option value="Contacted" className="bg-zinc-950 text-white">Contacted</option>
                          <option value="Qualified" className="bg-zinc-950 text-white">Qualified</option>
                          <option value="Proposal Sent" className="bg-zinc-950 text-white">Proposal Sent</option>
                          <option value="Won" className="bg-zinc-950 text-white">Won</option>
                          <option value="Lost" className="bg-zinc-950 text-white">Lost</option>
                          <option value="Converted" className="bg-zinc-950 text-white">Converted</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right align-top text-xs space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsViewDrawerOpen(true);
                          }}
                          className="text-pink-400 hover:text-pink-300 font-bold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(lead)}
                          className="text-cyan-400 hover:text-cyan-300 font-bold"
                        >
                          Edit
                        </button>
                        {isPrivileged && (
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="text-red-400 hover:text-red-300 font-bold"
                          >
                            Delete
                          </button>
                        )}
                        {lead.status !== "Converted" && lead.status !== "Won" && (
                          <button
                            onClick={() => handleConvertLead(lead)}
                            className="text-green-400 hover:text-green-300 font-bold"
                          >
                            Convert
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW DRAWER / SIDE SHEET */}
      {isViewDrawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden font-jakartaSans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-zinc-950 border-l border-white/10 p-6 md:p-8 flex flex-col justify-between text-white relative shadow-2xl">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                      Lead Sheet
                    </span>
                    <h2 className="text-2xl font-bold mt-2">{selectedLead.name}</h2>
                    <p className="text-gray-400 text-xs mt-0.5">{selectedLead.businessName}</p>
                  </div>
                  <button onClick={() => setIsViewDrawerOpen(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="space-y-5 text-sm overflow-y-auto max-h-[65vh] pr-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Contact Info</p>
                    <p><span className="text-gray-500">Email:</span> {selectedLead.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedLead.phone}</p>
                    <p><span className="text-gray-500">Location:</span> {selectedLead.district}, {selectedLead.state}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Service Requirements</p>
                    <p><span className="text-gray-500">Industry:</span> {selectedLead.industry}</p>
                    <p><span className="text-gray-500">Selected package:</span> <span className="font-bold text-white">{selectedLead.selectedPackage}</span></p>
                    <p><span className="text-gray-500">Created date:</span> {formatDate(selectedLead.createdAt || selectedLead.date)}</p>
                  </div>

                  {/* Pricing and margins */}
                  {(() => {
                    const breakdown = getMarginBreakdown(selectedLead.estimatedBudget || "", selectedLead.selectedPackage || "");
                    return (
                      <div className="bg-white/5 border border-pink-500/20 rounded-xl p-4 space-y-3">
                        <p className="text-xs text-pink-400 font-bold uppercase tracking-wider">Internal Financials (Employee Only)</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500 block">Selling Price</span>
                            <span className="font-bold text-white text-sm">{selectedLead.estimatedBudget}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Est. Cost Base</span>
                            <span className="font-bold text-red-300 text-sm">₹{breakdown.internalCost.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="col-span-2 border-t border-white/5 pt-2">
                            <span className="text-gray-500 block">Profit Margin</span>
                            <span className="font-bold text-green-300 text-sm">
                              ₹{breakdown.profit.toLocaleString("en-IN")}{" "}
                              <span className="text-green-500 text-xs font-normal">({breakdown.marginPct}%)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Assignee & Status</p>
                    <p><span className="text-gray-500">Assigned employee:</span> {selectedLead.assignedEmployee || "Unassigned"}</p>
                    <p><span className="text-gray-500">Current status:</span> <span className="text-cyan-400 font-bold">{selectedLead.status}</span></p>
                  </div>

                  {selectedLead.message && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Requirements details / Notes</p>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex gap-3">
                <button
                  onClick={() => handleOpenEditModal(selectedLead)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 font-bold py-2.5 rounded-xl text-xs transition-all text-white text-center"
                >
                  Edit Details
                </button>
                {selectedLead.status !== "Converted" && selectedLead.status !== "Won" && (
                  <button
                    onClick={() => handleConvertLead(selectedLead)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 font-bold py-2.5 rounded-xl text-xs transition-all text-white text-center"
                  >
                    Convert Lead
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-jakartaSans">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Edit Lead Info</h3>
                <p className="text-xs text-gray-400 mt-1">Modify customer coordinates, status states, and budget allocations.</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm(p => ({ ...p, businessName: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm(p => ({ ...p, state: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">District</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm(p => ({ ...p, district: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Budget</label>
                  <input
                    type="text"
                    required
                    value={editForm.estimatedBudget}
                    onChange={(e) => setEditForm(p => ({ ...p, estimatedBudget: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Selected Package</label>
                  <select
                    value={editForm.selectedPackage}
                    onChange={(e) => setEditForm(p => ({ ...p, selectedPackage: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="STARTER">STARTER</option>
                    <option value="GROWTH">GROWTH</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>

              {isPrivileged && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Assign Studio Employee</label>
                  <select
                    value={editForm.assignedEmployee}
                    onChange={(e) => setEditForm(p => ({ ...p, assignedEmployee: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp.fullName}>{emp.fullName} ({emp.employeeId})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Message / Notes</label>
                <textarea
                  rows={3}
                  value={editForm.message}
                  onChange={(e) => setEditForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                />
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
