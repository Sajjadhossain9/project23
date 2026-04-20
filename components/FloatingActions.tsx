"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { MessageCircle, Bot, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_DEFAULT_MESSAGE,
  BOT_GREETING,
  BOT_QUICK_REPLIES,
} from "@/lib/chat/config";
import type { ChatResponseBody } from "@/lib/chat/types";

type Locale = "en" | "bn";

interface UIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  pending?: boolean;
  failed?: boolean;
}

/**
 * Get or create a stable visitor ID. Used by the API to distinguish
 * conversations without requiring login. Persists across sessions.
 */
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("wevnix_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("wevnix_visitor_id", id);
  }
  return id;
}

export function FloatingActions({ locale = "en" }: { locale?: Locale } = {}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [inHandoff, setInHandoff] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const visitorIdRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize on mount
  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    // Seed the chat with the greeting (client-only; don't persist server-side)
    setMessages([
      { id: "greet", role: "assistant", content: BOT_GREETING[locale] },
    ]);
  }, [locale]);

  // Close chat on Escape
  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChatOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  // Autoscroll to newest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsg: UIMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const pendingBotMsg: UIMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "",
      pending: true,
    };

    setMessages((prev) => [...prev, userMsg, pendingBotMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          visitorId: visitorIdRef.current,
          message: trimmed,
          locale,
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingBotMsg.id
              ? {
                  ...m,
                  pending: false,
                  failed: true,
                  content:
                    err.error ??
                    (locale === "bn"
                      ? "দুঃখিত, কিছু ভুল হয়েছে। আবার চেষ্টা করুন।"
                      : "Sorry, something went wrong. Please try again."),
                }
              : m
          )
        );
        return;
      }

      const data = (await res.json()) as ChatResponseBody;
      conversationIdRef.current = data.conversationId;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingBotMsg.id
            ? { ...m, pending: false, content: data.reply }
            : m
        )
      );

      if (data.handoff) {
        setInHandoff(true);
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingBotMsg.id
            ? {
                ...m,
                pending: false,
                failed: true,
                content:
                  locale === "bn"
                    ? "সংযোগে সমস্যা। হোয়াটসঅ্যাপে যোগাযোগ করুন।"
                    : "Connection problem. Please use WhatsApp instead.",
              }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickReply(text: string) {
    // Quick replies go through the same flow as typed messages
    if (text.toLowerCase().includes("human") || text.includes("মানুষ")) {
      // "Talk to human" — open WhatsApp directly rather than relying on the LLM
      window.open(buildWaUrl(), "_blank", "noopener,noreferrer");
      return;
    }
    sendMessage(text);
  }

  const showQuickReplies = messages.length <= 1 && !sending && !inHandoff;

  return (
    <>
      {/* Chat panel */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={locale === "bn" ? "এআই সহকারী" : "AI assistant"}
        aria-hidden={!chatOpen}
        className={cn(
          "fixed z-40 transition-all duration-300 ease-out-expo",
          "bottom-4 right-4 sm:bottom-24 sm:right-6",
          "w-[calc(100vw-2rem)] max-w-sm sm:w-96",
          chatOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="bg-bg-surface rounded-xl shadow-elev-4 border border-border-subtle flex flex-col h-[560px] max-h-[80vh] overflow-hidden">
          <ChatHeader onClose={() => setChatOpen(false)} locale={locale} />

          {/* Handoff banner */}
          {inHandoff && (
            <div className="px-4 py-2 bg-accent-soft text-accent-ink text-caption border-b border-border-subtle">
              {locale === "bn"
                ? "একজন সহকর্মী শীঘ্রই যোগাযোগ করবেন।"
                : "A teammate will be with you shortly."}
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-2">
                {BOT_QUICK_REPLIES[locale].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleQuickReply(chip)}
                    className="px-3 py-1.5 rounded-full border border-border-default text-caption text-fg hover:bg-bg-raised hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border-subtle flex items-center gap-2 shrink-0"
          >
            <label htmlFor="chat-input" className="sr-only">
              {locale === "bn" ? "আপনার বার্তা" : "Your message"}
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                inHandoff
                  ? locale === "bn"
                    ? "উত্তরের জন্য অপেক্ষা করছি…"
                    : "Waiting for a human reply…"
                  : locale === "bn"
                  ? "বার্তা লিখুন…"
                  : "Type a message…"
              }
              disabled={sending}
              autoComplete="off"
              className="flex-1 h-10 px-3 bg-bg border border-border-default rounded-md text-body-sm text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label={locale === "bn" ? "পাঠান" : "Send message"}
              className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-md bg-brand text-fg-inverse hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={16} aria-hidden="true" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Floating buttons */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col gap-3"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          type="button"
          onClick={() => setChatOpen((o) => !o)}
          aria-label={
            chatOpen
              ? locale === "bn"
                ? "এআই সহকারী বন্ধ করুন"
                : "Close AI assistant"
              : locale === "bn"
              ? "এআই সহকারী খুলুন"
              : "Open AI assistant"
          }
          aria-expanded={chatOpen}
          className="h-14 w-14 rounded-full bg-brand text-fg-inverse shadow-elev-3 flex items-center justify-center hover:bg-brand-hover transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {chatOpen ? <X size={22} aria-hidden="true" /> : <Bot size={22} aria-hidden="true" />}
        </button>

        <a
          href={buildWaUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={locale === "bn" ? "হোয়াটসঅ্যাপে চ্যাট করুন" : "Chat on WhatsApp"}
          className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-elev-3 flex items-center justify-center hover:bg-[#20BA5A] transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <MessageCircle size={22} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

// ---------- Subcomponents ----------

function ChatHeader({ onClose, locale }: { onClose: () => void; locale: Locale }) {
  return (
    <header className="flex items-center justify-between px-4 h-14 border-b border-border-subtle bg-bg-raised shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-accent-soft text-accent flex items-center justify-center">
          <Bot size={16} aria-hidden="true" />
        </div>
        <div>
          <p className="text-body-sm font-medium text-fg leading-tight">Wevnix AI</p>
          <p className="text-caption text-fg-tertiary leading-tight flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            {locale === "bn" ? "অনলাইন" : "Usually replies instantly"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={locale === "bn" ? "চ্যাট বন্ধ করুন" : "Close chat"}
        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-fg-secondary hover:text-fg hover:bg-bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </header>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] px-3.5 py-2.5 text-body-sm rounded-lg whitespace-pre-wrap",
          isUser
            ? "bg-brand text-fg-inverse rounded-tr-sm"
            : "bg-bg-raised text-fg rounded-tl-sm",
          message.failed && "!bg-danger/10 !text-danger"
        )}
      >
        {message.pending ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-fg-tertiary animate-pulse [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-fg-tertiary animate-pulse [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-fg-tertiary animate-pulse [animation-delay:300ms]" />
            </span>
          </span>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

function buildWaUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;
}
