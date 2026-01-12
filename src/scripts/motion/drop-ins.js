// @scripts/motion/drop-ins.js
import { _staggerIn } from '@scripts/motion/stagger-in'
import { _tapZoom } from '@scripts/motion/tap-zoom'

export function _dropIns() {
	const reduceMotion =
		globalThis.matchMedia &&
		globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduceMotion) return

    _staggerIn()
    _tapZoom()
}
