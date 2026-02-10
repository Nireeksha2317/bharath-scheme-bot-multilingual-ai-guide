const fs = require('fs');

function detectIntent(message) {
    const msg = message.toLowerCase();

    if (msg.match(/\b(hi|hello|hey|greetings|namaste)\b/)) {
        return { intent: "greeting", keywords: [] };
    }

    const result = { intent: "unknown", keywords: [] };

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
        { keys: ["farmer", "kisan", "agriculture", "crop", "soil", "harvest", "sinchayee", "irrigation", "nmsa", "smam", "nbhm", "pmmsy", "matsya", "bamboo", "nbm", "oil palm", "nmeoop", "rsk", "neeravari", "ksheerdhare", "milk", "dairy", "millet", "ganga kalyana", "borewell"], category: "Agriculture & Farmers" },
        { keys: ["student", "scholarship", "education", "college", "school", "university", "study", "vidyanidhi", "usha", "noss", "overseas", "literacy", "numeracy", "pbbb", "swayam", "prabha", "udaan", "stem", "chennamma", "uniform", "textbook", "bhagya", "morarji", "kreis"], category: "Education & Students" },
        { keys: ["woman", "women", "girl", "female", "lady", "maternity", "widow", "sister", "mother", "shakti", "safety", "sakhi", "181", "nirbhaya", "step", "pm-cares", "orphan", "adoption", "cara", "rmk", "mahila kosh", "udyogini", "stree shakti", "sashaktikaran", "udyoga lakshmi"], category: "Women & Child Welfare" },
        { keys: ["job", "work", "employment", "skill", "career", "salary", "wage", "startup", "business", "vishwakarma", "aspire", "pmegp", "kvic", "zed", "msme", "nssh", "sc-st hub", "clcss", "machinery", "elevate", "yuva nidhi"], category: "Employment & Skill Development" },
        { keys: ["health", "hospital", "medical", "doctor", "treatment", "medicine", "insurance", "ayushman", "mental", "tb", "tuberculosis", "cancer", "diabetes", "cardiovascular", "geriatric", "elderly", "nphce", "leprosy", "nlep", "arogya", "sast", "manasadhara"], category: "Health & Insurance" },
        { keys: ["house", "housing", "home", "flat", "urban", "rural", "construction", "basava", "awas", "ujjwala", "gas", "electricity", "power", "light", "saubhagya", "solar", "kusum", "panels", "tap", "jaladhare", "jalamrutha"], category: "Housing & Urban" },
        { keys: ["senior", "pension", "old", "elder", "retired", "retirement", "atal", "apy", "swavalamban", "pmvvy", "vaya vandana", "sandhya suraksha"], category: "Senior Citizens & Pension" }
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

const testCases = [
    "I am a farmer looking for soil health card",
    "Scholarship for minority students",
    "Ujjwala yojana details",
    "Startup grant in Karnataka",
    "Pension for senior citizens",
    "Treatment for tuberculosis",
    "Free laptop scheme",
    "Loan for women entrepreneurs",
    "Solar pump subsidy",
    "Safe drinking water in rural areas"
];

const output = [];
output.push("Running Intent Detection Tests...\n");

testCases.forEach(msg => {
    const result = detectIntent(msg);
    output.push(`Message: "${msg}"`);
    output.push(`Result: ${JSON.stringify(result)}`);
    output.push("-----------------------------------");
});

fs.writeFileSync('test_output.txt', output.join('\n'));
console.log("Test results written to test_output.txt");
