// @scripts/motion/looping-quotes.js

import gsap from 'gsap'
import { _ql } from '@scripts/utils/snips'

export function _loopingQuotes() {
	const quotes = _ql('[data-pbl-quote]')
	if (!quotes.length) return

	console.log('[motion] looping quotes init', quotes.length)

	quotes.forEach((root, i) => {
		const text = root.querySelector('[data-pbl-quote-text]')
		const pulser = root.querySelector('[data-pbl-quote-pulser]')
		if (!text) return

		let pulls = []
		try {
			pulls = JSON.parse(root.dataset.pblQuotePulls || '[]')
		} catch {
			pulls = []
		}

		if (!Array.isArray(pulls) || pulls.length <= 1) return

		const durationMs = Number(root.dataset.pblQuoteDuration || 1000)
		const step =
			Number.isFinite(durationMs) && durationMs > 0
				? durationMs / 1000
				: 1

		let idx = 0

		gsap.timeline({ repeat: -1, delay: i * 0.5 })
			.to(text, { autoAlpha: 0, duration: 0.25 })
			.add(() => {
				idx = (idx + 1) % pulls.length
				text.textContent = `"${pulls[idx]}"`
			})
			.to(text, { autoAlpha: 1, duration: 0.25 })
			.to(
				pulser,
				{ scale: 1.35, duration: 0.1, yoyo: true, repeat: 1 },
				'>',
			)
			.to({}, { duration: Math.max(0.1, step) })
	})
}
