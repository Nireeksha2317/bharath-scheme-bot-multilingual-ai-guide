# Read the existing routes.ts to get the structure
$routesContent = Get-Content "server\routes.ts" -Raw

# Find where SEED_SCHEMES ends (look for the closing bracket and semicolon)
$seedStart = $routesContent.IndexOf("const SEED_SCHEMES")
$seedArrayStart = $routesContent.IndexOf("[", $seedStart)

# Read the new schemes
$newSchemes = Get-Content "schemes_ts_output.txt" -Raw

# Find the existing schemes (everything between [ and ];)
$existingPattern = "const SEED_SCHEMES: InsertScheme\[\] = \["
$afterSeedPattern = "\];\s*\/\/ --- HELPER FUNCTIONS"

# Create the new SEED_SCHEMES section
$newSeedSection = @"
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
  // NEW Schemes from expansion
$newSchemes
];
"@

# Replace the SEED_SCHEMES section
$beforeSeed = $routesContent.Substring(0, $seedStart)
$afterSeedIndex = $routesContent.IndexOf("];", $seedArrayStart) + 2
$afterSeed = $routesContent.Substring($afterSeedIndex)

# Combine
$newContent = $beforeSeed + $newSeedSection + $afterSeed

# Write the new file
$newContent | Set-Content "server\routes_new.ts" -NoNewline

Write-Host "Created server\routes_new.ts successfully!"
