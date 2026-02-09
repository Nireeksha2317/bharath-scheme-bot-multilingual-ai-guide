import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // farmer, student, women, etc.
  description: text("description").notNull(),
  beneficiaries: text("beneficiaries").notNull(),
  eligibility: text("eligibility").notNull(),
  benefits: text("benefits").notNull(),
  documents: text("documents").notNull(),
  applicationProcess: text("application_process").notNull(),
  officialLink: text("official_link"),
  state: text("state").default("Pan India"),
  // Support for simple multilingual mapping if needed later, or just store JSON
  translations: jsonb("translations").default({}), 
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({ id: true });
export type Scheme = typeof schemes.$inferSelect;
export type InsertScheme = z.infer<typeof insertSchemeSchema>;

export const chatLogs = pgTable("chat_logs", {
  id: serial("id").primaryKey(),
  userMessage: text("user_message").notNull(),
  botResponse: text("bot_response").notNull(),
  intent: text("intent"),
  language: text("language").default("en"),
  timestamp: timestamp("timestamp").defaultNow(),
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
