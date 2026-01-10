// @scripts/motion/looping-quotes.js

import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'

export function _loopingQuotes() {
	const quotes = _ql('[data-pbl-quote-looping]')
	if (!quotes.length) return

	quotes.forEach((root, i) => {
		const text = _q('[data-pbl-quote-looping-text]', root)
		const pulser = _q('[data-pbl-quote-looping-pulser]', root)
		if (!text) return

		let pulls = []
		try {
			pulls = JSON.parse(root.dataset.pblQuoteLoopingPulls || '[]')
		} catch {
			pulls = []
		}

		if (!Array.isArray(pulls) || pulls.length <= 1) return

		const durationMs = Number(root.dataset.pblQuoteLoopingDuration || 10000)
		const step =
			Number.isFinite(durationMs) && durationMs > 0
				? durationMs / 1000
				: 10

		let idx = 0

		if (pulser) {
			gsap.to(pulser, {
				scale: 1.5,
				duration: 0.75,
				repeat: -1,
				yoyo: true,
				ease: 'power2.inOut',
				delay: i * 0.5,
			})
		}

		gsap.timeline({ repeat: -1, delay: i * 0.5 })
			.to(text, { autoAlpha: 0, duration: 0.5 })
			.add(() => {
				idx = (idx + 1) % pulls.length
				text.textContent = pulls[idx]
			})
			.to(text, { autoAlpha: 1, duration: 0.35 })
			.to({}, { duration: Math.max(0.1, step) })
	})
}
