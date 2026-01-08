// @scripts/motion/carousel.js

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { _q } from '@scripts/utils/snips'

gsap.registerPlugin(ScrollTrigger)

export function _carousel() {
	const root = _q('[data-pbl-carousel]')
	if (!root) return

	const inner = _q('[data-pbl-carousel-inner]', root)
	if (!inner) return

	const reduce =
		globalThis.matchMedia &&
		globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduce) return

	gsap.set(root, {
		transformOrigin: '50% 50%',
		willChange: 'clip-path',
	})

	gsap.set(inner, {
		transformOrigin: '50% 50%',
		willChange: 'transform, opacity, filter',
	})

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: root,
			start: 'top 95%',
			end: 'top 15%',
			scrub: true,
		},
	})

	tl.fromTo(
		root,
		{ clipPath: 'circle(0vmax at 50% 50%)', },
		{
			clipPath: 'circle(100vmax at 50% 50%)',
			ease: 'none',
		},
		0,
	)

	tl.fromTo(
		inner,
		{ y: 56, scale: 0.8, opacity: 0 },
		{ y: 0, scale: 1, opacity: 1, ease: 'none' },
		0,
	)
}
