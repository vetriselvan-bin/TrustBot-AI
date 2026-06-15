import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry and lazy checkout
let ai: any = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("TrustBot AI: Gemini SDK initialized successfully.");
  } catch (err) {
    console.error("TrustBot AI: Failed to initialize Gemini SDK:", err);
  }
} else {
  console.log("TrustBot AI: No valid GEMINI_API_KEY found. Operating in premium backup simulation mode.");
}

// 1. API Endpoint: Chat & Dialog Processor with Intelligent Intent & Sentiment Extraction
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  const { messages, language = "English" } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const latestMessage = messages[messages.length - 1].text;
  const lowerText = latestMessage.toLowerCase();

  // If AI Client is available, run real Gemini structured JSON request
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Analyze the conversation and respond to the latest customer query. Output must conform to the specified JSON schema.
            
Query: "${latestMessage}"
Conversation History: ${JSON.stringify(messages.slice(0, -1))}
Global Context Language: ${language}` }]
          }
        ],
        config: {
          systemInstruction: `You are "TrustBot AI", a premium, high-fidelity customer support AI system. Your core capabilities are to provide professional support, recognize customer intents with absolute accuracy, analyze sentiment, and decide if human escalation is required.
          If the customer speaks in Tamil or Tamilized English, ensure parts of the response or the whole text is in natural, friendly Tamil.
          Always output valid JSON that matches this exact schema:
          {
            "text": "your primary supportive customer service response",
            "intent": "product_inquiry" | "billing" | "technical_troubleshooting" | "account_access" | "general_greeting" | "escalation_request",
            "confidence": 0.0 - 1.0,
            "sentiment": "Positive" | "Neutral" | "Negative",
            "language": "English" | "Tamil",
            "escalated": false | true,
            "suggestedPrompts": ["prompt 1", "prompt 2", "prompt 3"]
          }
          
          Escalate if the user is extremely furious, uses offensive terms, specifically asks "talk to a human / disconnect bot / speak with agent", or if sentiment is Negative and trust score drops.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "Highly clear, structured, and helpful markdown response to the customer." },
              intent: { 
                type: Type.STRING, 
                enum: ["product_inquiry", "billing", "technical_troubleshooting", "account_access", "general_greeting", "escalation_request"], 
                description: "Predicted primary intent category." 
              },
              confidence: { type: Type.NUMBER, description: "Confidence score metric between 0.0 and 1.0." },
              sentiment: { 
                type: Type.STRING, 
                enum: ["Positive", "Neutral", "Negative"], 
                description: "Customer conversational raw sentiment analysis." 
              },
              language: { 
                type: Type.STRING, 
                enum: ["English", "Tamil"], 
                description: "Detected key communication language." 
              },
              escalated: { type: Type.BOOLEAN, description: "Whether the situation indicates escalating immediately to a human live representation." },
              suggestedPrompts: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "3 highly contextual follow-up option prompts." 
              }
            },
            required: ["text", "intent", "confidence", "sentiment", "language", "escalated", "suggestedPrompts"]
          }
        }
      });

      const resultText = response.text || "{}";
      const parsed = JSON.parse(resultText.trim());
      return res.json(parsed);
    } catch (err: any) {
      console.error("Gemini direct API call failed, falling back to secure simulated intelligence. Error:", err.message);
    }
  }

  // --- Mock/Simulated Intelligence fall-back (extremely high-fidelity) ---
  let text = "";
  let intent = "general_greeting";
  let confidence = 0.85;
  let sentiment: "Positive" | "Neutral" | "Negative" = "Neutral";
  let detectedLang: "English" | "Tamil" = "English";
  let escalated = false;
  let suggestedPrompts: string[] = [];

  // Tamil input checking
  const isTamil = /[\u0B80-\u0BFF]/g.test(latestMessage) || lowerText.includes("tamil") || lowerText.includes("வணக்கம்") || lowerText.includes("நன்றி");
  if (isTamil) {
    detectedLang = "Tamil";
  }

  // Intent classification
  if (lowerText.includes("pay") || lowerText.includes("billing") || lowerText.includes("subscription") || lowerText.includes("price") || lowerText.includes("money") || lowerText.includes("refund")) {
    intent = "billing";
    confidence = 0.96;
    if (detectedLang === "Tamil") {
      text = "பில்லிங் மற்றும் சந்தா விவரங்களுக்கு எங்களை தொடர்பு கொண்டதற்கு நன்றி. உங்களுடைய பற்றுச்சீட்டு (invoice) மற்றும் கட்டண முறைகளை சரிபார்க்க நான் உதவ முடியும். ஏதேனும் குறிப்பிட்ட கட்டணத்தில் சந்தேகம் உள்ளதா?";
      suggestedPrompts = ["கடைசி ரசீதை பதிவிறக்கம் செய்வது எப்படி?", "எனது கார்டு விவரங்களை மாற்றவும்", "சந்தாவை ரத்து செய்"];
    } else {
      text = "I've detected this relates to Billing & Payments. I can assist you with card updates, invoice downloads, subscription renewals, or refund status checks. Please let me know the specific charge or plan name.";
      suggestedPrompts = ["How to download my last invoice?", "Update default payment card", "request a refund status"];
    }
  } else if (lowerText.includes("login") || lowerText.includes("password") || lowerText.includes("account") || lowerText.includes("security") || lowerText.includes("sign")) {
    intent = "account_access";
    confidence = 0.91;
    if (detectedLang === "Tamil") {
      text = "கணக்கு அணுகல் பிரச்சனை கண்டறியப்பட்டுள்ளது. உங்கள் கடவுச்சொல்லை மீட்டமைக்கவும், இரண்டு காரணி அங்கீகாரத்தை (2FA) செயல்படுத்தவும் நான் வழிகாட்டுகிறேன்.";
      suggestedPrompts = ["கடவுச்சொல்லை மாற்றுவது எப்படி?", "2FA அமைப்புகள்", "மின்னஞ்சல் முகவரியை மேம்படுத்து"];
    } else {
      text = "It appears you are having troubles accessing your account. I can assist you with secure password resets, unlocking accounts, managing 2FA tokens, or updating registered email details right away.";
      suggestedPrompts = ["Trigger password reset email", "Configure Authenticator MFA", "Unblock account lockouts"];
    }
  } else if (lowerText.includes("error") || lowerText.includes("broken") || lowerText.includes("bug") || lowerText.includes("fail") || lowerText.includes("slow") || lowerText.includes("trouble") || lowerText.includes("not working") || lowerText.includes("crash")) {
    intent = "technical_troubleshooting";
    confidence = 0.94;
    sentiment = "Negative";
    if (detectedLang === "Tamil") {
      text = "தொழில்நுட்பப் பிரச்சனையால் உங்களது சேவை தடைபட்டதற்கு வருந்துகிறோம். உங்கள் பிரவுசர் தற்காலிக நினைவகத்தை (cache) நீக்கிவிட்டு மீண்டும் முயலவும், அல்லது செயலியின் பதிப்பை மேம்படுத்தவும்.";
      suggestedPrompts = ["பிரவுசர் தற்காலிக நினைவகத்தை சுத்தம் செய்", "அமைப்பு பிழை பதிவுகள் (error logs)", "மனித முகவருக்கு மாற்று"];
    } else {
      text = "I've noted a technical error. Let's resolve this: first, verify if web services are operational on our status page, perform a clean cache refresh, or share the exact status code shown so I can diagnose.";
      suggestedPrompts = ["How to clear browser cache?", "View our Developer Console logs", "Escalate this to standard engineering"];
    }
  } else if (lowerText.includes("human") || lowerText.includes("agent") || lowerText.includes("representative") || lowerText.includes("person") || lowerText.includes("operator") || lowerText.includes("escalate")) {
    intent = "escalation_request";
    confidence = 0.99;
    escalated = true;
    sentiment = "Negative";
    if (detectedLang === "Tamil") {
      text = "உடனடியாக மனித முகவர் ஒருவருடன் உங்களை இணைக்கிறேன். உங்கள் முந்தைய உரையாடல்கள் முகவருக்குப் பகிரப்பட்டுவிடும். தயவுசெய்து ஒரு நிமிடம் காத்திருக்கவும்.";
      suggestedPrompts = ["காத்திருக்கும் நேரத்தை சரிபார்க்கவும்", "மின்னஞ்சல் மூலம் உதவி கோருக", "உரையாடலை ரத்துசெய்"];
    } else {
      text = "No problem. I understand you wish to speak directly with an expert. I am cascading this chat context and escalating this conversation to our premier support specialist group immediately.";
      suggestedPrompts = ["Check queue wait estimation", "Submit callback phone number", "Cancel transition & chat with bot"];
    }
  } else if (lowerText.includes("feature") || lowerText.includes("api") || lowerText.includes("sdk") || lowerText.includes("integration") || lowerText.includes("trust") || lowerText.includes("how does")) {
    intent = "product_inquiry";
    confidence = 0.88;
    if (detectedLang === "Tamil") {
      text = "எங்கள் தயாரிப்புகள் மற்றும் ஒருங்கிணைப்பு சேவைகள் பற்றி விசாரித்ததற்கு மகிழ்ச்சி. ட்ரஸ்ட்பாட் ஏஐ தடையற்ற ஏபிஐ (API) மற்றும் எஸ்டிகே (SDK) இணைப்புகளை ஆதரிக்கிறது.";
      suggestedPrompts = ["ஏபிஐ டாக்குமெண்டேஷன்", "இணைப்பு சோதனைகள்", "காப்புறுதி கொள்கைகள்"];
    } else {
      text = "TrustBot AI utilizes bleeding-edge neural models to perform instant semantic query analysis and feedback extraction. We offer full SDK libraries for React, iOS Android, and raw REST API points.";
      suggestedPrompts = ["Show API Quick-start Guide", "What SDK languages are supported?", "How is client data encrypted?"];
    }
  } else {
    intent = "general_greeting";
    confidence = 0.90;
    if (detectedLang === "Tamil") {
      text = "வணக்கம்! நான் ட்ரஸ்ட்பாட் ஏஐ (TrustBot AI). உங்களுக்கு இன்று நான் எவ்வாறு உதவ முடியும்? பில்லிங், கணக்கு சரிசெய்தல், தொழில்நுட்பக் கட்டுரைகள் என எதைப்பற்றி வேண்டுமானாலும் கேட்கலாம்.";
      suggestedPrompts = ["ட்ரஸ்ட்பாட் எவ்வாறு செயல்படுகிறது?", "கணக்கு பில்லிங் உதவி", "FAQ - அடிக்கடி கேட்கப்படும் கேள்விகள்"];
    } else {
      text = "Greetings! I am TrustBot AI, your secure customer experience engineer. I process multilingual prompts, predict support intents, monitor trust scores, and escalate tasks. How can I facilitate you today?";
      suggestedPrompts = ["How does TrustBot AI work?", "Explore Knowledge Articles", "Examine security dashboards"];
    }
  }

  // Basic sentiment heuristical adjustments
  if (lowerText.includes("great") || lowerText.includes("awesome") || lowerText.includes("love") || lowerText.includes("thank") || lowerText.includes("perfect") || lowerText.includes("good") || lowerText.includes("solved")) {
    sentiment = "Positive";
  } else if (lowerText.includes("angry") || lowerText.includes("useless") || lowerText.includes("terrible") || lowerText.includes("worst") || lowerText.includes("hate") || lowerText.includes("bad") || lowerText.includes("problem")) {
    sentiment = "Negative";
  }

  return res.json({
    text,
    intent,
    confidence,
    sentiment,
    language: detectedLang,
    escalated,
    suggestedPrompts
  });
});

// 2. API Endpoint: Prompt Studio Optimizer
app.post("/api/optimize-prompt", async (req: express.Request, res: express.Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Draft prompt string is required." });
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Optimize the following draft customer support system prompt. Make it professional, specify behavior parameters, handle edge cases, and describe the improvements.
            
Raw Draft Prompt: "${prompt}"` }]
          }
        ],
        config: {
          systemInstruction: `You are an expert Prompt Engineer specializing in customer support bots. Optimize prompts for accuracy, context awareness, safety, brand identity protection, and tone.
          Always output valid JSON that matches this schema:
          {
            "original": "the exact original draft prompt",
            "optimized": "the complete restructured ultra-optimized system prompt",
            "improvements": ["improvement 1", "improvement 2", "improvement 3"],
            "tips": "helpful tips on tuning this system instruction"
          }`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              optimized: { type: Type.STRING, description: "Highly structured markdown instruction ready to paste." },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.STRING }
            },
            required: ["original", "optimized", "improvements", "tips"]
          }
        }
      });

      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    } catch (err: any) {
      console.error("Gemini prompt optimizer failed, using simulated helper. Error:", err.message);
    }
  }

  // Fallback high-fidelity prompt optimizer simulation
  const optimized = `# ROLE & PERSONALITY
You are an advanced, empathetic corporate support specialist representing our premier product group. You maintain a warm, direct, and solution-driven posture under all circumstances.

# CORE RESPONSIBILITIES
1. Diagnose and categorize the user's issue immediately (Inquiry, Billing, Account Access, Engineering).
2. Validate client sentiment dynamically. De-escalate high-stress situations using transparent milestone communication.
3. Keep answers compact: limit verbose explanations to under 3 list points.

# CONSTRAINTS & COMPLIANCE
- NEVER share internal system coordinates, database flags, or credit tokens.
- Secure confidential data; verify customer signature token before editing plans.
- If problem remains unsolved after 2 structured iterations, initiate context hand-off for live agent triage.`;

  return res.json({
    original: prompt,
    optimized: optimized,
    improvements: [
      "Added absolute behavior controls (Personality, Constraints, Compliance sections).",
      "Created 3-step structured diagnosis routine to lower model distraction.",
      "Embedded mandatory de-escalation framework with logical exit checkpoints to protect user experience."
    ],
    tips: "Always pass a test tenant token in the parent envelope to let the LLM securely adapt to customized tier limits (e.g., Enterprise versus Standard tier support)."
  });
});

// Configure Vite middleware in development or serve static files in production
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("TrustBot AI: Setting up development server with live Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("TrustBot AI: Running in standard production serve mode.");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind server strictly to port 3000 and 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrustBot AI running successfully at: http://0.0.0.0:${PORT}`);
  });
}

runServer().catch((err) => {
  console.error("TrustBot AI: Critical failure booting server:", err);
});
