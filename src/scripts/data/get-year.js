// @scripts/data/get-year.js

import { getCollection } from 'astro:content'

export async function _getYear() {
	const years = await getCollection('year', ({ data }) => data.draft !== true)
	return years
}
