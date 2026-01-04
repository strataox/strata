// @scripts/motion/modal-video.js

import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'

export function _modalVideo() {
	const modal = _q('[data-pbl-video]')
	if (!modal) return

	const stage = _q('[data-pbl-video-stage]', modal)
	if (!stage) return

	const top = _q('[data-pbl-video-shade-top]', modal)
	const bottom = _q('[data-pbl-video-shade-bottom]', modal)
	const content = _q('[data-pbl-video-content]', modal)
	if (!top || !bottom || !content) return

	const triggers = _ql('[data-pbl-playhead]')
	if (!triggers.length) return

	let isOpen = false
	let tl = null

	const open = () => {
		if (isOpen) return
		isOpen = true

		if (tl) tl.kill()
		gsap.killTweensOf(modal)

		gsap.set(modal, { pointerEvents: 'auto' })

		gsap.set([top, bottom], { yPercent: 0 })
		gsap.set(content, { scale: 0.92, autoAlpha: 0 })

		tl = gsap
			.timeline()
			.to(modal, {
				autoAlpha: 1,
				scale: 1,
				duration: 0.4,
				ease: 'power2.out',
			})
			.to(
				[top, bottom],
				{
					yPercent: (i) => (i === 0 ? -100 : 100),
					duration: 0.75,
					ease: 'power3.inOut',
				},
				'<0.05',
			)
			.to(
				content,
				{
					autoAlpha: 1,
					scale: 1,
					duration: 0.55,
					ease: 'power2.out',
				},
				'-=0.25',
			)
	}

	const close = () => {
		if (!isOpen) return
		isOpen = false

		if (tl) tl.kill()
		gsap.killTweensOf(modal)

		gsap.to(modal, {
			autoAlpha: 0,
			scale: 0.5,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => gsap.set(modal, { pointerEvents: 'none' }),
		})
	}

	triggers.forEach((btn) => btn.addEventListener('click', open))

	window.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape') return
		close()
	})
}
