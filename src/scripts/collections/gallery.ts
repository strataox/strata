// @scripts/collections/gallery.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const galleryItem = z.object({
	id: z.string().min(1, 'id is required'),
	title: z.string().min(1),
	image: z.string().min(1),
	altText: z.string().optional(),
	description: z.string().optional(),
	priority: z.number().int().min(0).default(0),
	draft: z.boolean().default(false),
})

export const gallery = defineCollection({
	loader: glob({
		pattern: 'gallery/**/[^_]*.{json,yml,yaml}',
		base: './content',
	}),
	schema: () =>
		z.object({
			year: z
				.string()
				.regex(/^\d{4}$/, 'Year must be a 4 digit string, e.g. 2025'),
			items: z.array(galleryItem).default([]),
		}),
})