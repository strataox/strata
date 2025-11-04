// @scripts/collections/pages.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const pages = defineCollection({
    loader: glob({ pattern: 'pages/**/[^_]*.{md,mdx,json,yml,yaml}', base: './content'}),
    schema: ({ image }) => z.object({
        title: z.string().max(25, 'Title must not exceed 25 characters'),
        description: z.string().max(360, 'Description must not exceed 360 characters'),
        draft: z.boolean().default(false),
    })
})