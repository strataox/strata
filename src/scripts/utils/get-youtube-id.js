// @scripts/utils/get-youtube-id.js

export function _getYouTubeId(input) {
	if (!input) return null

	const value = String(input).trim()
	if (!value) return null

	if (value.length === 11) return value

	if (value.startsWith('http')) {
		const match = value.match(
			/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
		)
		return match?.[1] ?? null
	}

	return null
}
