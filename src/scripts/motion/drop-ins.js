// @scripts/motion/drop-ins.js
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { _ql } from '@scripts/utils/snips'

gsap.registerPlugin(ScrollTrigger)

export function _dropIns() {
	const items = _ql('[data-pbl-stagger-in]')
	if (!items.length) return

	const reduceMotion =
		globalThis.matchMedia &&
		globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduceMotion) return

	const staggerIn = (el) => {
		gsap.from(el, {
			autoAlpha: 0,
			y: 24,
			rotate: -0.5,
			transformOrigin: '50% 50%',
			willChange: 'transform, opacity',
			duration: 0.5,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: el,
				start: 'top 90%',
				toggleActions: 'play none none reverse',
			},
		})
	}

	items.forEach(staggerIn)
}
