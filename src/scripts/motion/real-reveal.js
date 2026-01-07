// @scripts/motion/reel-reveal.js

import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'
import { _createYouTubeIframe } from '@scripts/utils/create-youtube-iframe'

export function _reelReveal() {
	const modal = _q('[data-pbl-reel]')
	if (!modal) return

	const top = _q('[data-pbl-reel-shade-top]', modal)
	const bottom = _q('[data-pbl-reel-shade-bottom]', modal)
	const content = _q('[data-pbl-reel-content]', modal)
	const dismiss = _q('[data-pbl-dismiss]', modal)
	const triggers = _ql('[data-pbl-reel-trigger]')

	if (!top || !bottom || !content || !dismiss || !triggers.length) return

	let isOpen = false
	let tl = null
	let activeTrigger = null
	let isFullscreen = false

	const easeIn = 'power3.out'
	const easeOut = 'power2.in'
	const dur = 0.3

	const focusNoScroll = (el) => {
		if (!el?.focus) return
		try {
			el.focus({ preventScroll: true })
		} catch {
			el.focus()
		}
	}

	const getVideoId = () => {
		const id = activeTrigger?.dataset?.pblVideoId
		return typeof id === 'string' && id.trim() ? id.trim() : null
	}

	const getVideoTitle = () => {
		const t = activeTrigger?.dataset?.pblVideoTitle
		return typeof t === 'string' && t.trim() ? t.trim() : 'Play video'
	}

	const destroyIframe = () => _q('iframe', content)?.remove()

	const mountVideo = () => {
		const id = getVideoId()
		if (!id) return
		destroyIframe()
		const iframe = _createYouTubeIframe(id, getVideoTitle())
		if (iframe) content.appendChild(iframe)
	}

	const kill = () => {
		if (tl) {
			tl.kill()
			tl = null
		}
		gsap.killTweensOf([modal, top, bottom, content, dismiss])
	}

	const open = (trigger) => {
		if (isOpen) return
		isOpen = true
		activeTrigger = trigger

		kill()
		mountVideo()

		gsap.set(modal, { pointerEvents: 'auto' })
		gsap.set([top, bottom], { yPercent: 0 })
		gsap.set(content, { autoAlpha: 0, scale: 0 })
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
				{ autoAlpha: 1, x: 0, scale: 1, duration: dur, ease: easeIn },
				'>-0.025',
			)
			.add(() => {
				focusNoScroll(dismiss)
			})
	}

	const close = () => {
		if (!isOpen) return
		isOpen = false

		const triggerToRestore = activeTrigger

		kill()

		gsap.to(modal, {
			autoAlpha: 0,
			scale: 0.5,
			duration: dur,
			ease: easeOut,
			onComplete: () => {
				destroyIframe()
				gsap.set(modal, { pointerEvents: 'none' })
				activeTrigger = null

				requestAnimationFrame(() => {
					focusNoScroll(triggerToRestore)
				})
			},
		})
	}

	triggers.forEach((btn) => btn.addEventListener('click', () => open(btn)))

	dismiss.addEventListener('click', (e) => {
		e.preventDefault()
		close()
	})

	const onEsc = (e) => {
		if (e.key !== 'Escape') return
		if (!isOpen) return
		if (isFullscreen) return
		close()
	}

	document.addEventListener('keydown', onEsc, true)
	document.addEventListener('keyup', onEsc, true)

	document.addEventListener('fullscreenchange', () => {
		isFullscreen = Boolean(document.fullscreenElement)
		if (isFullscreen) return
		if (!isOpen) return

		requestAnimationFrame(() => {
			focusNoScroll(dismiss)
		})
	})
}
