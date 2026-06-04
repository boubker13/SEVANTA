import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY not found or is placeholder. Server running with fallback mode.");
}

// Ensure database falls back if API key is missing
function checkGemini(res: express.Response): boolean {
  if (!ai) {
    res.status(500).json({
      error: "Gemini API client is not configured on the server. Please check your secrets configurations in Settings > Secrets.",
      isDemo: true
    });
    return false;
  }
  return true;
}

// 1. Vessel & Gear Appraisal/Valuation Endpoint
app.post("/api/gemini/appraise", async (req, res) => {
  if (!checkGemini(res)) return;

  const { title, category, year, condition, specifications, initialPrice, description } = req.body;

const prompt = `You are a professional maritime surveyor, appraiser and broker representing "Sevanta", the leading Algerian coastal marine brokerage platform.
Evaluate the following item listed for maritime trade.

Item Details:
- Title: ${title || "N/A"}
- Category: ${category || "N/A"}
- Manufactured Year: ${year || "N/A"}
- Physical Condition: ${condition || "N/A"}
- Core Specifications: ${specifications || "N/A"}
- User's Intended Price: ${initialPrice || "N/A"}
- Brief Description: ${description || "N/A"}

Please provide a highly detailed maritime evaluation report. Respond in Arabic. Output fair market valuations specifically calibrated for Algerian port transactions (in Algerian Dinars, e.g. millions of DZD / د.ج). Output ONLY a valid JSON object matching the following structure:
{
  "estimatedValueMin": number (minimum fair value in Algerian Dinars DZD / د.ج),
  "estimatedValueMax": number (maximum fair value in Algerian Dinars DZD / د.ج),
  "confidenceScore": number (0 to 100 representing certainty of appraisal),
  "reviewNotes": "highly descriptive analysis in Arabic focusing on structural factors, maintenance, age, and Algerian marine demand specifically matching local ports like Bouharoun, Oran, Algiers, Bejaia or Annaba",
  "pros": ["bullet points in Arabic highlighting key strengths relevant to Algerian fishing or leisure activities"],
  "cons": ["bullet points in Arabic highlighting key limitations, rust vulnerabilities in Mediterranean saltwater, or inspection checkpoints"],
  "marketDemandRating": "High" | "Medium" | "Low",
  "brokerRecommendation": "expert recommendation in Arabic regarding sale strategy in Algeria, negotiation wiggle room, and prep advice"
}`;

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    res.json(JSON.parse(cleanedText));
  } catch (error: any) {
    console.error("Appraisal error:", error);
    res.status(500).json({ error: error.message || "Failed to make valuation." });
  }
});

// 2. Automated Smart Bid/Offer Negotiation Mediator
app.post("/api/gemini/negotiate", async (req, res) => {
  if (!checkGemini(res)) return;

  const { itemTitle, itemPrice, buyerOffer, lastMessage, history } = req.body;

  const historyPrompt = history && history.length > 0 
    ? history.map((h: any) => `${h.sender === "buyer" ? "المشتري" : "البائع"}: ${h.text}`).join("\n")
    : "";

  const prompt = `You are the lead mediator and marine broker of the "Sevanta" platform. Your task is to mediate the negotiation between a prospective buyer and a marine asset seller in Algeria to close a deal on:
- Asset Name: "${itemTitle}"
- Listed Price: ${itemPrice} (in Algerian Dinars DZD / د.ج)
- Last Buyer Offer: ${buyerOffer} (in Algerian Dinars DZD / د.ج)
- Last message received: "${lastMessage || "None"}"

Chat History:
${historyPrompt}

You represent the objective, trusted mediator in Algerian ports. Formulate an elegant, professional, and culturally appropriate response in Arabic. You aim to offer balanced compromises (e.g. suggesting middle-ground pricing in DZD / د.ج, split transportation/licensing fees, or requiring specific Algerian vessel surveys).
Provide the response as JSON with this structure:
{
  "suggestionPrice": number (suggested fair middle-ground price in Algerian Dinars DZD / د.ج),
  "proposalDescription": "expert narrative in Arabic explaining this proposal and the benefits to both sides using Algerian port contexts (e.g. Algiers, Tipaza, Oran)",
  "buyerDraftMessage": "direct polite message draft in Arabic for the buyer/broker to send next using Algerian fraternal polite forms",
  "sellerDraftMessage": "direct polite message draft in Arabic for the seller/broker to send next using Algerian fraternal polite forms",
  "surveyRequirement": "suggested mandatory technical check in Arabic (e.g., Hull thickness, engine compression check in Algerian maintenance shipyards) before finalizing"
}
Ensure it is valid parseable JSON. Do not write markdown tags.`;

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    res.json(JSON.parse(cleanedText));
  } catch (error: any) {
    console.error("Negotiation error:", error);
    res.status(500).json({ error: error.message || "Failed to conduct negotiation" });
  }
});

// 3. Marine Brokerage Contract Drafting Endpoint
app.post("/api/gemini/contract", async (req, res) => {
  if (!checkGemini(res)) return;

  const { sellerName, buyerName, sellerId, buyerId, itemTitle, itemCategory, itemPrice, itemSpecs, deliveryPort, contractType } = req.body;

  const prompt = `You are a maritime legal expert. Write a comprehensive, legally robust Marine ${contractType === "rent" ? "Charter/Rental" : "Sales/Purchase"} Agreement under Sevanta Brokerage Mediation guidelines.

Agreement Parameters:
- Seller (First Party): ${sellerName} (ID/Reg: ${sellerId || "غير محدد"})
- Buyer (Second Party): ${buyerName} (ID/Reg: ${buyerId || "غير محدد"})
- Mediation Platform (Third Party): Sevanta Marine Brokerage Platform (منصة سيفانتا للسمسرة البحرية)
- Vessel/Gear (Subject): ${itemTitle} (${itemCategory})
- Agreed Amount: ${itemPrice}
- Specifications: ${itemSpecs}
- Port of Delivery/Inspection: ${deliveryPort || "أي ميناء متاح برضا الطرفين"}

Draft this complete agreement. It MUST be written in formal, authentic Arabic legal phrasing, with English subtitle translations where customary (optional, but keep it highly professional). It should include clauses detailing:
1. Preamble (تمهيد)
2. Subject of Contract & Technical Specs (محل العقد والمواصفات الفنية)
3. Price, Installments & Sevanta 1.5% Escrow/Mediation Fee (الثمن وآلية البيع وعمولة وساطة سيفانتا المضمونة)
4. Survey, Inspection & Port of Delivery (المعاينة، الفحص الفني وميناء التسليم)
5. Legal Warranties, Mortgage clearance (الخلو من الرهون والالتزامات القانونية)
6. Dispute Resolution through Maritime Conciliation (فض النزاعات والتحكيم البحري)
7. Signatures of Parties & Broker Stamp (التوقيعات والختم المعتمد لسيفانتا)

Return the output ONLY as a JSON object:
{
  "contractTitle": "The grand title in Arabic",
  "preamble": "Detailed opening preamble in Arabic",
  "clauses": [
    { "title": "Article Title (بند)", "content": "Paragraph content in Arabic" }
  ],
  "jurisdiction": "Governing maritime law system summarized in 1 sentence",
  "escrowNote": "Details about the Sevanta escrow & buyer security stamp",
  "htmlDraft": "An elegant HTML representation of the contract formatted inside a .contract-page container, ready to print (using standard basic web styles, tables for parties specs, signatures grid at the bottom, Sevanta logo placeholder)"
}`;

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    res.json(JSON.parse(cleanedText));
  } catch (error: any) {
    console.error("Contract drafting error:", error);
    res.status(500).json({ error: error.message || "Failed to draft contract." });
  }
});

// 4. Free form Maritime Technical Assist / Advisor Chat
app.post("/api/gemini/advisor", async (req, res) => {
  if (!checkGemini(res)) return;

  const { message, contextItem } = req.body;

  let contextString = "";
  if (contextItem) {
    contextString = `The user is inquiring specifically about or looking for compatibility with this item:
Title: "${contextItem.title}"
Category: "${contextItem.category}"
Year/Specs: ${contextItem.year} - ${contextItem.specifications || "N/A"}`;
  }

  const prompt = `You are the Sevanta AI Maritime Advisor, an expert in marine engineering, ship inspection, fishing regulations with Mediterranean & Gulf coast guidelines, marine motor mechanics (Yanmar, Yamaha, Suzuki, Volvo Penta), and ship safety.

User Message: "${message}"
${contextString}

Provide a helpful, precise, authoritative yet friendly maritime advice in Arabic (with technical terms optionally in English like "outboard motor", "stern drive"). Do not use corporate fluff. Talk directly like a master mariner or veteran port broker.
Return the output ONLY as a JSON object:
{
  "response": "Detailed explanation and guidance in Arabic with clear bullet points.",
  "quickTips": ["Quick actionable checklist tips for this specific maritime issue"],
  "recommendedChecks": "Specific things to inspect (e.g., oil color, hull cathodic protection, hydraulic steering) to prevent failures"
}`;

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    res.json(JSON.parse(cleanedText));
  } catch (error: any) {
    console.error("Advisor chat error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with Advisor." });
  }
});


// Mounting Vite in Dev and Serving Static Files in Production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving build items from dist/ index.html in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sevanta Full-Stack platform is steaming at http://localhost:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Failed to boot Sevanta server:", err);
});
