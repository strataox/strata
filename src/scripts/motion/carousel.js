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
		{
			clipPath: 'inset(18% 10% 18% 10% round 400px)',
		},
		{
			clipPath: 'inset(0% 0% 0% 0% round 0px)',
			ease: 'none',
		},
		0,
	)

	tl.fromTo(
		inner,
		{
			y: 56,
			scale: 0.92,
			opacity: 0,
		},
		{
			y: 0,
			scale: 1,
			opacity: 1,
			ease: 'none',
		},
		0,
	)
}
