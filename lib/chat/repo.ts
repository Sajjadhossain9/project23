/**
 * Chat conversation repository.
 *
 * Same pattern as pricing-repo: in-memory today, one-line Prisma swap
 * when the DB is wired. Public surface stays identical.
 *
 * Prisma equivalent (comments next to each function):
 *   import { prisma } from "../prisma";
 */

import type { ChatConversation, ChatMessage } from "./types";

// ---------- Store ----------

const g = globalThis as unknown as {
  __chatConversations?: Map<string, ChatConversation>;
  __chatMessages?: Map<string, ChatMessage[]>;
};
if (!g.__chatConversations) g.__chatConversations = new Map();
if (!g.__chatMessages) g.__chatMessages = new Map();

const conversations = g.__chatConversations;
const messages = g.__chatMessages;

// ---------- Reads ----------

export async function getConversation(id: string): Promise<ChatConversation | null> {
  // Prisma: return prisma.chatConversation.findUnique({ where: { id } });
  return conversations.get(id) ?? null;
}

export async function getConversationMessages(
  conversationId: string,
  limit?: number
): Promise<ChatMessage[]> {
  // Prisma:
  //   return prisma.chatMessage.findMany({
  //     where: { conversationId },
  //     orderBy: { createdAt: "asc" },
  //     take: limit,
  //   });
  const all = messages.get(conversationId) ?? [];
  if (!limit) return all;
  // Return the last `limit` messages — preserves chronological order
  return all.slice(-limit);
}

// ---------- Writes ----------

export interface CreateConversationInput {
  visitorId: string;
  locale?: "en" | "bn";
  userAgent?: string;
  ip?: string;
  pagePath?: string;
}

export async function createConversation(
  input: CreateConversationInput
): Promise<ChatConversation> {
  // Prisma: return prisma.chatConversation.create({ data: input });
  const now = new Date().toISOString();
  const conversation: ChatConversation = {
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    visitorId: input.visitorId,
    status: "active",
    locale: input.locale ?? "en",
    userAgent: input.userAgent,
    ip: input.ip,
    pagePath: input.pagePath,
    createdAt: now,
    updatedAt: now,
  };
  conversations.set(conversation.id, conversation);
  messages.set(conversation.id, []);
  return conversation;
}

export interface AppendMessageInput {
  conversationId: string;
  role: ChatMessage["role"];
  content: string;
  meta?: Record<string, unknown>;
}

export async function appendMessage(input: AppendMessageInput): Promise<ChatMessage | null> {
  // Prisma: return prisma.chatMessage.create({ data: input });
  const convo = conversations.get(input.conversationId);
  if (!convo) return null;

  const message: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    meta: input.meta,
    createdAt: new Date().toISOString(),
  };

  const list = messages.get(input.conversationId) ?? [];
  list.push(message);
  messages.set(input.conversationId, list);

  // Bump the conversation's updatedAt — drives the admin inbox ordering
  conversations.set(input.conversationId, { ...convo, updatedAt: message.createdAt });
  return message;
}

export async function updateConversationStatus(
  id: string,
  status: ChatConversation["status"]
): Promise<ChatConversation | null> {
  // Prisma: return prisma.chatConversation.update({ where: { id }, data: { status, ...timestamps } });
  const convo = conversations.get(id);
  if (!convo) return null;

  const now = new Date().toISOString();
  const updated: ChatConversation = {
    ...convo,
    status,
    updatedAt: now,
    ...(status === "handoff" && { handedOffAt: now }),
    ...(status === "closed" && { closedAt: now }),
  };
  conversations.set(id, updated);
  return updated;
}

export async function countMessages(conversationId: string): Promise<number> {
  // Prisma: return prisma.chatMessage.count({ where: { conversationId } });
  return messages.get(conversationId)?.length ?? 0;
}
