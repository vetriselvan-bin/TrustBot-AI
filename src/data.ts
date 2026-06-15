import { KBArticle, FeedbackRecord, SystemMetrics, UserAccount, ChatSession } from "./types";

export const INITIAL_ARTICLES: KBArticle[] = [
  {
    id: "1",
    category: "Billing",
    title: "How to update your credit card or payment method",
    content: "To update your credit card: Goto your corporate space account billing section. Choose 'Payment details' then press 'Update Card'. Enter your card parameters and click 'Validate Card Signature' to commit.",
    language: "en",
    views: 142
  },
  {
    id: "1-ta",
    category: "Billing",
    title: "எனது கட்டண முறையை மாற்றுவது எப்படி?",
    content: "கணக்குப் பக்கத்தில் உள்ள 'பில்லிங்' (Billing) பகுதிக்குச் செல்லவும். 'பள்ளிங்கார்டு தகவல்கள்' (Payment details) என்பதைத் தேர்ந்தெடுத்து, உங்கள் புதிய அட்டை விவரங்களைப் பதிவிட்டு சேமிக்கவும்.",
    language: "ta",
    views: 89
  },
  {
    id: "2",
    category: "Account Access",
    title: "Setting up Two-Factor Authentication (2FA)",
    content: "Improve security by activating Multi-factor login. Navigate to Security -> Auth Token -> click Setup 2FA. Scan the QR code using Google Authenticator or Duo, and provide the 6 digit confirmation code.",
    language: "en",
    views: 310
  },
  {
    id: "2-ta",
    category: "Account Access",
    title: "இரு காரணி அங்கீகாரம் (2FA) அமைப்பது எவ்வாறு?",
    content: "உங்கள் கணக்கின் பாதுகாப்பு அமைப்புகளுக்குச் செல்லவும் (Security -> Setup 2FA). மொபைலில் Google Authenticator செயலியைத் திறந்து, திரையில் தோன்றும் QR குறியீட்டை ஸ்கேன் செய்து 6 இலக்கக் குறியீட்டை உள்ளிடவும்.",
    language: "ta",
    views: 112
  },
  {
    id: "3",
    category: "Troubleshooting",
    title: "Resolving 'Expired Session Token' error message",
    content: "If you see a session expired warning, it indicates your local cryptographic security token has been revoked. Perform a hard refresh (Ctrl + F5 or Cmd + Shift + R) and log in again to clear this state.",
    language: "en",
    views: 220
  },
  {
    id: "4",
    category: "Product Features",
    title: "TrustBot AI Developer REST API Integration Guide",
    content: "Integrate customer support inside physical hardware or web workspaces with our JSON API endpoints. Send a POST request to '/api/chat' carrying authentication headers and message body schema.",
    language: "en",
    views: 450
  },
  {
    id: "5",
    category: "Troubleshooting",
    title: "Web Audio playback issues with voice assistant active",
    content: "If you cannot hear speech audio, check if your browser blocked automatic media playback. Click the sound lock icon in the address bar and enable 'Allow Audio Auto-play' permissions.",
    language: "en",
    views: 185
  }
];

export const INITIAL_MOCK_CHATS: ChatSession[] = [
  {
    id: "s-101",
    title: "Failed Invoice #8892 Triage",
    status: "active",
    userEmail: "client.alpha@enterprise.com",
    messages: [
      { id: "m-1", sender: "user", text: "Hello! My transaction for Invoice #8892 didn't go through properly, but my card was still charged.", timestamp: "10:15 AM", intent: "billing", confidence: 0.98, sentiment: "Negative" },
      { id: "m-2", sender: "bot", text: "I've detected this relates to Billing & Payments. Let me help you examine Invoice #8892. I am checking our automated ledger logs to confirm if the processing gateway flagged a matching charge.", timestamp: "10:15 AM", intent: "billing", confidence: 0.98, sentiment: "Neutral" }
    ]
  },
  {
    id: "s-102",
    title: "Tamil Support - கடவுச்சொல் மீட்டமைப்பு",
    status: "resolved",
    userEmail: "vetriselvanv2008@gmail.com",
    messages: [
      { id: "m-3", sender: "user", text: "வணக்கம், எனது கடவுச்சொல்லை மாற்ற வேண்டும்.", timestamp: "Yesterday", intent: "account_access", confidence: 0.95, sentiment: "Neutral", language: "Tamil" },
      { id: "m-4", sender: "bot", text: "வணக்கம்! கணக்கு அணுகல் பிரச்சனை கண்டறியப்பட்டுள்ளது. உங்கள் கடவுச்சொல்லை மீட்டமைப்பதற்கான இணைப்பை உங்கள் பதிவேற்றப்பட்ட மின்னஞ்சலுக்கு அனுப்பியுள்ளேன்.", timestamp: "Yesterday", intent: "account_access", confidence: 0.95, sentiment: "Positive", language: "Tamil" }
    ]
  },
  {
    id: "s-103",
    title: "REST API Header Query",
    status: "resolved",
    userEmail: "developer@infotech.io",
    messages: [
      { id: "m-5", sender: "user", text: "Do you support standard authorization bearings in the payload headers?", timestamp: "2 days ago", intent: "product_inquiry", confidence: 0.91, sentiment: "Positive" },
      { id: "m-6", sender: "bot", text: "Yes! TrustBot AI expects standard Bearer Tokens in the 'Authorization' header parameter for all rest communication routes.", timestamp: "2 days ago", intent: "product_inquiry", confidence: 0.91, sentiment: "Neutral" }
    ]
  },
  {
    id: "s-104",
    title: "Angry Escalation Event",
    status: "escalated",
    userEmail: "furious.purchaser@outlook.com",
    messages: [
      { id: "m-7", sender: "user", text: "This service crashed during my presentation! Put me in touch with a real manager now!", timestamp: "June 12", intent: "escalation_request", confidence: 0.99, sentiment: "Negative", escalated: true },
      { id: "m-8", sender: "bot", text: "I apologize for the presentation disruption. I have paused automated chat operations and redirected this thread to our Priority Technical Escalations Manager.", timestamp: "June 12", intent: "escalation_request", confidence: 0.99, sentiment: "Negative", escalated: true }
    ]
  }
];

export const INITIAL_METRICS: SystemMetrics = {
  trustScore: 94.8,
  responseCount: 1240,
  avgDurationSec: 4.8,
  escalationRate: 3.5,
  avgSentimentScore: 82.5,
  accuracyScore: 97.2,
  intentDistribution: {
    "General Greeting": 120,
    "Billing & Price": 280,
    "Account Access": 180,
    "Technical Bugs": 440,
    "Product Inquiry": 170,
    "Human Escalation": 50
  },
  dailyRequests: [
    { day: "Jun 09", count: 80, resolved: 78 },
    { day: "Jun 10", count: 95, resolved: 91 },
    { day: "Jun 11", count: 110, resolved: 106 },
    { day: "Jun 12", count: 125, resolved: 122 },
    { day: "Jun 13", count: 130, resolved: 128 },
    { day: "Jun 14", count: 145, resolved: 141 },
    { day: "Jun 15", count: 155, resolved: 151 }
  ]
};

export const MOCK_USERS: UserAccount[] = [
  { email: "vetriselvanv2008@gmail.com", name: "Vetri Selvan", companyName: "Vetri Solutions", role: "admin", joinedAt: "2026-01-10" },
  { email: "client.alpha@enterprise.com", name: "Sarah Jenkins", companyName: "Alpha Corp Ltd", role: "customer", joinedAt: "2026-03-22" },
  { email: "developer@infotech.io", name: "Liam O'Connor", companyName: "InfoTech Systems", role: "customer", joinedAt: "2026-04-05" },
  { email: "guest.user@gmail.com", name: "Guest User", companyName: "Sandbox Testing", role: "customer", joinedAt: "2026-05-30" }
];

export const INITIAL_FEEDBACK: FeedbackRecord[] = [
  { id: "f-1", userEmail: "client.alpha@enterprise.com", rating: 5, comments: "The intent classification is incredibly rapid. Solved my invoice question instantly!", timestamp: "Today, 11:20 AM", sentiment: "Positive" },
  { id: "f-2", userEmail: "developer@infotech.io", rating: 4, comments: "Extremely detailed articles. It would be cooler if we could stream code directly.", timestamp: "Yesterday", sentiment: "Positive" },
  { id: "f-3", userEmail: "guest.user@gmail.com", rating: 5, comments: "வணக்கம்! தமிழ் மொழி ஆதரவு மிக அருமையாக உள்ளது! பயனுள்ள தகவல்.", timestamp: "2 days ago", sentiment: "Positive" },
  { id: "f-4", userEmail: "furious.purchaser@outlook.com", rating: 2, comments: "Told the system online and it transferred me quickly after I got mad, glad live agent sorted it.", timestamp: "June 12", sentiment: "Negative" }
];
