import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { InsertScheme } from "@shared/schema";

// --- SEED DATA ---
const SEED_SCHEMES: InsertScheme[] = [
  // Existing Central Schemes
  {
    name: "PM Kisan Samman Nidhi",
    source: "Central",
    category: "Agriculture & Farmers",
    description: "Income support of ₹6,000 per year to all landholding farmer families.",
    beneficiaries: "All landholding farmers families",
    eligibility: "Landholding farmers families with cultivable land.",
    benefits: "₹6,000 per year in 3 equal installments.",
    documents: "Aadhaar Card, Land Ownership Papers, Bank Account Details",
    applicationProcess: "Register online at pmkisan.gov.in or via CSCs.",
    officialLink: "https://pmkisan.gov.in",
    state: "Pan India",
    keywords: ["kisan", "farmer", "income", "6000"]
  },
  {
    name: "PM Fasal Bima Yojana",
    source: "Central",
    category: "Agriculture & Farmers",
    description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
    beneficiaries: "Farmers growing notified crops",
    eligibility: "Farmers with insurable interest in the crop.",
    benefits: "Insurance coverage against crop loss due to non-preventable natural risks.",
    documents: "Land Possession Certificate, Aadhaar, Bank Details, Sowing Certificate",
    applicationProcess: "Apply through banks, CSCs, or PMFBY Portal.",
    officialLink: "https://pmfby.gov.in",
    state: "Pan India",
    keywords: ["insurance", "crop", "loss", "farmer"]
  },
  // NEW Central Schemes
  {
    name: "PM Krishi Sinchayee Yojana (PMKSY)",
    source: "Central",
    category: "Agriculture & Farmers",
    description: "Focuses on providing irrigation to every farm (Har Khet Ko Pani).",
    beneficiaries: "All farmers",
    eligibility: "Farmers with cultivable land.",
    benefits: "Financial assistance for irrigation systems.",
    documents: "Aadhaar, Land Records, Bank Account",
    applicationProcess: "Apply through State Agriculture Department.",
    officialLink: "https://pmksy.gov.in",
    state: "Pan India",
    keywords: ["irrigation", "water", "farm", "sinchayee"]
  },
  {
    name: "PM SHRI Schools Scheme",
    source: "Central",
    category: "Education & Students",
    description: "Upgrading existing schools into PM SHRI Schools to showcase NEP 2020.",
    beneficiaries: "School Students",
    eligibility: "Students in selected schools.",
    benefits: "Modernized school infrastructure and pedagogy.",
    documents: "Student Enrollment Details",
    applicationProcess: "Direct benefit through school selection.",
    officialLink: "https://pmshrischools.education.gov.in",
    state: "Pan India",
    keywords: ["school", "education", "nep", "student"]
  },
  // Karnataka State Schemes
  {
    name: "Raitha Vidyanidhi Scholarship",
    source: "Karnataka",
    category: "Education & Students",
    description: "Scholarship for children of farmers to pursue higher education.",
    beneficiaries: "Children of farmers in Karnataka",
    eligibility: "Child of a farmer, enrolled in a higher education course.",
    benefits: "Annual scholarship amount based on the course.",
    documents: "FRUITS ID (Farmer ID), Academic Records, Aadhaar",
    applicationProcess: "Apply through State Scholarship Portal (SSP).",
    officialLink: "https://ssp.postmatric.karnataka.gov.in",
    state: "Karnataka",
    keywords: ["scholarship", "farmer", "education", "student", "karnataka"]
  },
  {
    name: "Gruha Jyothi Scheme",
    source: "Karnataka",
    category: "Housing & Urban",
    description: "Provides free electricity up to 200 units for domestic consumers in Karnataka.",
    beneficiaries: "Domestic electricity consumers in Karnataka",
    eligibility: "Resident of Karnataka, one meter per household.",
    benefits: "Zero electricity bill for usage up to 200 units.",
    documents: "Aadhaar, Electricity Account ID (RR Number)",
    applicationProcess: "Apply via Seva Sindhu portal.",
    officialLink: "https://sevasindhu.karnataka.gov.in",
    state: "Karnataka",
    keywords: ["electricity", "free", "power", "karnataka", "house"]
  },
  {
    name: "Basava Vasathi Yojana",
    source: "Karnataka",
    category: "Housing & Urban",
    description: "Provides affordable housing for the homeless and EWS families in Karnataka.",
    beneficiaries: "EWS Families, Homeless",
    eligibility: "Annual income below ₹32,000, resident of Karnataka.",
    benefits: "Financial assistance for house construction.",
    documents: "Aadhaar, Income Certificate, Caste Certificate",
    applicationProcess: "Apply through Rajiv Gandhi Housing Corporation Limited (RGHCL).",
    officialLink: "https://ashraya.karnataka.gov.in",
    state: "Karnataka",
    keywords: ["house", "housing", "poor", "karnataka", "basava"]
  }
];

// --- INTENT LOGIC ---
function detectIntent(message: string): { intent: string, category?: string, source?: string, state?: string, keywords: string[] } {
  const msg = message.toLowerCase();
  
  if (msg.match(/\b(hi|hello|hey|greetings|namaste)\b/)) {
    return { intent: "greeting", keywords: [] };
  }

  const result: any = { intent: "unknown", keywords: [] };

  // Check for State/Source keywords
  if (msg.includes("karnataka") || msg.includes("state") || msg.includes("ka")) {
    result.state = "Karnataka";
    result.intent = "scheme_query";
  }
  if (msg.includes("central") || msg.includes("india") || msg.includes("center")) {
    result.source = "Central";
    result.intent = "scheme_query";
  }

  // Keywords Mapping
  const mappings = [
    { keys: ["farmer", "kisan", "agriculture", "crop", "soil", "harvest", "sinchayee", "irrigation"], category: "Agriculture & Farmers" },
    { keys: ["student", "scholarship", "education", "college", "school", "university", "study", "vidyanidhi"], category: "Education & Students" },
    { keys: ["woman", "women", "girl", "female", "lady", "maternity", "widow", "sister", "mother", "shakti"], category: "Women & Child Welfare" },
    { keys: ["job", "work", "employment", "skill", "career", "salary", "wage", "startup", "business", "vishwakarma"], category: "Employment & Skill Development" },
    { keys: ["health", "hospital", "medical", "doctor", "treatment", "medicine", "insurance", "ayushman", "mental"], category: "Health & Insurance" },
    { keys: ["house", "housing", "home", "flat", "urban", "rural", "construction", "basava", "awas"], category: "Housing & Urban" },
    { keys: ["senior", "pension", "old", "elder", "retired", "retirement", "atal"], category: "Senior Citizens & Pension" }
  ];

  for (const map of mappings) {
    if (map.keys.some(k => msg.includes(k))) {
      result.category = map.category;
      result.intent = "scheme_query";
      result.keywords = map.keys;
      break;
    }
  }

  return result;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await storage.seedSchemes(SEED_SCHEMES);

  app.get(api.schemes.list.path, async (req, res) => {
    try {
      const input = api.schemes.list.input?.parse(req.query) || {};
      const schemes = await storage.getAllSchemes(input.category, input.state, input.search, input.source);
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
      const { intent, category, state, source } = detectIntent(message);

      let responseText = "";
      let schemesResult = undefined;
      let suggestedQuestions = [];

      if (intent === "greeting") {
        responseText = "Namaste! I am Bharat Scheme Bot. I can help you find Central and Karnataka State government schemes. How can I assist you today?";
        suggestedQuestions = ["Karnataka student schemes", "Central farmer schemes", "Women welfare schemes"];
      } else if (intent === "scheme_query") {
        schemesResult = await storage.getAllSchemes(category, state, undefined, source);
        const count = schemesResult.length;
        
        let desc = category || "government";
        if (state) desc = `${state} ${desc}`;
        if (source) desc = `${source} ${desc}`;

        if (count > 0) {
          responseText = `I found ${count} ${desc} schemes. Here are the top results:`;
          if (count > 3) {
            suggestedQuestions = ["Show all matched schemes"];
          }
        } else {
          responseText = `I couldn't find any specific ${desc} schemes. Try asking about a different category or state.`;
        }
      } else {
        responseText = "I'm not sure which schemes you are looking for. You can ask me about Central or Karnataka schemes for Farmers, Students, Women, etc.";
        suggestedQuestions = ["Karnataka schemes", "PM Kisan scheme", "Scholarships"];
      }

      await storage.logChat({
        userMessage: message,
        botResponse: responseText,
        intent: intent,
        language: language
      });

      res.json({
        response: responseText,
        intent: intent,
        schemes: schemesResult?.slice(0, 3), // Show top 3 in chat
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
