// @scripts/collections/gallery.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const gallery = defineCollection({
	loader: glob({
		pattern: 'gallery/**/[^_]*.{md,mdx,json,yml,yaml}',
		base: './content',
	}),
	schema: () =>
		z.object({
			year: z
				.string()
				.regex(/^\d{4}$/, 'Year must be a 4 digit string, e.g. 2025'),

			title: z.string(),
			image: z.string(),
			altText: z.string().optional(),
			description: z.string().optional(),

			priority: z.number().int().min(0).default(0),
			draft: z.boolean().default(false),
		}),
})
