// @scripts/motion/modal-video.js

import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'

export function _modalVideo() {
	const modal = _q('[data-pbl-video]')
	if (!modal) return

	const top = _q('[data-pbl-video-shade-top]', modal)
	const bottom = _q('[data-pbl-video-shade-bottom]', modal)
	const content = _q('[data-pbl-video-content]', modal)
	if (!top || !bottom || !content) return

	const triggers = _ql('[data-pbl-playhead]')
	if (!triggers.length) return

	let isOpen = false
	let tl = null

	const getVideoId = () => {
		const id = modal.dataset.pblVideoId
		return typeof id === 'string' && id.trim() ? id.trim() : null
	}

	const getVideoTitle = () => {
		const t = modal.dataset.pblVideoTitle
		return typeof t === 'string' && t.trim() ? t.trim() : 'Play video'
	}

	const createIframe = (videoId) => {
		const params = new URLSearchParams({
			autoplay: '1',
			rel: '0',
			modestbranding: '1',
			playsinline: '1',
		})

		const iframe = document.createElement('iframe')
		iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`
		iframe.title = getVideoTitle()
		iframe.allow =
			'autoplay; encrypted-media; picture-in-picture; fullscreen'
		iframe.allowFullscreen = true
		iframe.setAttribute('frameborder', '0')

		return iframe
	}

	const destroyIframe = () => {
		content.replaceChildren()
	}

	const open = () => {
		if (isOpen) return
		isOpen = true

		if (tl) {
			tl.kill()
			tl = null
		}

		gsap.killTweensOf(modal)
		gsap.killTweensOf([top, bottom, content])

		const videoId = getVideoId()
		destroyIframe()
		if (videoId) content.appendChild(createIframe(videoId))

		gsap.set(modal, { pointerEvents: 'auto' })
		gsap.set([top, bottom], { yPercent: 0 })
		gsap.set(content, { autoAlpha: 0, scale: 0.92 })

		tl = gsap
			.timeline()
			.to(modal, {
				autoAlpha: 1,
				scale: 1,
				duration: 0.3,
				ease: 'power2.out',
			})
			.to(
				[top, bottom],
				{
					yPercent: (i) => (i === 0 ? -100 : 100),
					duration: 0.4,
					ease: 'power3.inOut',
				},
				'<0.05',
			)
			.to(
				content,
				{
					autoAlpha: 1,
					scale: 1,
					duration: 0.4,
					ease: 'power2.out',
				},
				'-=0.25',
			)
	}

	const close = () => {
		if (!isOpen) return
		isOpen = false

		if (tl) {
			tl.kill()
			tl = null
		}

		gsap.killTweensOf(modal)
		gsap.killTweensOf([top, bottom, content])

		gsap.to(modal, {
			autoAlpha: 0,
			scale: 0.5,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => {
				destroyIframe()
				gsap.set(modal, { pointerEvents: 'none' })
			},
		})
	}

	triggers.forEach((btn) => btn.addEventListener('click', open))

	document.addEventListener(
		'keydown',
		(e) => {
			if (e.key !== 'Escape') return
			if (!isOpen) return
			if (document.fullscreenElement) return
			close()
		},
		true,
	)
}
