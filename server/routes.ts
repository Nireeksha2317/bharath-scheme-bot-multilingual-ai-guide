import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { InsertScheme } from "@shared/schema";

// --- SEED DATA ---
const SEED_SCHEMES: InsertScheme[] = [
  // Agriculture
  {
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture & Farmers",
    description: "Income support of ₹6,000 per year to all landholding farmer families.",
    beneficiaries: "All landholding farmers families",
    eligibility: "Landholding farmers families with cultivable land.",
    benefits: "₹6,000 per year in 3 equal installments.",
    documents: "Aadhaar Card, Land Ownership Papers, Bank Account Details",
    applicationProcess: "Register online at pmkisan.gov.in or via CSCs.",
    officialLink: "https://pmkisan.gov.in",
    state: "Pan India"
  },
  {
    name: "PM Fasal Bima Yojana",
    category: "Agriculture & Farmers",
    description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
    beneficiaries: "Farmers growing notified crops",
    eligibility: "Farmers with insurable interest in the crop.",
    benefits: "Insurance coverage against crop loss due to non-preventable natural risks.",
    documents: "Land Possession Certificate, Aadhaar, Bank Details, Sowing Certificate",
    applicationProcess: "Apply through banks, CSCs, or PMFBY Portal.",
    officialLink: "https://pmfby.gov.in",
    state: "Pan India"
  },
  {
    name: "Kisan Credit Card (KCC)",
    category: "Agriculture & Farmers",
    description: "Provides adequate and timely credit support to farmers from the banking system.",
    beneficiaries: "Farmers, Tenant Farmers, Share Croppers",
    eligibility: "All farmers including tenant farmers.",
    benefits: "Credit for cultivation, post-harvest expenses, etc. Interest subvention available.",
    documents: "Identity Proof, Address Proof, Land Documents",
    applicationProcess: "Contact nearest bank branch.",
    officialLink: "https://pib.gov.in/PressReleasePage.aspx?PRID=1601633",
    state: "Pan India"
  },

  // Education
  {
    name: "National Scholarship Portal",
    category: "Education & Students",
    description: "One-stop solution for various government scholarships.",
    beneficiaries: "Students from pre-matric to post-doc level",
    eligibility: "Varies by specific scholarship scheme.",
    benefits: "Financial assistance for education.",
    documents: "Aadhaar, Bank Account, Academic Records, Income Certificate",
    applicationProcess: "Apply online at scholarships.gov.in",
    officialLink: "https://scholarships.gov.in",
    state: "Pan India"
  },
  {
    name: "AICTE Saksham Scholarship",
    category: "Education & Students",
    description: "Scholarship for differently-abled students pursuing technical education.",
    beneficiaries: "Differently-abled students",
    eligibility: "Disability of not less than 40%, admitted to technical degree/diploma.",
    benefits: "₹50,000 per annum for every year of study.",
    documents: "Disability Certificate, Admission Proof, Income Certificate",
    applicationProcess: "Apply via National Scholarship Portal.",
    officialLink: "https://www.aicte-india.org/schemes/students-development-schemes/Saksham-Scholarship-Scheme",
    state: "Pan India"
  },

  // Women
  {
    name: "Sukanya Samriddhi Yojana",
    category: "Women & Child Welfare",
    description: "Small deposit scheme for the girl child.",
    beneficiaries: "Girl Child",
    eligibility: "Parents/Guardians can open account for girl child below 10 years.",
    benefits: "High interest rate, tax benefits under 80C.",
    documents: "Birth Certificate of girl child, ID/Address proof of guardian.",
    applicationProcess: "Open account in Post Office or designated banks.",
    officialLink: "https://www.nsiindia.gov.in",
    state: "Pan India"
  },
  {
    name: "PM Matru Vandana Yojana",
    category: "Women & Child Welfare",
    description: "Maternity benefit program.",
    beneficiaries: "Pregnant Women and Lactating Mothers",
    eligibility: "Pregnant women for first living child.",
    benefits: "₹5,000 cash incentive in 3 installments.",
    documents: "MCP Card, Aadhaar, Bank Details",
    applicationProcess: "Register at Anganwadi or approved health facility.",
    officialLink: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    state: "Pan India"
  },

  // Employment
  {
    name: "PM Kaushal Vikas Yojana",
    category: "Employment & Skill Development",
    description: "Skill development initiative scheme.",
    beneficiaries: "Unemployed Youth, School/College Dropouts",
    eligibility: "Indian national, valid ID.",
    benefits: "Free skill training and certification.",
    documents: "Aadhaar, Bank Details",
    applicationProcess: "Register at PMKVY training centers.",
    officialLink: "http://pmkvyofficial.org",
    state: "Pan India"
  },
  {
    name: "MGNREGA",
    category: "Employment & Skill Development",
    description: "Guarantees 100 days of wage employment in a financial year to a rural household.",
    beneficiaries: "Rural Households",
    eligibility: "Adult members of rural household willing to do unskilled manual work.",
    benefits: "Guaranteed wage employment.",
    documents: "Job Card application at Gram Panchayat.",
    applicationProcess: "Apply at Gram Panchayat.",
    officialLink: "https://nrega.nic.in",
    state: "Pan India"
  },

  // Health
  {
    name: "Ayushman Bharat (PM-JAY)",
    category: "Health & Insurance",
    description: "Health insurance scheme for poor and vulnerable families.",
    beneficiaries: "Poor and vulnerable families listed in SECC 2011",
    eligibility: "Families identified in SECC 2011 database.",
    benefits: "Cover of ₹5 lakhs per family per year for secondary/tertiary care hospitalization.",
    documents: "Aadhaar, Ration Card",
    applicationProcess: "Check eligibility online or at CSC/Empanelled Hospital.",
    officialLink: "https://pmjay.gov.in",
    state: "Pan India"
  },

  // Housing
  {
    name: "PM Awas Yojana (Urban)",
    category: "Housing & Urban",
    description: "Housing for all in urban areas.",
    beneficiaries: "EWS, LIG, MIG families",
    eligibility: "Family should not own a pucca house.",
    benefits: "Interest subsidy or financial assistance for house construction.",
    documents: "Aadhaar, Income Proof, Land Documents",
    applicationProcess: "Apply online at PMAY-U MIS or via CSCs.",
    officialLink: "https://pmay-urban.gov.in",
    state: "Pan India"
  },

  // Senior Citizens
  {
    name: "Atal Pension Yojana",
    category: "Senior Citizens & Pension",
    description: "Pension scheme for unorganized sector workers.",
    beneficiaries: "Citizens aged 18-40 years",
    eligibility: "Any citizen aged 18-40 having a savings bank account.",
    benefits: "Guaranteed minimum pension of ₹1000-₹5000 per month after age 60.",
    documents: "Aadhaar, Bank Account",
    applicationProcess: "Contact bank branch.",
    officialLink: "https://www.npscra.nsdl.co.in/scheme-details.php",
    state: "Pan India"
  }
];

// --- INTENT LOGIC ---
function detectIntent(message: string): { intent: string, category?: string, keywords: string[] } {
  const msg = message.toLowerCase();
  
  // Greeting
  if (msg.match(/\b(hi|hello|hey|greetings|namaste)\b/)) {
    return { intent: "greeting", keywords: [] };
  }

  // Keywords Mapping
  const mappings = [
    { keys: ["farmer", "kisan", "agriculture", "crop", "soil", "harvest"], category: "Agriculture & Farmers" },
    { keys: ["student", "scholarship", "education", "college", "school", "university", "study"], category: "Education & Students" },
    { keys: ["woman", "women", "girl", "female", "lady", "maternity", "widow", "sister", "mother"], category: "Women & Child Welfare" },
    { keys: ["job", "work", "employment", "skill", "career", "salary", "wage", "startup", "business"], category: "Employment & Skill Development" },
    { keys: ["health", "hospital", "medical", "doctor", "treatment", "medicine", "insurance", "ayushman"], category: "Health & Insurance" },
    { keys: ["house", "housing", "home", "flat", "urban", "rural", "construction"], category: "Housing & Urban" },
    { keys: ["senior", "pension", "old", "elder", "retired", "retirement"], category: "Senior Citizens & Pension" }
  ];

  for (const map of mappings) {
    if (map.keys.some(k => msg.includes(k))) {
      return { intent: "scheme_query", category: map.category, keywords: map.keys };
    }
  }

  return { intent: "unknown", keywords: [] };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed Data
  await storage.seedSchemes(SEED_SCHEMES);

  // --- API Routes ---

  app.get(api.schemes.list.path, async (req, res) => {
    try {
      const input = api.schemes.list.input?.parse(req.query) || {};
      const schemes = await storage.getAllSchemes(input.category, input.state, input.search);
      res.json(schemes);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  app.get(api.schemes.get.path, async (req, res) => {
    const scheme = await storage.getSchemeById(Number(req.params.id));
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  });

  app.post(api.chat.send.path, async (req, res) => {
    try {
      const { message, language } = api.chat.send.input.parse(req.body);
      const { intent, category } = detectIntent(message);

      let responseText = "";
      let schemesResult = undefined;
      let suggestedQuestions = [];

      if (intent === "greeting") {
        responseText = "Namaste! I am Bharat Scheme Bot. I can help you find government schemes for farmers, students, women, and more. How can I assist you today?";
        suggestedQuestions = ["Schemes for farmers", "Scholarships for students", "Health insurance schemes"];
      } else if (intent === "scheme_query" && category) {
        schemesResult = await storage.getAllSchemes(category);
        const count = schemesResult.length;
        responseText = `I found ${count} schemes related to ${category}. Here are the details:`;
        suggestedQuestions = ["Show application process", "Required documents"]; // Simplified suggestions
      } else {
        responseText = "I'm not sure which schemes you are looking for. You can ask me about schemes for Farmers, Students, Women, Health, or Housing.";
        suggestedQuestions = ["Schemes for farmers", "Student scholarships", "Women welfare"];
      }

      // Log chat
      await storage.logChat({
        userMessage: message,
        botResponse: responseText,
        intent: intent,
        language: language
      });

      res.json({
        response: responseText,
        intent: intent,
        schemes: schemesResult,
        suggestedQuestions
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
