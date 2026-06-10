import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { controlSchema, frameworkSchema } from './content/schemas';

const controls = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/controls' }),
  schema: controlSchema,
});

const frameworks = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/frameworks' }),
  schema: frameworkSchema,
});

export const collections = { controls, frameworks };
