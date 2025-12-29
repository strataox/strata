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
			video: z
				.object({
					title: z
						.string()
						.max(40, 'Video title must not exceed 40 characters'),
					description: z
						.string()
						.max(
							155,
							'Video description must not exceed 155 characters',
						),
					cta: z
						.string()
						.max(15, 'Video CTA must not exceed 15 characters'),
					clip: z.string(),
					video: z.string(),
				})
				.optional(),
			draft: z.boolean().default(false),
		}),
})
