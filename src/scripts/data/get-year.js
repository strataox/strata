// @scripts/data/get-year.js

import { getCollection } from 'astro:content'

function shuffleInPlace(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

export async function _getYear(year, count) {
	if (!year) return []

	const quotes = await getCollection(
		'quotes',
		({ data }) => data.draft !== true && data.year === String(year),
	)

	if (typeof count === 'number' && count > 0) {
		return shuffleInPlace([...quotes]).slice(0, count)
	}

	return quotes
}
