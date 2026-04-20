/**
 * Central config for the communication system.
 *
 * Two places read from this:
 *   1. FloatingActions — for the WhatsApp button and the chat UI.
 *   2. /api/chat — for the LLM system prompt and handoff handling.
 *
 * Keep everything human-editable here rather than hard-coded in components.
 */

import { pricingCategoryLabels } from "../pricing";
import { services } from "../data";
import { getPricingPlans } from "../pricing";
import { formatBdt } from "../utils";

// ---------- WhatsApp ----------

/**
 * Wevnix's WhatsApp number in international format, no + or spaces.
 * Override via env var if you want to test without redeploying.
 */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801700000000";

/** Default prefilled message when a visitor taps the WhatsApp button. */
export const WHATSAPP_DEFAULT_MESSAGE = "Hi Wevnix, I'm interested in...";

/**
 * Build a WhatsApp deep link. `context` lets callers add a page-specific
 * message (e.g., "...about your Web Starter package").
 */
export function buildWhatsAppUrl(context?: string): string {
  const message = context
    ? `${WHATSAPP_DEFAULT_MESSAGE.replace("...", context)}`
    : WHATSAPP_DEFAULT_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ---------- Chatbot ----------

export const CHAT_CONFIG = {
  /** Model identifier for the Anthropic API. */
  model: "claude-sonnet-4-5" as const,
  /** Max tokens per bot reply. Keep small for chat latency + cost. */
  maxTokens: 600,
  /** Hard cap on stored messages per conversation. Older messages get trimmed from context. */
  contextMessageLimit: 20,
  /** Reject conversations longer than this many messages (abuse prevention). */
  maxMessagesPerConversation: 60,
  /** Per-visitor rate limit (messages per minute). */
  rateLimit: { capacity: 15, perMinute: 15 },
};

/**
 * Trigger phrases that escalate a conversation to human handoff.
 * Admin receives an email/Slack ping and the chat UI shows "we'll reply soon."
 */
export const HANDOFF_TRIGGERS = [
  "talk to a human",
  "speak to someone",
  "real person",
  "human agent",
  "customer support",
  "call me",
];

/**
 * Builds the system prompt for the chatbot.
 *
 * Pulled dynamically from the pricing repo and services data so when an
 * admin edits a price, the bot's next reply uses the new one — no redeploy
 * required. Kept compact: LLMs pay attention better to 1000 tokens of
 * crisp facts than 4000 tokens of marketing copy.
 */
export async function buildSystemPrompt(locale: "en" | "bn" = "en"): Promise<string> {
  const plans = await getPricingPlans();

  const servicesSummary = services
    .map((s) => `- ${s.title}: ${s.description}`)
    .join("\n");

  const pricingSummary = plans
    .map((p) => {
      const price = p.customQuote
        ? "Custom quote"
        : `${formatBdt(p.priceBdt)}${p.billingCycle === "one-time" ? "" : ` / ${p.billingCycle}`}`;
      return `- [${pricingCategoryLabels[p.category]}] ${p.name} — ${price}. ${p.tagline}`;
    })
    .join("\n");

  const languageNote =
    locale === "bn"
      ? "The visitor is using Bengali. Reply in Bengali (Bangla script). Use Western numerals for prices."
      : "Reply in English unless the visitor writes in Bengali. If they do, switch to Bengali.";

  return `You are Wevnix Assistant, a helpful support bot for Wevnix — a software services company based in Bangladesh.

Wevnix builds websites, mobile apps, custom software, AI solutions, and offers hosting and SEO services. Prices are in BDT (Bangladeshi Taka) and include 15% VAT.

${languageNote}

Your role:
- Answer questions about services, pricing, and the company briefly and warmly.
- For complex projects, custom quotes, or anything you're not sure about, suggest the visitor book a call or message on WhatsApp.
- If asked to talk to a human, acknowledge and tell them someone will reach out via WhatsApp shortly.
- Never invent prices, timelines, or features. If it's not in the facts below, say you'll check with the team.
- Keep replies under 3 short paragraphs. No long lists unless asked.

Current services:
${servicesSummary}

Current pricing (active plans only):
${pricingSummary}

Company facts:
- Based in Dhaka, Bangladesh. Founded 2019.
- Bangla and English support on WhatsApp: +${WHATSAPP_NUMBER}
- BASIS member. 50+ projects delivered. 99.9% hosting uptime.
- Pricing and VAT are already included in the numbers shown.
- Installments available for projects over BDT 100,000.

Never:
- Promise a specific delivery date.
- Quote a price that isn't in the list above.
- Claim certifications, awards, or clients not mentioned above.
- Ask for or store credit card, password, or NID information.`;
}

// ---------- Locale helpers ----------

export const BOT_GREETING: Record<"en" | "bn", string> = {
  en: "👋 Hi! I can help with pricing, services, or domain questions. What are you looking for?",
  bn: "👋 হ্যালো! মূল্য, সেবা বা ডোমেইন সম্পর্কে যেকোনো প্রশ্ন করুন।",
};

export const BOT_QUICK_REPLIES: Record<"en" | "bn", string[]> = {
  en: ["Pricing", "Book a call", "Domain check", "Talk to human"],
  bn: ["মূল্য", "কল বুক করুন", "ডোমেইন চেক", "মানুষের সাথে কথা"],
};
