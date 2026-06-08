import { defineCollection, z } from 'astro:content';

export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string().optional().default(''),
      category: z.enum(['blog', 'opinion', 'project']),
      pubDate: z.coerce.date(),
    }),
  }),
};
