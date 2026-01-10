// @scripts/motion/reveal-zoom.js

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { _q } from '@scripts/utils/snips'

gsap.registerPlugin(ScrollTrigger)

export const _revealZoom = () => {
	const root = _q('[data-pbl-reveal-zoom]')
	const inner = root.firstElementChild

	const reduceMotion =
		globalThis.matchMedia &&
		globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduceMotion) return

	gsap.set([root, inner], { transformOrigin: '50% 50%' })
	gsap.set(root, { willChange: 'clip-path' })
	gsap.set(inner, { willChange: 'transform, opacity' })

	const reveal = gsap.timeline({
		scrollTrigger: {
			trigger: root,
			start: 'top 100%',
			end: 'top 35%',
			scrub: true,
		},
	})

	reveal.fromTo(
		root,
		{ clipPath: 'inset(20% 15% 20% 15% round 400px)' },
		{ clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
		0,
	)

	reveal.fromTo(
		inner,
		{
			scale: 2,
			opacity: 0,
		},
		{
			scale: 1,
			opacity: 1,
			ease: 'none',
		},
		0,
	)
}
