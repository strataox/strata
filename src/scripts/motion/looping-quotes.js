// @scripts/motion/looping-quotes.js

import gsap from 'gsap'
import { _ql } from '@scripts/utils/snips'

export function _loopingQuotes() {
	const quotes = _ql('[data-pbl-quote]')
	if (!quotes.length) return

	console.log('[motion] looping quotes init', quotes.length)
}