// @scripts/utils/create-youtube-iframe.js

export function _createYouTubeIframe(videoId, title = 'Play video') {
	if (typeof videoId !== 'string') return null
	const id = videoId.trim()
	if (!id) return null

	const params = new URLSearchParams({
		autoplay: '1',
		rel: '0',
		modestbranding: '1',
		playsinline: '1',
	})

	const iframe = document.createElement('iframe')
	iframe.src = `https://www.youtube.com/embed/${id}?${params.toString()}`
	iframe.title =
		typeof title === 'string' && title.trim() ? title.trim() : 'Play video'
	iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'
	iframe.allowFullscreen = true
	iframe.setAttribute('frameborder', '0')

	return iframe
}
