import { defineCollection } from 'astro:content';
import { controlSchema, frameworkSchema } from './schemas';

export * from './schemas';

const controls = defineCollection({
  type: 'data',
  schema: controlSchema,
});

const frameworks = defineCollection({
  type: 'data',
  schema: frameworkSchema,
});

export const collections = { controls, frameworks };
