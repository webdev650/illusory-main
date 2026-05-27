"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { packageAPI } from "../../../../services/api";

export default function EmployeeCRMEmployees() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    password: "",
    role: "employee",
    phone: "",
    isActive: true
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

    // Guard path: Admin / Manager only
    const role = parsedUser.role.toLowerCase();
    if (role !== "admin" && role !== "manager") {
      router.push("/packages/employee/dashboard");
      return;
    }

    fetchEmployees(savedToken);
  }, [router]);

  const fetchEmployees = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await packageAPI.getEmployees(authToken);
      setEmployees(data || []);
    } catch (err) {
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEmployeeForm({
      fullName: "",
      employeeId: "",
      email: "",
      password: "",
      role: "employee",
      phone: "",
      isActive: true
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setSelectedEmp(emp);
    setEmployeeForm({
      fullName: emp.fullName || "",
      employeeId: emp.employeeId || "",
      email: emp.email || "",
      password: "", // hide password in edit form by default
      role: emp.role || "employee",
      phone: emp.phone || "",
      isActive: emp.isActive !== undefined ? emp.isActive : true
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await packageAPI.createEmployee(employeeForm, token);
      if (response.success) {
        setEmployees(prev => [...prev, response.employee].sort((a, b) => a.fullName.localeCompare(b.fullName)));
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedEmp) return;

    try {
      // Exclude empty password from request body
      const payload: any = {
        fullName: employeeForm.fullName,
        email: employeeForm.email,
        phone: employeeForm.phone,
        role: employeeForm.role,
        isActive: employeeForm.isActive
      };
      if (employeeForm.password) {
        payload.password = employeeForm.password;
      }

      const response = await packageAPI.updateEmployee(selectedEmp._id, payload, token);
      if (response.success) {
        setEmployees(prev =>
          prev.map(e => (e._id === selectedEmp._id ? response.employee : e)).sort((a, b) => a.fullName.localeCompare(b.fullName))
        );
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!token) return;
    if (id === currentUser?.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this employee account?")) return;

    try {
      await packageAPI.deleteEmployee(id, token);
      setEmployees(prev => prev.filter(e => e._id !== id));
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
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

  const isPrivileged = currentUser?.role.toLowerCase() === "admin";

  return (
    <div className="space-y-8 animate-fade-in relative font-jakartaSans text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Studio Personnel</h1>
          <p className="text-gray-400 text-sm mt-1">Review employee roles, access credentials, and contact logs across active studio shifts.</p>
        </div>
        <div className="flex gap-3">
          {isPrivileged && (
            <button
              onClick={handleOpenAdd}
              className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 rounded-xl px-4 py-2 text-sm font-bold transition-all"
            >
              + Create Employee Account
            </button>
          )}
          <button
            onClick={() => token && fetchEmployees(token)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold transition-all"
          >
            ↻ Refresh Staff
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {loading && employees.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Retrieving employee roster...</div>
        ) : employees.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No employees registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 font-center">Role</th>
                  <th className="py-3 px-4">Joining Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {isPrivileged && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-gray-300 align-middle">{emp.employeeId}</td>
                    <td className="py-4 px-4 font-bold text-white align-middle">{emp.fullName}</td>
                    <td className="py-4 px-4 text-gray-300 align-middle">{emp.email}</td>
                    <td className="py-4 px-4 text-gray-400 align-middle">{emp.phone || "N/A"}</td>
                    <td className="py-4 px-4 align-middle">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        emp.role === "admin"
                          ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                          : emp.role === "manager"
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-400 align-middle">{formatDate(emp.joiningDate)}</td>
                    <td className="py-4 px-4 text-center align-middle">
                      <span className={`text-[10px] font-bold rounded-full px-2 py-1 border ${
                        emp.isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {emp.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {isPrivileged && (
                      <td className="py-4 px-4 text-right align-middle text-xs space-x-3">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp._id)}
                          className="text-red-400 hover:text-red-300 font-bold transition-colors"
                          disabled={emp._id === currentUser?.id}
                        >
                          Delete
                        </button>
                      </td>
                    )}
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
              <h3 className="text-xl font-bold">Create Employee Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm(p => ({ ...p, fullName: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. IDS005"
                    value={employeeForm.employeeId}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, employeeId: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="9999988888"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="work@illusory.design"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Access Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Roster Role</label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Status</label>
                  <select
                    value={employeeForm.isActive ? "true" : "false"}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, isActive: e.target.value === "true" }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
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
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-3xl text-white shadow-2xl z-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Edit Employee Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm(p => ({ ...p, fullName: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Employee ID</label>
                  <input
                    type="text"
                    disabled
                    value={employeeForm.employeeId}
                    className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Work Email *</label>
                <input
                  type="email"
                  required
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Override Password (leave blank to keep current)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Roster Role</label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">Status</label>
                  <select
                    value={employeeForm.isActive ? "true" : "false"}
                    onChange={(e) => setEmployeeForm(p => ({ ...p, isActive: e.target.value === "true" }))}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
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
