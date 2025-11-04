// @scripts/collections/meta.ts

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { _linkSchema } from '@scripts/utils/link-schema'

export const meta = defineCollection({
    loader: glob({ pattern: 'meta.{yaml,yml,json}', base: './content/meta' }),
    schema: ({ image }) => z.object({
        site: z.object({
            title: z.string(),
            description: z.string(),
        }),
    }),
})