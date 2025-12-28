// @scripts/collections/quotes.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const quotes = defineCollection({
	loader: glob({
		pattern: 'quotes/**/[^_]*.{md,mdx,json,yml,yaml}',
		base: './content',
	}),
	schema: () =>
		z.object({
			year: z
				.string()
				.regex(/^\d{4}$/, 'Year must be a 4 digit string, e.g. 2025'),
			quote: z.object({
				full: z
					.string()
					.max(1000, 'Full quote must not exceed 1000 characters')
					.optional(),
				pull: z
					.string()
					.max(160, 'Pull quote must not exceed 160 characters'),
			}),
			author: z.object({
				name: z.string(),
				byline: z.string(),
			}),
			draft: z.boolean().default(false),
		}),
})
