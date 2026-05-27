"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface EmployeeInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
}

export default function EmployeeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check local storage for session on mount / path change
    const savedToken = localStorage.getItem("illusory_token");
    const savedUser = localStorage.getItem("illusory_user");

    if (pathname === "/packages/employee/login") {
      setLoading(false);
      return;
    }

    if (!savedToken || !savedUser) {
      router.push("/packages/employee/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as EmployeeInfo;
      setToken(savedToken);
      setUser(parsedUser);

      // Role-based route guards
      const role = parsedUser.role.toLowerCase();
      
      if (role === "employee") {
        const allowedPaths = [
          "/packages/employee/leads",
          "/packages/employee/packages",
          "/packages/employee/log-agreement",
          "/packages/employee/settings"
        ];
        // If employee visits dashboard or any other unlisted path, redirect to leads
        const isAllowed = allowedPaths.some(p => pathname.startsWith(p));
        if (!isAllowed) {
          router.push("/packages/employee/leads");
          return;
        }
      } else if (role === "manager") {
        const forbiddenPaths = [
          "/packages/employee/industries",
          "/packages/employee/locations"
        ];
        const isForbidden = forbiddenPaths.some(p => pathname.startsWith(p));
        if (isForbidden) {
          router.push("/packages/employee/dashboard");
          return;
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error parsing user info:", err);
      localStorage.removeItem("illusory_token");
      localStorage.removeItem("illusory_user");
      router.push("/packages/employee/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("illusory_token");
    localStorage.removeItem("illusory_user");
    setToken(null);
    setUser(null);
    router.push("/packages/employee/login");
  };

  if (pathname === "/packages/employee/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-jakartaSans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4" />
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Checking Permissions...</p>
        </div>
      </div>
    );
  }

  const role = user?.role.toLowerCase() || "employee";

  // Define sidebar menu options based on role
  const menuItems = [
    {
      name: "Dashboard",
      path: "/packages/employee/dashboard",
      icon: "📊",
      roles: ["admin", "manager"],
    },
    {
      name: "Customer Leads",
      path: "/packages/employee/leads",
      icon: "👥",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Packages",
      path: "/packages/employee/packages",
      icon: "📦",
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Industries",
      path: "/packages/employee/industries",
      icon: "🏢",
      roles: ["admin"],
    },
    {
      name: "Locations",
      path: "/packages/employee/locations",
      icon: "📍",
      roles: ["admin"],
    },
    {
      name: "Revenue",
      path: "/packages/employee/revenue",
      icon: "💰",
      roles: ["admin", "manager"],
    },
    {
      name: "Employees",
      path: "/packages/employee/employees",
      icon: "👷",
      roles: ["admin", "manager"],
    },
    {
      name: "Log Agreement",
      path: "/packages/employee/log-agreement",
      icon: "🖋️",
      roles: ["employee"], // Dedicated for standard employee logging
    },
    {
      name: "Settings",
      path: "/packages/employee/settings",
      icon: "⚙️",
      roles: ["admin", "manager", "employee"],
    },
  ].filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-black text-white font-jakartaSans flex flex-col md:flex-row relative">
      
      {/* MOBILE TOP BAR */}
      <header className="md:hidden w-full bg-zinc-950 border-b border-white/10 px-6 py-4 flex justify-between items-center z-30">
        <h2 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500">
          Illusory CRM
        </h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none text-2xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static transition-transform duration-300 ease-in-out z-20 w-64 bg-zinc-950 border-r border-white/10 p-6 flex flex-col justify-between h-screen md:h-auto min-h-screen`}
      >
        <div>
          {/* Logo & User profile Card */}
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500 hidden md:block">
              Illusory CRM
            </h2>
            <div className="mt-4 bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex flex-col gap-1">
              <span className="text-sm text-gray-200 font-bold truncate">
                {user?.name}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                ID: {user?.employeeId}
              </span>
              <span className="text-[9px] text-pink-400 font-bold uppercase bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 self-start mt-1">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/15"
                      : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden"
        />
      )}

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-10 min-h-screen overflow-x-hidden relative z-0">
        {children}
      </main>
    </div>
  );
}
