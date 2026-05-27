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
    try {
      return await apiFetch("/package/states");
    } catch (error) {
      console.warn("Using fallback states because backend is offline:", error);
      const states = Array.from(new Set(fallbackDistrictIndustries.map((d: any) => d.state)));
      return states.sort();
    }
  },
  getDistricts: async (state: string) => {
    try {
      return await apiFetch(`/package/districts/${encodeURIComponent(state)}`);
    } catch (error) {
      console.warn(`Using fallback districts for ${state} because backend is offline:`, error);
      const filtered = fallbackDistrictIndustries.filter((d: any) => d.state === state);
      const districts = Array.from(new Set(filtered.map((d: any) => d.district)));
      return districts.sort();
    }
  },
  getIndustries: async (state: string, district: string) => {
    try {
      return await apiFetch(`/package/industries/${encodeURIComponent(state)}/${encodeURIComponent(district)}`);
    } catch (error) {
      console.warn(`Using fallback popular industries for ${district}, ${state} because backend is offline:`, error);
      const record = fallbackDistrictIndustries.find((d: any) => d.state === state && d.district === district);
      if (!record || !record.popularIndustries) {
        return [];
      }
      return record.popularIndustries
        .split(",")
        .map((ind: string) => ind.trim())
        .filter((ind: string) => ind.length > 0);
    }
  },
  getIndustriesList: async () => {
    try {
      return await apiFetch("/package/industries-list");
    } catch (error) {
      console.warn("Using fallback industries list because backend is offline:");
      const industries = Array.from(new Set(fallbackServicePackages.map((p: any) => p.industry)));
      return industries.sort();
    }
  },
  getServicePackages: async () => {
    try {
      return await apiFetch("/package/service-packages");
    } catch (error) {
      console.warn("Using fallback service packages because backend is offline:");
      return fallbackServicePackages;
    }
  },
  getCategories: async () => {
    try {
      return await apiFetch("/package/categories");
    } catch (error) {
      console.warn("Using fallback categories because backend is offline:");
      return fallbackCategories;
    }
  },
  getEstimate: async (industry: string) => {
    try {
      return await apiFetch(`/package/estimate/${encodeURIComponent(industry)}`);
    } catch (error) {
      console.warn(`Using fallback estimate for ${industry} because backend is offline:`, error);
      const servicePkg = fallbackServicePackages.find((pkg: any) => 
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
  },
  submitLead: async (data: any) => {
    try {
      return await apiFetch("/package/lead", { method: "POST", body: JSON.stringify(data) });
    } catch (error) {
      console.warn("Using fallback lead submission because backend is offline:", error);
      return {
        message: "Our team will contact you shortly. (Offline Simulation Mode)",
        lead: data,
      };
    }
  },
  employeeLogin: (data: any) => apiFetch("/package/employee/login", { method: "POST", body: JSON.stringify(data) }),
  getDashboard: (token: string) => apiFetch("/package/dashboard", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }),
  updateLeadStatus: (id: string, status: string, token: string) => apiFetch(`/package/lead/${id}/status`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  }),
  employeeForgotPassword: (emailOrId: string) => apiFetch("/package/employee/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: emailOrId })
  }),
  employeeResetPassword: (emailOrId: string, otp: string, newPassword: string) => apiFetch("/package/employee/reset-password", {
    method: "POST",
    body: JSON.stringify({ email: emailOrId, otp, newPassword })
  }),
  updateLead: (id: string, data: any, token: string) => apiFetch(`/package/lead/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  deleteLead: (id: string, token: string) => apiFetch(`/package/lead/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  }),
  getEmployees: (token: string) => apiFetch("/package/employees", {
    headers: { "Authorization": `Bearer ${token}` }
  }),
  createEmployee: (data: any, token: string) => apiFetch("/package/employees", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  updateEmployee: (id: string, data: any, token: string) => apiFetch(`/package/employees/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  deleteEmployee: (id: string, token: string) => apiFetch(`/package/employees/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  }),
  createCategory: (data: any, token: string) => apiFetch("/package/category", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  updateCategory: (id: string, data: any, token: string) => apiFetch(`/package/category/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  deleteCategory: (id: string, token: string) => apiFetch(`/package/category/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  }),
  createServicePackage: (data: any, token: string) => apiFetch("/package/service-package", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  updateServicePackage: (id: string, data: any, token: string) => apiFetch(`/package/service-package/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  deleteServicePackage: (id: string, token: string) => apiFetch(`/package/service-package/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  }),
  getLocations: (token: string) => apiFetch("/package/locations", {
    headers: { "Authorization": `Bearer ${token}` }
  }),
  createLocation: (data: any, token: string) => apiFetch("/package/location", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  updateLocation: (id: string, data: any, token: string) => apiFetch(`/package/location/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  deleteLocation: (id: string, token: string) => apiFetch(`/package/location/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  }),
};

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
