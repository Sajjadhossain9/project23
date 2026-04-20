import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createConversation,
  getConversation,
  getConversationMessages,
  appendMessage,
  updateConversationStatus,
  countMessages,
} from "@/lib/chat/repo";
import { generateReply } from "@/lib/chat/llm";
import { checkChatRateLimit } from "@/lib/chat/rate-limit";
import { CHAT_CONFIG } from "@/lib/chat/config";
import type { ChatResponseBody } from "@/lib/chat/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  conversationId: z.string().optional(),
  visitorId: z.string().min(8).max(64),
  message: z.string().min(1).max(2000),
  locale: z.enum(["en", "bn"]).optional(),
  pagePath: z.string().max(256).optional(),
});

export async function POST(req: NextRequest) {
  // 1. Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { visitorId, message, locale = "en", pagePath } = parsed.data;
  let conversationId = parsed.data.conversationId;

  // 2. Rate limit per visitor
  const rl = checkChatRateLimit(
    visitorId,
    CHAT_CONFIG.rateLimit.capacity,
    CHAT_CONFIG.rateLimit.perMinute / 60
  );
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment.", retryAfter: rl.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  // 3. Get or create the conversation
  let conversation = conversationId ? await getConversation(conversationId) : null;

  // Verify ownership — conversationId alone isn't enough, it must match the visitorId
  if (conversation && conversation.visitorId !== visitorId) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  if (!conversation) {
    conversation = await createConversation({
      visitorId,
      locale,
      userAgent: req.headers.get("user-agent") ?? undefined,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      pagePath,
    });
    conversationId = conversation.id;
  }

  // 4. Cap conversation length (abuse prevention)
  const msgCount = await countMessages(conversation.id);
  if (msgCount >= CHAT_CONFIG.maxMessagesPerConversation) {
    return NextResponse.json(
      {
        error: "This conversation has reached its limit. Please start a new one or contact us on WhatsApp.",
      },
      { status: 403 }
    );
  }

  // 5. If the conversation is already in handoff, don't run the bot — just
  //    record the message so a human can reply later.
  if (conversation.status === "handoff") {
    await appendMessage({
      conversationId: conversation.id,
      role: "user",
      content: message,
    });
    return NextResponse.json<ChatResponseBody>({
      conversationId: conversation.id,
      reply:
        locale === "bn"
          ? "ধন্যবাদ! আমাদের একজন সহকর্মী শীঘ্রই যোগাযোগ করবেন।"
          : "Thanks — a teammate will reply as soon as they're available.",
      status: "handoff",
      handoff: true,
    });
  }

  // 6. Record the user's message
  await appendMessage({
    conversationId: conversation.id,
    role: "user",
    content: message,
  });

  // 7. Build history (trimmed to context window) and ask the LLM
  const history = await getConversationMessages(
    conversation.id,
    CHAT_CONFIG.contextMessageLimit
  );

  // The history already includes the user message we just appended — generateReply
  // treats the last arg as the "new" user message, so exclude it from history.
  const historyWithoutNew = history.slice(0, -1);

  const { reply, handoff } = await generateReply({
    locale,
    history: historyWithoutNew,
    userMessage: message,
  });

  // 8. If handoff was triggered, flip the status and notify ops
  if (handoff) {
    await updateConversationStatus(conversation.id, "handoff");
    void notifyOpsOfHandoff({
      conversationId: conversation.id,
      visitorId,
      pagePath,
      lastMessage: message,
    });
  }

  // 9. Record the bot reply
  await appendMessage({
    conversationId: conversation.id,
    role: "assistant",
    content: reply,
    meta: handoff ? { handoff: true } : undefined,
  });

  return NextResponse.json<ChatResponseBody>(
    {
      conversationId: conversation.id,
      reply,
      status: handoff ? "handoff" : "active",
      handoff,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    }
  );
}

// ---------- Ops notification ----------

/**
 * Fire-and-forget notification when a conversation escalates to human handoff.
 *
 * In production: Resend email to ops@wevnix.com, or post to a Slack webhook.
 * For now: console.log. Errors are swallowed — handoff notifications should
 * never block the visitor-facing response.
 */
async function notifyOpsOfHandoff(payload: {
  conversationId: string;
  visitorId: string;
  pagePath?: string;
  lastMessage: string;
}): Promise<void> {
  try {
    // Example Slack webhook integration (uncomment when ready):
    // const url = process.env.SLACK_HANDOFF_WEBHOOK;
    // if (url) {
    //   await fetch(url, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       text: `🧑 Chat handoff requested\nVisitor: ${payload.visitorId}\nPage: ${payload.pagePath ?? "unknown"}\nMessage: "${payload.lastMessage}"\nConvo: ${payload.conversationId}`,
    //     }),
    //   });
    // }

    // Example Resend email (uncomment when ready):
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "bot@wevnix.com",
    //   to: "ops@wevnix.com",
    //   subject: `Chat handoff requested — ${payload.conversationId}`,
    //   text: `Visitor asked for a human on ${payload.pagePath}\n\n"${payload.lastMessage}"`,
    // });

    console.log("[chat] handoff requested:", payload);
  } catch (err) {
    console.error("[chat] notifyOpsOfHandoff failed:", err);
  }
}
