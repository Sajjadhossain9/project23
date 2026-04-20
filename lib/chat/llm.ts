/**
 * Anthropic API client — isolated so the rest of the chat system doesn't
 * care which LLM provider we use. Swap this file to use OpenAI, Gemini,
 * or a local model without touching the route or the repo.
 *
 * If ANTHROPIC_API_KEY isn't set, returns a friendly placeholder reply so
 * the UI still works during local development. Production MUST set the key.
 */

import { CHAT_CONFIG, HANDOFF_TRIGGERS, buildSystemPrompt } from "./config";
import type { ChatMessage } from "./types";

export interface GenerateReplyInput {
  locale: "en" | "bn";
  history: ChatMessage[];      // Chronological, oldest first
  userMessage: string;
}

export interface GenerateReplyResult {
  reply: string;
  handoff: boolean;            // True if the user asked for a human
}

/**
 * Generate a bot reply given the conversation history and the new message.
 */
export async function generateReply(input: GenerateReplyInput): Promise<GenerateReplyResult> {
  const handoff = shouldHandoff(input.userMessage);

  // If the user explicitly asked for a human, short-circuit — don't burn
  // API credits on a reply the UI will mostly suppress anyway.
  if (handoff) {
    return {
      reply:
        input.locale === "bn"
          ? "বুঝেছি — আমাদের একজন সহকর্মী শীঘ্রই হোয়াটসঅ্যাপে যোগাযোগ করবেন। দয়া করে অপেক্ষা করুন।"
          : "Got it — a teammate will reach out on WhatsApp shortly. Feel free to tell me more while you wait.",
      handoff: true,
    };
  }

  // Dev fallback when no API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      reply:
        "I'm running in demo mode without an API key, so I can't generate a real answer right now. In production this is a Claude reply; for now, please tap the WhatsApp button to reach the team directly.",
      handoff: false,
    };
  }

  const system = await buildSystemPrompt(input.locale);
  const messages = toAnthropicMessages(input.history, input.userMessage);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_CONFIG.model,
      max_tokens: CHAT_CONFIG.maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    // Don't leak upstream errors to the user — log for ops, return a graceful fallback
    console.error("[chat] Anthropic API error:", response.status, await response.text().catch(() => ""));
    return {
      reply:
        input.locale === "bn"
          ? "দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না। হোয়াটসঅ্যাপে যোগাযোগ করুন দ্রুত সাহায্যের জন্য।"
          : "Sorry, I'm having trouble responding right now. Please tap the WhatsApp button for a faster answer.",
      handoff: false,
    };
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = data.content
    ?.filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return {
    reply: text || "I didn't catch that — could you rephrase?",
    handoff: false,
  };
}

// ---------- Helpers ----------

/**
 * Convert our internal message history to the format Anthropic expects.
 * We drop `system` and `admin` messages from the LLM context — they're for
 * humans, not for the bot. The `system` prompt itself is passed separately.
 */
function toAnthropicMessages(
  history: ChatMessage[],
  newUserMessage: string
): Array<{ role: "user" | "assistant"; content: string }> {
  const mapped: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const msg of history) {
    if (msg.role === "user") {
      mapped.push({ role: "user", content: msg.content });
    } else if (msg.role === "assistant") {
      mapped.push({ role: "assistant", content: msg.content });
    }
    // Skip system / admin — not part of bot context
  }

  mapped.push({ role: "user", content: newUserMessage });

  // Anthropic requires alternating user/assistant — coalesce consecutive same-role
  // messages into one so a stray double-user doesn't 400 the whole request.
  return coalesce(mapped);
}

function coalesce(
  msgs: Array<{ role: "user" | "assistant"; content: string }>
): Array<{ role: "user" | "assistant"; content: string }> {
  const out: typeof msgs = [];
  for (const m of msgs) {
    const last = out[out.length - 1];
    if (last && last.role === m.role) {
      last.content = `${last.content}\n\n${m.content}`;
    } else {
      out.push({ ...m });
    }
  }
  return out;
}

/** Check if the visitor's message asks for a human. */
export function shouldHandoff(message: string): boolean {
  const lower = message.toLowerCase();
  return HANDOFF_TRIGGERS.some((trigger) => lower.includes(trigger));
}
