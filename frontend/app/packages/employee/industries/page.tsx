"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMIndustries() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    industryCategory: "",
    post: "",
    districtPriority: ""
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

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await packageAPI.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCategoryForm({
      industryCategory: "",
      post: "",
      districtPriority: ""
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setSelectedCat(cat);
    setCategoryForm({
      industryCategory: cat.industryCategory || "",
      post: cat.post || "",
      districtPriority: cat.districtPriority || ""
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await packageAPI.createCategory(categoryForm, token);
      if (response.success) {
        setCategories(prev => [...prev, response.category]);
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCat) return;

    try {
      const response = await packageAPI.updateCategory(selectedCat._id, categoryForm, token);
      if (response.success) {
        setCategories(prev =>
          prev.map(c => (c._id === selectedCat._id ? response.category : c))
        );
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to permanently delete this industry category?")) return;

    try {
      await packageAPI.deleteCategory(id, token);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative font-jakartaSans text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Industry Mappings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage global industry categories, default templates, and priorities in MongoDB.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenAdd}
            className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 rounded-xl px-4 py-2 text-sm font-bold transition-all"
          >
            + Add New Category
          </button>
          <button
            onClick={fetchCategories}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {loading && categories.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Retrieving categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No industry categories found in the database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Industry Category</th>
                  <th className="py-3 px-4">Post Template details</th>
                  <th className="py-3 px-4">District Priority / Weight</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white align-top">{cat.industryCategory}</td>
                    <td className="py-4 px-4 text-xs text-gray-300 align-top max-w-sm whitespace-pre-wrap">{cat.post || "N/A"}</td>
                    <td className="py-4 px-4 text-xs text-gray-400 align-top">{cat.districtPriority || "Standard"}</td>
                    <td className="py-4 px-4 text-right align-top text-xs space-x-3">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
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
              <h3 className="text-xl font-bold">Add Industry Category</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Food & Hospitality"
                  value={categoryForm.industryCategory}
                  onChange={(e) => setCategoryForm(p => ({ ...p, industryCategory: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Post Template Metrics</label>
                <textarea
                  rows={3}
                  placeholder="E.g. 24 Posts, 15 Reels, 36 Stories"
                  value={categoryForm.post}
                  onChange={(e) => setCategoryForm(p => ({ ...p, post: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">District Priority (Priority list)</label>
                <input
                  type="text"
                  placeholder="E.g. Khordha, Cuttack"
                  value={categoryForm.districtPriority}
                  onChange={(e) => setCategoryForm(p => ({ ...p, districtPriority: e.target.value }))}
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Edit Industry Category</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.industryCategory}
                  onChange={(e) => setCategoryForm(p => ({ ...p, industryCategory: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Post Template Metrics</label>
                <textarea
                  rows={3}
                  value={categoryForm.post}
                  onChange={(e) => setCategoryForm(p => ({ ...p, post: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">District Priority (Priority list)</label>
                <input
                  type="text"
                  value={categoryForm.districtPriority}
                  onChange={(e) => setCategoryForm(p => ({ ...p, districtPriority: e.target.value }))}
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
