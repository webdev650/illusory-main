"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeCRMEntry() {
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("illusory_token");
    const savedUser = localStorage.getItem("illusory_user");

    if (!savedToken || !savedUser) {
      router.push("/packages/employee/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      const role = (user.role || "").toLowerCase();
      if (role === "admin" || role === "manager") {
        router.push("/packages/employee/dashboard");
      } else {
        router.push("/packages/employee/leads");
      }
    } catch {
      router.push("/packages/employee/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500" />
    </div>
  );
}
