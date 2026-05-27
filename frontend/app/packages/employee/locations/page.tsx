"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMLocations() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [selectedLoc, setSelectedLoc] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [locationForm, setLocationForm] = useState({
    state: "",
    district: "",
    popularIndustries: ""
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

    // Guard path: Admin only
    if (parsedUser.role.toLowerCase() !== "admin") {
      router.push("/packages/employee/dashboard");
      return;
    }

    fetchLocations(savedToken);
  }, [router]);

  const fetchLocations = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await packageAPI.getLocations(authToken);
      setLocations(data || []);
    } catch (err) {
      console.error("Error loading locations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setLocationForm({
      state: "",
      district: "",
      popularIndustries: ""
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (loc: any) => {
    setSelectedLoc(loc);
    setLocationForm({
      state: loc.state || "",
      district: loc.district || "",
      popularIndustries: loc.popularIndustries || ""
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await packageAPI.createLocation(locationForm, token);
      if (response.success) {
        setLocations(prev => [...prev, response.location].sort((a, b) => a.state.localeCompare(b.state) || a.district.localeCompare(b.district)));
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedLoc) return;

    try {
      const response = await packageAPI.updateLocation(selectedLoc._id, locationForm, token);
      if (response.success) {
        setLocations(prev =>
          prev.map(l => (l._id === selectedLoc._id ? response.location : l)).sort((a, b) => a.state.localeCompare(b.state) || a.district.localeCompare(b.district))
        );
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to permanently delete this district mapping?")) return;

    try {
      await packageAPI.deleteLocation(id, token);
      setLocations(prev => prev.filter(l => l._id !== id));
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative font-jakartaSans text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Location Suitability</h1>
          <p className="text-gray-400 text-sm mt-1">Configure State/District priority scopes and mapping popular local business verticals.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenAdd}
            className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 rounded-xl px-4 py-2 text-sm font-bold transition-all"
          >
            + Add District Mapping
          </button>
          <button
            onClick={() => token && fetchLocations(token)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {loading && locations.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Retrieving locations...</div>
        ) : locations.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No locations found in the database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Popular Industries Mapped</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {locations.map((loc) => (
                  <tr key={loc._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white align-top">{loc.state}</td>
                    <td className="py-4 px-4 font-bold text-gray-300 align-top">{loc.district}</td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {(loc.popularIndustries || "").split(",").map((ind: string, idx: number) => {
                          const trimInd = ind.trim();
                          if (!trimInd) return null;
                          return (
                            <span key={idx} className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded">
                              {trimInd}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right align-top text-xs space-x-3">
                      <button
                        onClick={() => handleOpenEdit(loc)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(loc._id)}
                        className="text-red-400 hover:text-red-300 font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Add District Mapping</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">State Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Odisha"
                  value={locationForm.state}
                  onChange={(e) => setLocationForm(p => ({ ...p, state: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">District Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Khordha"
                  value={locationForm.district}
                  onChange={(e) => setLocationForm(p => ({ ...p, district: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Popular Industries *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comma-separated e.g. Hospital Website, Cafe Branding, Gym Branding"
                  value={locationForm.popularIndustries}
                  onChange={(e) => setLocationForm(p => ({ ...p, popularIndustries: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
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
                  Add District
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedLoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Edit Location Mapping</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">State Name *</label>
                <input
                  type="text"
                  required
                  value={locationForm.state}
                  onChange={(e) => setLocationForm(p => ({ ...p, state: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">District Name *</label>
                <input
                  type="text"
                  required
                  value={locationForm.district}
                  onChange={(e) => setLocationForm(p => ({ ...p, district: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Popular Industries *</label>
                <textarea
                  rows={3}
                  required
                  value={locationForm.popularIndustries}
                  onChange={(e) => setLocationForm(p => ({ ...p, popularIndustries: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
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
