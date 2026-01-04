// @scripts/motion/modal-video.js

import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'

export function _modalVideo() {
	const modal = _q('[data-pbl-video]')
	if (!modal) return

	const stage = _q('[data-pbl-video-stage]', modal)
	if (!stage) return

	const triggers = _ql('[data-pbl-playhead]')
	if (!triggers.length) return

	let isOpen = false

	const open = () => {
		if (isOpen) return
		isOpen = true

		gsap.killTweensOf(modal)

		gsap.set(modal, { pointerEvents: 'auto' })

		gsap.to(modal, {
			autoAlpha: 1,
			scale: 1,
			duration: 0.5,
			ease: 'power2.out',
		})
	}

	const close = () => {
		if (!isOpen) return
		isOpen = false

		gsap.killTweensOf(modal)

		gsap.to(modal, {
			autoAlpha: 0,
			scale: 0.95,
			duration: 0.35,
			ease: 'power2.in',
			onComplete: () => {
				gsap.set(modal, { pointerEvents: 'none' })
			},
		})
	}

	triggers.forEach((btn) => {
		btn.addEventListener('click', open)
	})

	window.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape') return
		close()
	})
}
