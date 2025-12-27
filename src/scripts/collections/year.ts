// @scripts/collections/year.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const year = defineCollection({
	loader: glob({
		pattern: 'year/**/[^_]*.{md,mdx,json,yml,yaml}',
		base: './content',
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(55, 'Title must not exceed 55 characters'),
			description: z
				.string()
				.max(160, 'Description must not exceed 160 characters'),
			draft: z.boolean().default(false),
			hero: z
				.object({
					pretitle: z.string().max(18).optional(),
					title: z.string().max(60),
					subtitle: z.string().max(60).optional(),
					lede: z.string().max(140).optional(),
				})
				.optional(),
		}),
})