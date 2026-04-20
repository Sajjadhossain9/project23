export type ChatStatus = "active" | "handoff" | "closed";
export type MessageRole = "user" | "assistant" | "admin" | "system";

export interface ChatConversation {
  id: string;
  visitorId: string;
  status: ChatStatus;
  locale: "en" | "bn";
  userAgent?: string;
  ip?: string;
  pagePath?: string;
  handedOffAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

// ---------- Wire format: client ↔ API ----------

export interface ChatRequestBody {
  conversationId?: string;   // Empty on first message → server creates one
  visitorId: string;         // Stable UUID from localStorage
  message: string;
  locale?: "en" | "bn";
  pagePath?: string;
}

export interface ChatResponseBody {
  conversationId: string;
  reply: string;
  status: ChatStatus;
  handoff?: boolean;         // Signals the UI to show "a human will reach out"
}

export interface ChatErrorBody {
  error: string;
  retryAfter?: number;
}
