// @scripts/motion/carousel.js
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import { _q, _ql } from '@scripts/utils/snips'

gsap.registerPlugin(Draggable)

export function _carousel() {
	const root = _q('[data-pbl-carousel]')
	if (!root) return


}
