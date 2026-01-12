// @scripts/motion/stagger-in.js
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { _ql } from '@scripts/utils/snips'

gsap.registerPlugin(ScrollTrigger)

export function _staggerIn() {
	const items = _ql('[data-pbl-stagger-in]')
	if (!items.length) return

	items.forEach((el) => {
		gsap.from(el, {
			autoAlpha: 0,
			y: 48,
			rotate: '5deg',
			transformOrigin: '100% 50%',
			willChange: 'transform, opacity',
			duration: 0.5,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: el,
				start: 'top 90%',
				toggleActions: 'play none none none',
			},
		})
	})
}