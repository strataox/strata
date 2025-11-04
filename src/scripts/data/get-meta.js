// @scripts/data/get-meta.js

import { getEntry } from 'astro:content'

const { data: meta } = await getEntry('meta', 'meta')

export const site = meta.site

export default meta
