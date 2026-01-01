// @scripts/data/get-gallery.js

import { getCollection } from 'astro:content'

export async function _getGallery(year, limit) {
	const y = String(year ?? '').trim()
	if (!y) return []

	const entries = await getCollection(
		'gallery',
		({ data }) => data.year === y,
	)

	const entry = entries?.[0]
	if (!entry) return []

	let items = Array.isArray(entry.data.items) ? entry.data.items : []
	items = items.filter((i) => !i?.draft)

	items.sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0))

	const n = Number(limit)
	if (Number.isFinite(n) && n > 0) items = items.slice(0, n)

	return items
}
