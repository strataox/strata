// @scripts/motion/modal-video.js

import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'
import { _createYouTubeIframe } from '@scripts/utils/create-youtube-iframe'

export function _modalVideo() {
	const modal = _q('[data-pbl-video]')
	if (!modal) return

	const top = _q('[data-pbl-video-shade-top]', modal)
	const bottom = _q('[data-pbl-video-shade-bottom]', modal)
	const content = _q('[data-pbl-video-content]', modal)
	const dismiss = _q('[data-pbl-dismiss]', modal)
	const triggers = _ql('[data-pbl-playhead]')

	if (!top || !bottom || !content || !dismiss || !triggers.length) return

	let isOpen = false
	let tl = null

	// Defaults
	const easeIn = 'power3.out'
	const easeOut = 'power2.in'
	const dur = 0.3

	const getVideoId = () => {
		const id = modal.dataset.pblVideoId
		return typeof id === 'string' && id.trim() ? id.trim() : null
	}

	const getVideoTitle = () => {
		const t = modal.dataset.pblVideoTitle
		return typeof t === 'string' && t.trim() ? t.trim() : 'Play video'
	}

	const destroyIframe = () => content.replaceChildren()
	const mountIframe = () => {
		const iframe = _createYouTubeIframe(getVideoId(), getVideoTitle())
		content.appendChild(iframe)
	}
	const kill = () => {
		if (tl) {
			tl.kill()
			tl = null
		}
		gsap.killTweensOf([modal, top, bottom, content, dismiss])
	}

	const open = () => {
		if (isOpen) return
		isOpen = true

		kill()
		destroyIframe()
		mountIframe()

		gsap.set(modal, { pointerEvents: 'auto' })
		gsap.set([top, bottom], { yPercent: 0 })
		gsap.set(content, { autoAlpha: 0, scale: 0.92 })
		gsap.set(dismiss, { autoAlpha: 0, x: 16, scale: 0.92 })

		tl = gsap
			.timeline()
			.to(modal, { autoAlpha: 1, scale: 1, duration: dur, ease: easeIn })
			.to(
				[top, bottom],
				{
					yPercent: (i) => (i === 0 ? -100 : 100),
					duration: dur,
					ease: easeIn,
				},
				'<0.05',
			)
			.to(
				content,
				{ autoAlpha: 1, scale: 1, duration: dur, ease: easeIn },
				'-=0.25',
			)
			.to(
				dismiss,
				{
					autoAlpha: 1,
					x: 0,
					scale: 1,
					duration: dur * 0.8,
					ease: easeIn,
				},
				'>-0.025',
			)
	}

	const close = () => {
		if (!isOpen) return
		isOpen = false

		kill()

		gsap.to(modal, {
			autoAlpha: 0,
			scale: 0.5,
			duration: dur,
			ease: easeOut,
			onComplete: () => {
				destroyIframe()
				gsap.set(modal, { pointerEvents: 'none' })
			},
		})
	}

	triggers.forEach((btn) => btn.addEventListener('click', open))
	dismiss.addEventListener('click', close)

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
