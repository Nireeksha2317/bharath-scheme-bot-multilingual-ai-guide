import { z } from 'zod';
import { insertSchemeSchema, schemes, insertChatLogSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  schemes: {
    list: {
      method: 'GET' as const,
      path: '/api/schemes' as const,
      input: z.object({
        category: z.string().optional(),
        state: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof schemes.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/schemes/:id' as const,
      responses: {
        200: z.custom<typeof schemes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: z.object({
        message: z.string(),
        language: z.string().default('en'),
      }),
      responses: {
        200: z.object({
          response: z.string(),
          intent: z.string(),
          schemes: z.array(z.custom<typeof schemes.$inferSelect>()).optional(),
          suggestedQuestions: z.array(z.string()).optional(),
        }),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type Scheme = z.infer<typeof api.schemes.get.responses[200]>;
export type ChatResponse = z.infer<typeof api.chat.send.responses[200]>;
