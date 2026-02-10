import { db } from "./db";
import { schemes, chatLogs, type Scheme, type InsertScheme, type InsertChatLog, type ChatLog } from "@shared/schema";
import { eq, like, or, and, sql } from "drizzle-orm";

export interface IStorage {
  // Schemes
  getAllSchemes(category?: string, state?: string, search?: string, source?: string): Promise<Scheme[]>;
  getSchemeById(id: number): Promise<Scheme | undefined>;
  createScheme(scheme: InsertScheme): Promise<Scheme>;
  seedSchemes(schemesList: InsertScheme[]): Promise<void>;

  // Chat Logs
  logChat(log: InsertChatLog): Promise<ChatLog>;
}

export class DatabaseStorage implements IStorage {
  async getAllSchemes(category?: string, state?: string, search?: string, source?: string): Promise<Scheme[]> {
    let conditions = [];

    if (category) {
      conditions.push(like(schemes.category, `%${category}%`));
    }

    if (state) {
      conditions.push(or(
        like(schemes.state, `%${state}%`),
        like(schemes.state, 'Pan India'),
        like(schemes.state, 'Karnataka')
      ));
    }

    if (source) {
      conditions.push(like(schemes.source, `%${source}%`));
    }

    if (search) {
      conditions.push(or(
        like(schemes.name, `%${search}%`),
        like(schemes.description, `%${search}%`),
        like(schemes.benefits, `%${search}%`),
        like(schemes.keywords, `%${search}%`) // Search within JSON string
      ));
    }

    if (conditions.length > 0) {
      return await db.select().from(schemes).where(and(...conditions));
    }

    return await db.select().from(schemes);
  }

  async getSchemeById(id: number): Promise<Scheme | undefined> {
    const [scheme] = await db.select().from(schemes).where(eq(schemes.id, id));
    return scheme;
  }

  async createScheme(scheme: InsertScheme): Promise<Scheme> {
    const [newScheme] = await db.insert(schemes).values(scheme).returning();
    return newScheme;
  }

  async seedSchemes(schemesList: InsertScheme[]): Promise<void> {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(schemes);
    if (Number(existing[0].count) === 0) {
      await db.insert(schemes).values(schemesList);
    }
  }

  async logChat(log: InsertChatLog): Promise<ChatLog> {
    const [newLog] = await db.insert(chatLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
