// @scripts/collections/signatures.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const signatures = defineCollection({
	loader: glob({
		pattern: 'signatures/**/[^_]*.{md,mdx,json,yml,yaml}',
		base: './content',
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(55, 'Title must not exceed 55 characters'),
			description: z
				.string()
				.max(40, 'Description must not exceed 40 characters'),
			draft: z.boolean().default(false),
		}),
})