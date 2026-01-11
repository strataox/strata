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
				legalName: z
					.string()
					.max(55, 'Legal name must not exceed 55 characters'),
				declaration: z
					.string()
					.max(
						500,
						'Legal declaration must not exceed 500 characters',
					)
					.optional(),
			}),
		}),
})
