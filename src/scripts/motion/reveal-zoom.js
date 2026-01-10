// @scripts/motion/reveal-zoom.js
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { _ql } from '@scripts/utils/snips'

gsap.registerPlugin(ScrollTrigger)

export const _revealZoom = () => {
	const roots = _ql('[data-pbl-reveal-zoom]')
	if (!roots.length) return

	const reduceMotion =
		globalThis.matchMedia &&
		globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduceMotion) return

	roots.forEach((root) => {
		const inner = root.firstElementChild
		if (!inner) return

		gsap.set([root, inner], { transformOrigin: '50% 50%' })
		gsap.set(root, { willChange: 'clip-path' })
		gsap.set(inner, { willChange: 'transform, opacity' })

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: root,
				start: 'top 90%',
				end: 'top 30%',
                scrub: true,
			},
		})

		tl.fromTo(
			root,
			{ clipPath: 'inset(20% 15% 20% 15% round 400px)' },
			{ clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
			0,
		)

		tl.fromTo(
			inner,
			{ scale: 2, opacity: 0 },
			{ scale: 1, opacity: 1, ease: 'none' },
			0,
		)
	})
}
