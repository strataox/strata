// @scripts/data/get-gallery.js

import { getCollection } from 'astro:content'

export async function _getGallery(year, count) {
	if (!year) return []

	const items = await getCollection(
		'gallery',
		({ data }) => data.draft !== true && data.year === String(year),
	)

	if (typeof count === 'number' && count > 0) {
		return items.slice(0, count)
	}

	return items
}
