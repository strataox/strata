// @scripts/collections/meta.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const meta = defineCollection({
	loader: glob({ pattern: 'meta.{yaml,yml,json}', base: './content/meta' }),
	schema: ({ image }) =>
		z.object({
			site: z.object({
				title: z.string(),
				description: z.string(),
				url: z.string().url(),
				logo: z.object({
					src: z.string(),
					alt: z.string(),
				}),
				pattern: z.object({
					src: z.string(),
					alt: z.string(),
				}),
			}),
		}),
})
