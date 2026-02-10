import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schemes = sqliteTable("schemes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  source: text("source").notNull().default("Central"), // Central or Karnataka
  category: text("category").notNull(), // farmer, student, women, etc.
  description: text("description").notNull(),
  beneficiaries: text("beneficiaries").notNull(),
  eligibility: text("eligibility").notNull(),
  benefits: text("benefits").notNull(),
  documents: text("documents").notNull(),
  applicationProcess: text("application_process").notNull(),
  officialLink: text("official_link"),
  state: text("state").default("Pan India"),
  keywords: text("keywords", { mode: "json" }).$type<string[]>(), // Store as JSON string in SQLite
  // Support for simple multilingual mapping if needed later, or just store JSON
  translations: text("translations", { mode: "json" }).default("{}").$type<Record<string, any>>(),
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({ id: true });
export type Scheme = typeof schemes.$inferSelect;
export type InsertScheme = z.infer<typeof insertSchemeSchema>;

export const chatLogs = sqliteTable("chat_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userMessage: text("user_message").notNull(),
  botResponse: text("bot_response").notNull(),
  intent: text("intent"),
  language: text("language").default("en"),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch() * 1000)`),
});

export const insertChatLogSchema = createInsertSchema(chatLogs).omit({ id: true, timestamp: true });
export type ChatLog = typeof chatLogs.$inferSelect;
export type InsertChatLog = z.infer<typeof insertChatLogSchema>;

// Explicit API types
export type ChatRequest = {
  message: string;
  language?: string; // en, hi, kn, ta, te
};

export type ChatResponse = {
  response: string;
  intent: string;
  schemes?: Scheme[]; // If the intent matches schemes, return them
  suggestedQuestions?: string[];
};
