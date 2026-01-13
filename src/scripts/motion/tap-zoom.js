// @scripts/motion/tap-zoom.js
import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { _ql, _q } from '@scripts/utils/snips'

gsap.registerPlugin(Flip)

export function _tapZoom() {
	const imgs = _ql('img[data-pbl-tap-zoom]')
	if (!imgs.length) return

	
}
