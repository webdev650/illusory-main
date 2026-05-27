import {
  fallbackProjects,
  fallbackFAQs,
  fallbackServices,
  fallbackAboutSlides,
  fallbackDistrictIndustries,
  fallbackCategories,
  fallbackServicePackages
} from "./fallbackData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
};

const isBrowser = typeof window !== "undefined";

const getOfflineData = (key: string, defaultValue: any) => {
  if (!isBrowser) return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultValue;
    }
  }
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
};

const setOfflineData = (key: string, value: any) => {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const mockEmployees = [
  {
    _id: "emp_admin",
    id: "emp_admin",
    fullName: "Admin User",
    employeeId: "IDS001",
    email: "admin@illusory.design",
    password: "Admin@123",
    role: "admin",
    phone: "9999999991",
    isActive: true,
    joiningDate: new Date().toISOString()
  },
  {
    _id: "emp_manager",
    id: "emp_manager",
    fullName: "Manager User",
    employeeId: "IDS002",
    email: "manager@illusory.design",
    password: "Manager@123",
    role: "manager",
    phone: "9999999992",
    isActive: true,
    joiningDate: new Date().toISOString()
  },
  {
    _id: "emp1",
    id: "emp1",
    fullName: "Employee One",
    employeeId: "IDS003",
    email: "employee1@illusory.design",
    password: "Employee@123",
    role: "employee",
    phone: "9999999993",
    isActive: true,
    joiningDate: new Date().toISOString()
  },
  {
    _id: "emp2",
    id: "emp2",
    fullName: "Employee Two",
    employeeId: "IDS004",
    email: "employee2@illusory.design",
    password: "Employee@123",
    role: "employee",
    phone: "9999999994",
    isActive: true,
    joiningDate: new Date().toISOString()
  }
];

const mockLeads = [
  {
    _id: "lead1",
    name: "Aarav Sharma",
    businessName: "Sharma Textiles",
    email: "aarav@sharmatextiles.com",
    phone: "9876543210",
    state: "Odisha",
    district: "Cuttack",
    industry: "Textile",
    selectedPackage: "GROWTH",
    estimatedBudget: "₹18,000",
    status: "New",
    assignedEmployee: "Employee One",
    message: "Interested in rebranding and social media marketing.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "lead2",
    name: "Priya Patel",
    businessName: "Greenwood Cafe",
    email: "priya@greenwoodcafe.in",
    phone: "9876543211",
    state: "Odisha",
    district: "Khordha",
    industry: "Cafe",
    selectedPackage: "STARTER",
    estimatedBudget: "₹12,000",
    status: "Contacted",
    assignedEmployee: "Employee Two",
    message: "We need basic UI/UX designs and Instagram logo graphics.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "lead3",
    name: "Vikram Malhotra",
    businessName: "V-Tech Solutions",
    email: "vikram@vtechsolutions.com",
    phone: "9876543212",
    state: "Karnataka",
    district: "Bangalore",
    industry: "IT Services",
    selectedPackage: "PREMIUM",
    estimatedBudget: "₹95,000",
    status: "Converted",
    assignedEmployee: "Employee One",
    message: "Need a full custom enterprise platform, UI/UX and 3D animations.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "lead4",
    name: "Anjali Devi",
    businessName: "Devi Healthcare",
    email: "contact@devihealthcare.org",
    phone: "9876543213",
    state: "Odisha",
    district: "Khordha",
    industry: "Healthcare",
    selectedPackage: "PREMIUM",
    estimatedBudget: "₹110,000",
    status: "Proposal Sent",
    assignedEmployee: "",
    message: "Medical clinic branding and hospital campaign.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const handleApiFallback = async <T>(
  apiCall: () => Promise<T>,
  fallbackCall: () => T | Promise<T>
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn("API call failed, falling back to local simulation mode:", error);
    return await fallbackCall();
  }
};

export const servicesAPI = {
  getAll: async () => {
    try {
      return await apiFetch("/services");
    } catch (error) {
      console.warn("Using fallback services data because backend is offline:", error);
      return fallbackServices;
    }
  },
  create: (data: any) => apiFetch("/services", { method: "POST", body: JSON.stringify(data) }),
};

export const projectsAPI = {
  getAll: async () => {
    try {
      return await apiFetch("/projects");
    } catch (error) {
      console.warn("Using fallback projects data because backend is offline:", error);
      return fallbackProjects;
    }
  },
  getOne: async (navigation: string) => {
    try {
      return await apiFetch(`/projects/${navigation}`);
    } catch (error) {
      console.warn(`Using fallback project data for ${navigation} because backend is offline:`, error);
      const found = fallbackProjects.find(p => p.navigation === navigation);
      if (found) return found;
      throw error;
    }
  },
  create: (data: any) => apiFetch("/projects", { method: "POST", body: JSON.stringify(data) }),
};

export const contactAPI = {
  getAll: () => apiFetch("/contact"),
  submit: (data: any) => apiFetch("/contact", { method: "POST", body: JSON.stringify(data) }),
};

export const faqAPI = {
  getAll: async () => {
    try {
      return await apiFetch("/faq");
    } catch (error) {
      console.warn("Using fallback FAQ data because backend is offline:", error);
      return fallbackFAQs;
    }
  },
};

export const aboutAPI = {
  getAll: async () => {
    try {
      return await apiFetch("/about");
    } catch (error) {
      console.warn("Using fallback About slides data because backend is offline:", error);
      return fallbackAboutSlides;
    }
  },
};

export const seedAPI = {
  run: () => apiFetch("/seed"),
};

export const packageAPI = {
  getStates: async () => {
    return handleApiFallback(
      () => apiFetch("/package/states"),
      () => {
        const locations = getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
        const states = Array.from(new Set(locations.map((d: any) => d.state)));
        return states.sort();
      }
    );
  },
  getDistricts: async (state: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/districts/${encodeURIComponent(state)}`),
      () => {
        const locations = getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
        const filtered = locations.filter((d: any) => d.state === state);
        const districts = Array.from(new Set(filtered.map((d: any) => d.district)));
        return districts.sort();
      }
    );
  },
  getIndustries: async (state: string, district: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/industries/${encodeURIComponent(state)}/${encodeURIComponent(district)}`),
      () => {
        const locations = getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
        const record = locations.find((d: any) => d.state === state && d.district === district);
        if (!record || !record.popularIndustries) {
          return [];
        }
        return record.popularIndustries
          .split(",")
          .map((ind: string) => ind.trim())
          .filter((ind: string) => ind.length > 0);
      }
    );
  },
  getIndustriesList: async () => {
    return handleApiFallback(
      () => apiFetch("/package/industries-list"),
      () => {
        const pkgs = getOfflineData("illusory_offline_packages", fallbackServicePackages);
        const industries = Array.from(new Set(pkgs.map((p: any) => p.industry)));
        return industries.sort();
      }
    );
  },
  getServicePackages: async () => {
    return handleApiFallback(
      () => apiFetch("/package/service-packages"),
      () => {
        return getOfflineData("illusory_offline_packages", fallbackServicePackages);
      }
    );
  },
  getCategories: async () => {
    return handleApiFallback(
      () => apiFetch("/package/categories"),
      () => {
        return getOfflineData("illusory_offline_categories", fallbackCategories);
      }
    );
  },
  getEstimate: async (industry: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/estimate/${encodeURIComponent(industry)}`),
      () => {
        const pkgs = getOfflineData("illusory_offline_packages", fallbackServicePackages);
        const servicePkg = pkgs.find((pkg: any) => 
          pkg.industry.toLowerCase() === industry.toLowerCase()
        );
        if (!servicePkg) {
          throw new Error(`Package details for industry "${industry}" not found.`);
        }
        
        const categoryName = servicePkg.category || "";
        const starterMetrics = parseDeliverablesText(servicePkg.basicDeliverables || "");
        const growthMetrics = parseDeliverablesText(servicePkg.standardDeliverables || "");
        const premiumMetrics = parseDeliverablesText(servicePkg.premiumDeliverables || "");
        
        const starterPricing = calculateDynamicPricing("starter", industry, categoryName, starterMetrics);
        const growthPricing = calculateDynamicPricing("growth", industry, categoryName, growthMetrics);
        const premiumPricing = calculateDynamicPricing("premium", industry, categoryName, premiumMetrics);
        
        return {
          industry: servicePkg.industry,
          category: servicePkg.category,
          subSegments: servicePkg.subSegments,
          type: servicePkg.type,
          pricingTier: starterPricing.min >= 25000 ? "high" : starterPricing.min >= 10000 ? "medium" : "low",
          packages: {
            starter: {
              name: servicePkg.basic || "Starter",
              deliverables: servicePkg.basicDeliverables || "",
              priceRange: starterPricing.priceRange,
              timeline: starterPricing.timeline,
              posts: starterPricing.posts,
              reels: starterPricing.reels,
              stories: starterPricing.stories,
              carousels: starterPricing.carousels,
              internalCost: starterPricing.internalCost,
            },
            growth: {
              name: servicePkg.standard || "Growth",
              deliverables: servicePkg.standardDeliverables || "",
              priceRange: growthPricing.priceRange,
              timeline: growthPricing.timeline,
              posts: growthPricing.posts,
              reels: growthPricing.reels,
              stories: growthPricing.stories,
              carousels: growthPricing.carousels,
              internalCost: growthPricing.internalCost,
            },
            premium: {
              name: servicePkg.premium || "Premium",
              deliverables: servicePkg.premiumDeliverables || "",
              priceRange: premiumPricing.priceRange,
              timeline: premiumPricing.timeline,
              posts: premiumPricing.posts,
              reels: premiumPricing.reels,
              stories: premiumPricing.stories,
              carousels: premiumPricing.carousels,
              internalCost: premiumPricing.internalCost,
            }
          }
        };
      }
    );
  },
  submitLead: async (data: any) => {
    return handleApiFallback(
      () => apiFetch("/package/lead", { method: "POST", body: JSON.stringify(data) }),
      () => {
        const leads = getOfflineData("illusory_offline_leads", mockLeads);
        const newLead = {
          _id: `lead_${Date.now()}`,
          ...data,
          status: data.status || "New",
          createdAt: new Date().toISOString()
        };
        leads.push(newLead);
        setOfflineData("illusory_offline_leads", leads);
        return {
          message: "Our team will contact you shortly. (Offline Simulation Mode)",
          lead: newLead,
        };
      }
    );
  },
  employeeLogin: async (data: any) => {
    return handleApiFallback(
      () => apiFetch("/package/employee/login", { method: "POST", body: JSON.stringify(data) }),
      () => {
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const emailOrId = (data.email || "").toLowerCase();
        const found = emps.find(
          (e: any) =>
            (e.email.toLowerCase() === emailOrId ||
              e.employeeId.toLowerCase() === emailOrId) &&
            e.password === data.password
        );
        if (!found) {
          throw new Error("Invalid email/employee ID or password (Offline Mode).");
        }
        if (!found.isActive) {
          throw new Error("Employee account is inactive (Offline Mode).");
        }
        const token = `offline-token-${found.employeeId}-${Date.now()}`;
        return {
          success: true,
          message: "Login successful (Offline Simulation Mode)!",
          token,
          employee: {
            id: found._id || found.id,
            name: found.fullName,
            email: found.email,
            role: found.role,
            employeeId: found.employeeId
          }
        };
      }
    );
  },
  getDashboard: async (token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }),
      () => {
        const leads = getOfflineData("illusory_offline_leads", mockLeads);
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const pkgs = getOfflineData("illusory_offline_packages", fallbackServicePackages);
        
        const totalLeads = leads.length;
        const convertedLeads = leads.filter((l: any) => l.status === "Converted").length;
        
        const totalRevenue = leads
          .filter((l: any) => l.status === "Converted")
          .reduce((sum: number, lead: any) => {
            const budgetStr = lead.estimatedBudget || "";
            const numbers = budgetStr.match(/\d+/g);
            if (numbers && numbers.length > 0) {
              const parsedNums = numbers.map((n: string) => parseFloat(n));
              const avg = parsedNums.reduce((s: number, val: number) => s + val, 0) / parsedNums.length;
              return sum + avg;
            }
            return sum;
          }, 0);

        const employeeStrength = emps.length;
        const totalIndustries = Array.from(new Set(pkgs.map((p: any) => p.industry))).length;
        const totalPackages = pkgs.length * 3;

        return {
          stats: {
            totalLeads,
            convertedLeads,
            monthlyRevenue: `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`,
            onboardingCount: convertedLeads,
            employeeStrength,
            totalIndustries,
            totalPackages
          },
          leads: [...leads].sort((a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()),
        };
      }
    );
  },
  updateLeadStatus: async (id: string, status: string, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/lead/${id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }),
      () => {
        const leads = getOfflineData("illusory_offline_leads", mockLeads);
        const index = leads.findIndex((l: any) => l._id === id);
        if (index === -1) {
          throw new Error("Lead not found.");
        }
        leads[index].status = status;
        setOfflineData("illusory_offline_leads", leads);
        return { success: true, lead: leads[index] };
      }
    );
  },
  employeeForgotPassword: async (emailOrId: string) => {
    return handleApiFallback(
      () => apiFetch("/package/employee/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: emailOrId })
      }),
      () => {
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const lowerVal = emailOrId.toLowerCase();
        const found = emps.find(
          (e: any) => e.email.toLowerCase() === lowerVal || e.employeeId.toLowerCase() === lowerVal
        );
        if (!found) {
          throw new Error("Employee account not found.");
        }
        return {
          success: true,
          message: "Password reset verification code has been dispatched. (Offline simulated OTP: 123456)"
        };
      }
    );
  },
  employeeResetPassword: async (emailOrId: string, otp: string, newPassword: string) => {
    return handleApiFallback(
      () => apiFetch("/package/employee/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: emailOrId, otp, newPassword })
      }),
      () => {
        if (otp !== "123456") {
          throw new Error("Invalid or expired verification code (Simulated OTP is 123456).");
        }
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const lowerVal = emailOrId.toLowerCase();
        const index = emps.findIndex(
          (e: any) => e.email.toLowerCase() === lowerVal || e.employeeId.toLowerCase() === lowerVal
        );
        if (index === -1) {
          throw new Error("Employee account not found.");
        }
        emps[index].password = newPassword;
        setOfflineData("illusory_offline_employees", emps);
        return {
          success: true,
          message: "Password has been successfully updated! You can log in now."
        };
      }
    );
  },
  updateLead: async (id: string, data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/lead/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const leads = getOfflineData("illusory_offline_leads", mockLeads);
        const index = leads.findIndex((l: any) => l._id === id);
        if (index === -1) {
          throw new Error("Lead not found.");
        }
        leads[index] = { ...leads[index], ...data };
        setOfflineData("illusory_offline_leads", leads);
        return { success: true, lead: leads[index] };
      }
    );
  },
  deleteLead: async (id: string, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/lead/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        const leads = getOfflineData("illusory_offline_leads", mockLeads);
        const filtered = leads.filter((l: any) => l._id !== id);
        setOfflineData("illusory_offline_leads", filtered);
        return { success: true, message: "Lead deleted successfully" };
      }
    );
  },
  getEmployees: async (token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/employees", {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        return emps.map(({ password, ...rest }: any) => rest);
      }
    );
  },
  createEmployee: async (data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/employees", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const existing = emps.find(
          (e: any) => e.email === data.email || e.employeeId === data.employeeId
        );
        if (existing) {
          throw new Error("Employee with this Email or Employee ID already exists.");
        }
        const newEmp = {
          _id: `emp_${Date.now()}`,
          id: `emp_${Date.now()}`,
          ...data,
          isActive: data.isActive !== undefined ? data.isActive : true,
          joiningDate: new Date().toISOString()
        };
        emps.push(newEmp);
        setOfflineData("illusory_offline_employees", emps);
        return { success: true, employee: newEmp };
      }
    );
  },
  updateEmployee: async (id: string, data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/employees/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const index = emps.findIndex((e: any) => e._id === id || e.id === id);
        if (index === -1) {
          throw new Error("Employee not found.");
        }
        emps[index] = { ...emps[index], ...data };
        setOfflineData("illusory_offline_employees", emps);
        return { success: true, employee: emps[index] };
      }
    );
  },
  deleteEmployee: async (id: string, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/employees/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        const emps = getOfflineData("illusory_offline_employees", mockEmployees);
        const filtered = emps.filter((e: any) => e._id !== id && e.id !== id);
        setOfflineData("illusory_offline_employees", filtered);
        return { success: true, message: "Employee deleted successfully" };
      }
    );
  },
  createCategory: async (data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/category", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const cats = getOfflineData("illusory_offline_categories", fallbackCategories);
        const newCat = { _id: `cat_${Date.now()}`, ...data };
        cats.push(newCat);
        setOfflineData("illusory_offline_categories", cats);
        return { success: true, category: newCat };
      }
    );
  },
  updateCategory: async (id: string, data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/category/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const cats = getOfflineData("illusory_offline_categories", fallbackCategories);
        const index = cats.findIndex((c: any) => c._id === id);
        if (index === -1) throw new Error("Category not found.");
        cats[index] = { ...cats[index], ...data };
        setOfflineData("illusory_offline_categories", cats);
        return { success: true, category: cats[index] };
      }
    );
  },
  deleteCategory: async (id: string, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/category/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        const cats = getOfflineData("illusory_offline_categories", fallbackCategories);
        const filtered = cats.filter((c: any) => c._id !== id);
        setOfflineData("illusory_offline_categories", filtered);
        return { success: true, message: "Category deleted successfully" };
      }
    );
  },
  createServicePackage: async (data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/service-package", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const pkgs = getOfflineData("illusory_offline_packages", fallbackServicePackages);
        const newPkg = { _id: `pkg_${Date.now()}`, ...data };
        pkgs.push(newPkg);
        setOfflineData("illusory_offline_packages", pkgs);
        return { success: true, servicePkg: newPkg };
      }
    );
  },
  updateServicePackage: async (id: string, data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/service-package/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const pkgs = getOfflineData("illusory_offline_packages", fallbackServicePackages);
        const index = pkgs.findIndex((p: any) => p._id === id);
        if (index === -1) throw new Error("Service package not found.");
        pkgs[index] = { ...pkgs[index], ...data };
        setOfflineData("illusory_offline_packages", pkgs);
        return { success: true, servicePkg: pkgs[index] };
      }
    );
  },
  deleteServicePackage: async (id: string, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/service-package/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        const pkgs = getOfflineData("illusory_offline_packages", fallbackServicePackages);
        const filtered = pkgs.filter((p: any) => p._id !== id);
        setOfflineData("illusory_offline_packages", filtered);
        return { success: true, message: "Service package deleted successfully" };
      }
    );
  },
  getLocations: async (token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/locations", {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        return getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
      }
    );
  },
  createLocation: async (data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch("/package/location", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const locs = getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
        const newLoc = { _id: `loc_${Date.now()}`, ...data };
        locs.push(newLoc);
        setOfflineData("illusory_offline_locations", locs);
        return { success: true, location: newLoc };
      }
    );
  },
  updateLocation: async (id: string, data: any, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/location/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      }),
      () => {
        const locs = getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
        const index = locs.findIndex((l: any) => l._id === id);
        if (index === -1) throw new Error("Location not found.");
        locs[index] = { ...locs[index], ...data };
        setOfflineData("illusory_offline_locations", locs);
        return { success: true, location: locs[index] };
      }
    );
  },
  deleteLocation: async (id: string, token: string) => {
    return handleApiFallback(
      () => apiFetch(`/package/location/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }),
      () => {
        const locs = getOfflineData("illusory_offline_locations", fallbackDistrictIndustries);
        const filtered = locs.filter((l: any) => l._id !== id);
        setOfflineData("illusory_offline_locations", filtered);
        return { success: true, message: "Location mapping deleted successfully" };
      }
    );
  },
};;

// --- ESTIMATION OFFLINE HELPERS ---

function parseDeliverablesText(text: string) {
  let posts = 12;
  let reels = 4;
  let stories = 15;
  let carousels = 2;
  let hasWebsite = false;

  if (!text) return { posts, reels, stories, carousels, hasWebsite };
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("website") || lowerText.includes("portal") || lowerText.includes("landing page")) {
    hasWebsite = true;
  }

  const postMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:posts|content|creatives|pieces)/);
  if (postMatch) {
    const minVal = parseInt(postMatch[1]);
    const maxVal = postMatch[2] ? parseInt(postMatch[2]) : minVal;
    posts = Math.round((minVal + maxVal) / 2);
  }

  const reelMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:reels|shorts|videos)/);
  if (reelMatch) {
    const minVal = parseInt(reelMatch[1]);
    const maxVal = reelMatch[2] ? parseInt(reelMatch[2]) : minVal;
    reels = Math.round((minVal + maxVal) / 2);
  }

  const storyMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:stories|engagements)/);
  if (storyMatch) {
    const minVal = parseInt(storyMatch[1]);
    const maxVal = storyMatch[2] ? parseInt(storyMatch[2]) : minVal;
    stories = Math.round((minVal + maxVal) / 2);
  } else {
    stories = Math.round(posts * 1.5);
  }

  const carouselMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:carousels)/);
  if (carouselMatch) {
    const minVal = parseInt(carouselMatch[1]);
    const maxVal = carouselMatch[2] ? parseInt(carouselMatch[2]) : minVal;
    carousels = Math.round((minVal + maxVal) / 2);
  }

  return { posts, reels, stories, carousels, hasWebsite };
}

function calculateDynamicPricing(
  tier: "starter" | "growth" | "premium",
  industryName: string,
  categoryName: string,
  metrics: { posts: number, reels: number, stories: number, carousels: number, hasWebsite: boolean }
) {
  let multiplier = 1.0;
  const name = (categoryName + " " + industryName).toLowerCase();
  
  if (name.includes("hospital") || name.includes("healthcare") || name.includes("medical") || name.includes("clinic") || name.includes("doctor")) {
    multiplier = 2.5;
  } else if (name.includes("tech") || name.includes("software") || name.includes("saas") || name.includes("it services") || name.includes("corporate") || name.includes("b2b")) {
    multiplier = 2.0;
  } else if (name.includes("real estate") || name.includes("property") || name.includes("interior") || name.includes("architecture")) {
    multiplier = 1.8;
  } else if (name.includes("cafe") || name.includes("restaurant") || name.includes("food") || name.includes("bakery") || name.includes("hotel") || name.includes("resort")) {
    multiplier = 1.5;
  } else if (name.includes("beauty") || name.includes("salon") || name.includes("spa") || name.includes("fashion") || name.includes("boutique") || name.includes("makeup") || name.includes("textile")) {
    multiplier = 1.25;
  } else if (name.includes("ngo") || name.includes("foundation") || name.includes("social")) {
    multiplier = 0.8;
  }

  let basePriceMin = 5000;
  let basePriceMax = 10000;
  let timeline = "15 days";

  if (tier === "growth") {
    basePriceMin = 10000;
    basePriceMax = 20000;
    timeline = "30 days";
  } else if (tier === "premium") {
    basePriceMin = 20000;
    basePriceMax = 40000;
    timeline = "45 days";
  }

  const postCost = metrics.posts * 150;
  const reelCost = metrics.reels * 800;
  const storyCost = metrics.stories * 50;
  const carouselCost = metrics.carousels * 300;
  const websiteCost = metrics.hasWebsite ? 8000 : 0;

  const deliverablesCost = postCost + reelCost + storyCost + carouselCost + websiteCost;

  let finalMin = (basePriceMin + deliverablesCost) * multiplier;
  let finalMax = (basePriceMax + deliverablesCost) * multiplier;

  finalMin = Math.round(finalMin / 1000) * 1000;
  finalMax = Math.round(finalMax / 1000) * 1000;

  if (finalMin < 5000) finalMin = 5000;
  if (finalMax < finalMin + 5000) finalMax = finalMin + 5000;

  let marginPct = 0.20;
  if (tier === "growth") marginPct = 0.25;
  if (tier === "premium") marginPct = 0.30;
  const internalCost = Math.round(finalMin * (1 - marginPct));

  return {
    min: finalMin,
    max: finalMax,
    timeline,
    posts: metrics.posts,
    reels: metrics.reels,
    stories: metrics.stories,
    carousels: metrics.carousels,
    internalCost,
    priceRange: `₹${finalMin.toLocaleString("en-IN")}–₹${finalMax.toLocaleString("en-IN")}`
  };
}
