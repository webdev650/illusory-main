import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import DistrictIndustry from "../models/DistrictIndustry";
import IndustryCategory from "../models/IndustryCategory";
import ServicePackage from "../models/ServicePackage";
import CustomerLead from "../models/CustomerLead";
import Employee, { hashPassword } from "../models/Employee";
import transporter from "../config/nodemailer";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "illusory-secret-key-123456";

// Middleware to authenticate employee
async function authenticateEmployee(req: Request, res: Response, next: NextFunction): Promise<any> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    }
    (req as any).employee = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}

// Helper to determine cost tier
function getCostTier(industryCategory: string): "high" | "medium" | "low" {
  const highTier = ["healthcare", "hospital", "it services", "real estate", "hotel", "resort", "jewelry", "software", "b2b services", "pharmacy"];
  const lowTier = ["ngo", "foundation", "hardware", "cleaning", "agriculture", "boutique", "local"];
  const name = industryCategory.toLowerCase();
  
  if (highTier.some(keyword => name.includes(keyword))) {
    return "high";
  }
  if (lowTier.some(keyword => name.includes(keyword))) {
    return "low";
  }
  return "medium";
}

// Pricing ranges helper
function getPricingForTier(tier: "high" | "medium" | "low") {
  if (tier === "high") {
    return {
      starter: { min: 25000, max: 40000, timeline: "20 days" },
      growth: { min: 40000, max: 70000, timeline: "35 days" },
      premium: { min: 70000, max: 150000, timeline: "50 days" }
    };
  } else if (tier === "low") {
    return {
      starter: { min: 8000, max: 15000, timeline: "10 days" },
      growth: { min: 15000, max: 25000, timeline: "20 days" },
      premium: { min: 25000, max: 45000, timeline: "30 days" }
    };
  } else {
    return {
      starter: { min: 10000, max: 20000, timeline: "15 days" },
      growth: { min: 20000, max: 40000, timeline: "30 days" },
      premium: { min: 40000, max: 70000, timeline: "45 days" }
    };
  }
}

// Helper to parse post/reel/story counts and website presence from text
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

  // Parse posts e.g. "10–12 posts" or "18–22 content pieces"
  const postMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:posts|content|creatives|pieces)/);
  if (postMatch) {
    const minVal = parseInt(postMatch[1]);
    const maxVal = postMatch[2] ? parseInt(postMatch[2]) : minVal;
    posts = Math.round((minVal + maxVal) / 2);
  }

  // Parse reels e.g. "4–6 reels" or "10–12 reels"
  const reelMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:reels|shorts|videos)/);
  if (reelMatch) {
    const minVal = parseInt(reelMatch[1]);
    const maxVal = reelMatch[2] ? parseInt(reelMatch[2]) : minVal;
    reels = Math.round((minVal + maxVal) / 2);
  }

  // Parse stories e.g. "15–20 stories" or default based on posts
  const storyMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:stories|engagements)/);
  if (storyMatch) {
    const minVal = parseInt(storyMatch[1]);
    const maxVal = storyMatch[2] ? parseInt(storyMatch[2]) : minVal;
    stories = Math.round((minVal + maxVal) / 2);
  } else {
    stories = Math.round(posts * 1.5);
  }

  // Parse carousels
  const carouselMatch = lowerText.match(/(\d+)(?:[-–](\d+))?\s*(?:carousels)/);
  if (carouselMatch) {
    const minVal = parseInt(carouselMatch[1]);
    const maxVal = carouselMatch[2] ? parseInt(carouselMatch[2]) : minVal;
    carousels = Math.round((minVal + maxVal) / 2);
  }

  return { posts, reels, stories, carousels, hasWebsite };
}

// Helper to calculate pricing dynamically using complexity multipliers and deliverables costs
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

  // Deliverables Cost additions:
  // Posts = ₹150 each, Reels = ₹800 each, Stories = ₹50 each, Carousels = ₹300 each
  // Website = +₹8,000 to base
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

// Notification helpers
async function sendLeadEmailNotification(lead: any) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("✉️ [Email Notification Stub] Auth missing. Lead Summary:");
      console.log(`  Name: ${lead.name}, Email: ${lead.email}, Selected: ${lead.selectedPackage}, Budget: ${lead.estimatedBudget}`);
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: lead.email,
      subject: `Your Project Estimate confirmation - ${lead.businessName}`,
      html: `
        <h2>Hi ${lead.name},</h2>
        <p>Thanks for choosing Illusory Design Studios. We have received your project estimate request!</p>
        <p><strong>Here are your details:</strong></p>
        <ul>
          <li><strong>Business Name:</strong> ${lead.businessName}</li>
          <li><strong>Industry Category:</strong> ${lead.industry}</li>
          <li><strong>Location:</strong> ${lead.district}, ${lead.state}</li>
          <li><strong>Selected Package:</strong> ${lead.selectedPackage}</li>
          <li><strong>Estimated Budget:</strong> ${lead.estimatedBudget}</li>
        </ul>
        <p>Our team will reach out to you shortly to finalize details!</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("✉️ Nodemailer: Confirmation email sent.");
  } catch (error) {
    console.error("❌ Email notification failed:", error);
  }
}

function triggerWhatsAppNotification(lead: any) {
  console.log(`📱 [WhatsApp Notify API] Recipient: ${lead.phone}`);
  console.log(`   Message: "Hello ${lead.name}! Your Package estimate for ${lead.businessName} is registered. Selected Package: ${lead.selectedPackage}. Budget: ${lead.estimatedBudget}."`);
}

function triggerCRMLeadSync(lead: any) {
  console.log(`📊 [CRM Sync] Synchronizing client "${lead.businessName}" to CRM pipelines.`);
}

// --- API ENDPOINTS ---

// GET /api/package/industries-list
router.get("/industries-list", async (req: Request, res: Response) => {
  try {
    const industries = await ServicePackage.distinct("industry");
    res.json(industries.sort());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/service-packages
router.get("/service-packages", async (req: Request, res: Response) => {
  try {
    const pkgs = await ServicePackage.find().sort({ serialNumber: 1 });
    res.json(pkgs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/states
router.get("/states", async (req: Request, res: Response) => {
  try {
    const states = await DistrictIndustry.distinct("state");
    res.json(states.sort());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/districts/:state
router.get("/districts/:state", async (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    const districts = await DistrictIndustry.find({ state }).distinct("district");
    res.json(districts.sort());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/industries/:state/:district
router.get("/industries/:state/:district", async (req: Request, res: Response) => {
  try {
    const { state, district } = req.params;
    const record = await DistrictIndustry.findOne({ state, district });
    if (!record || !record.popularIndustries) {
      return res.json([]);
    }
    const industries = record.popularIndustries
      .split(",")
      .map((ind: string) => ind.trim())
      .filter((ind: string) => ind.length > 0);
    res.json(industries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await IndustryCategory.find();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/estimate/:industry
router.get("/estimate/:industry", async (req: Request, res: Response) => {
  try {
    const { industry } = req.params;
    const industryStr = String(industry);
    
    // Find matching package details
    const servicePkg = await ServicePackage.findOne({
      industry: { $regex: new RegExp("^" + industryStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
    });

    if (!servicePkg) {
      return res.status(404).json({ error: `Package details for industry "${industryStr}" not found.` });
    }

    const categoryName = servicePkg.category || "";

    // Parse deliverables text for each package tier dynamically
    const starterMetrics = parseDeliverablesText(servicePkg.basicDeliverables || "");
    const growthMetrics = parseDeliverablesText(servicePkg.standardDeliverables || "");
    const premiumMetrics = parseDeliverablesText(servicePkg.premiumDeliverables || "");

    // Calculate dynamic pricing range & timelines using complexity multiplier formulas
    const starterPricing = calculateDynamicPricing("starter", industryStr, categoryName, starterMetrics);
    const growthPricing = calculateDynamicPricing("growth", industryStr, categoryName, growthMetrics);
    const premiumPricing = calculateDynamicPricing("premium", industryStr, categoryName, premiumMetrics);

    res.json({
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
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/lead
router.post("/lead", async (req: Request, res: Response) => {
  try {
    const leadData = req.body;
    const lead = await CustomerLead.create(leadData);

    // Trigger Notification Hub
    await sendLeadEmailNotification(lead);
    triggerWhatsAppNotification(lead);
    triggerCRMLeadSync(lead);

    res.json({
      message: "Our team will contact you shortly.",
      lead,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/package/lead/:id/status
router.put("/lead/:id/status", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Converted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const lead = await CustomerLead.findByIdAndUpdate(id, { status }, { new: true });
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ message: "Lead status updated successfully", lead });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/employee/login
router.post("/employee/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email: emailOrId, password } = req.body;
    if (!emailOrId || !password) {
      return res.status(400).json({ error: "Email/Employee ID and password are required." });
    }

    const employee = await Employee.findOne({
      $or: [
        { email: emailOrId },
        { employeeId: emailOrId }
      ]
    });

    if (!employee) {
      return res.status(400).json({ error: "Invalid email/employee ID or password." });
    }

    if (!employee.isActive) {
      return res.status(403).json({ error: "Employee account is inactive. Please contact admin." });
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email/employee ID or password." });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        email: employee.email,
        name: employee.fullName,
        role: employee.role,
        employeeId: employee.employeeId
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
      employee: {
        id: employee._id,
        name: employee.fullName,
        email: employee.email,
        role: employee.role,
        employeeId: employee.employeeId
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper for sending OTP email
async function sendOtpEmailNotification(email: string, otp: string) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`✉️ [OTP Email Stub] Recipient: ${email}, OTP Code: ${otp}`);
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Illusory Portal Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Illusory Design Studios employee account.</p>
        <p>Your 6-digit verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #ff1284; font-family: monospace;">${otp}</h1>
        <p>This code will expire in 10 minutes. If you did not make this request, please ignore this email.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Nodemailer: OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
  }
}

// POST /api/package/employee/forgot-password
router.post("/employee/forgot-password", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email: emailOrId } = req.body;
    if (!emailOrId) {
      return res.status(400).json({ error: "Email or Employee ID is required." });
    }

    const employee = await Employee.findOne({
      $or: [
        { email: emailOrId },
        { employeeId: emailOrId }
      ]
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee account not found." });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    employee.resetOtp = otp;
    employee.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    await employee.save();

    await sendOtpEmailNotification(employee.email, otp);

    res.json({
      success: true,
      message: "Password reset verification code has been dispatched."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/employee/reset-password
router.post("/employee/reset-password", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email: emailOrId, otp, newPassword } = req.body;
    if (!emailOrId || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields (Email/ID, OTP, and new password) are required." });
    }

    const employee = await Employee.findOne({
      $or: [
        { email: emailOrId },
        { employeeId: emailOrId }
      ]
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee account not found." });
    }

    if (!employee.resetOtp || employee.resetOtp !== otp || !employee.resetOtpExpires || employee.resetOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    employee.password = await hashPassword(newPassword);
    employee.resetOtp = undefined;
    employee.resetOtpExpires = undefined;
    await employee.save();

    res.json({
      success: true,
      message: "Password has been successfully updated! You can log in now."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/dashboard
router.get("/dashboard", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const leads = await CustomerLead.find().sort({ createdAt: -1 });
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

    const employeeStrength = await Employee.countDocuments();
    const totalIndustries = (await ServicePackage.distinct("industry")).length;
    const totalPackages = (await ServicePackage.countDocuments()) * 3;

    res.json({
      stats: {
        totalLeads,
        convertedLeads,
        monthlyRevenue: `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`,
        onboardingCount: convertedLeads,
        employeeStrength,
        totalIndustries,
        totalPackages
      },
      leads,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- DYNAMIC CRM CRUD ENDPOINTS (ADMIN/MANAGER RESTRICTED) ---

// PUT /api/package/lead/:id
router.put("/lead/:id", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const lead = await CustomerLead.findByIdAndUpdate(id, updateData, { new: true });
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ success: true, lead });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/package/lead/:id
router.delete("/lead/:id", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const lead = await CustomerLead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/category
router.post("/category", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const category = await IndustryCategory.create(data);
    res.json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/package/category/:id
router.put("/category/:id", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await IndustryCategory.findByIdAndUpdate(id, data, { new: true });
    res.json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/package/category/:id
router.delete("/category/:id", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await IndustryCategory.findByIdAndDelete(id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/service-package
router.post("/service-package", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const servicePkg = await ServicePackage.create(data);
    res.json({ success: true, servicePkg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/package/service-package/:id
router.put("/service-package/:id", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const servicePkg = await ServicePackage.findByIdAndUpdate(id, data, { new: true });
    res.json({ success: true, servicePkg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/package/service-package/:id
router.delete("/service-package/:id", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ServicePackage.findByIdAndDelete(id);
    res.json({ success: true, message: "Service package deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/package/locations
router.get("/locations", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const locations = await DistrictIndustry.find().sort({ state: 1, district: 1 });
    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/location
router.post("/location", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const location = await DistrictIndustry.create(data);
    res.json({ success: true, location });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/package/location/:id
router.put("/location/:id", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const location = await DistrictIndustry.findByIdAndUpdate(id, data, { new: true });
    res.json({ success: true, location });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/package/location/:id
router.delete("/location/:id", authenticateEmployee, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DistrictIndustry.findByIdAndDelete(id);
    res.json({ success: true, message: "Location mapping deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- EMPLOYEE CRUD ENDPOINTS (ADMIN/MANAGER RESTRICTED) ---

// GET /api/package/employees
router.get("/employees", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const employees = await Employee.find({}, "-password").sort({ fullName: 1 });
    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/package/employees
router.post("/employees", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const requester = (req as any).employee;
    if (requester.role !== "admin" && requester.role !== "manager") {
      return res.status(403).json({ error: "Access denied. Admin or Manager role required." });
    }

    const { fullName, employeeId, email, password, role, phone, isActive } = req.body;
    if (!fullName || !employeeId || !email || !password) {
      return res.status(400).json({ error: "Full Name, Employee ID, Email, and Password are required." });
    }

    const existing = await Employee.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) {
      return res.status(400).json({ error: "Employee with this Email or Employee ID already exists." });
    }

    const hashedPassword = await hashPassword(password);
    const employee = await Employee.create({
      fullName,
      employeeId,
      email,
      password: hashedPassword,
      role: role || "employee",
      phone,
      isActive: isActive !== undefined ? isActive : true,
      joiningDate: new Date()
    });

    const result = employee.toObject();
    delete result.password;
    res.status(201).json({ success: true, employee: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/package/employees/:id
router.put("/employees/:id", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const requester = (req as any).employee;
    const { id } = req.params;

    // A user can edit their own profile, but only Admin/Manager can change roles, status, etc.
    const isSelf = requester.id === id;
    const isPrivileged = requester.role === "admin" || requester.role === "manager";

    if (!isSelf && !isPrivileged) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const { fullName, email, phone, role, isActive, password } = req.body;

    if (fullName) employee.fullName = fullName;
    if (email) employee.email = email;
    if (phone !== undefined) employee.phone = phone;

    // Privileged fields
    if (isPrivileged) {
      if (role) employee.role = role;
      if (isActive !== undefined) employee.isActive = isActive;
    }

    // Optional password reset
    if (password) {
      employee.password = await hashPassword(password);
    }

    await employee.save();

    const result = employee.toObject();
    delete result.password;
    res.json({ success: true, employee: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/package/employees/:id
router.delete("/employees/:id", authenticateEmployee, async (req: Request, res: Response): Promise<any> => {
  try {
    const requester = (req as any).employee;
    if (requester.role !== "admin" && requester.role !== "manager") {
      return res.status(403).json({ error: "Access denied. Admin or Manager role required." });
    }

    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.json({ success: true, message: "Employee deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
