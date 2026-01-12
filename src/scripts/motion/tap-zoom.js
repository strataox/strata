// @scripts/motion/tap-zoom.js
import gsap from 'gsap'
import { _ql } from '@scripts/utils/snips'

export function _tapZoom() {
	const imgs = _ql('img[data-pbl-tap-zoom]')
	if (!imgs.length) return

	imgs.forEach((img) => {
		img.style.cursor = 'zoom-in'
		img.tabIndex = img.tabIndex || 0

		img.addEventListener('click', (e) => {
			e.preventDefault()
			activate(img)
		})

		img.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter' && e.key !== ' ') return
			e.preventDefault()
			activate(img)
		})
	})

	let active = null

	function activate(img) {
		if (active) return close()
		open(img)
	}

	function close() {
		if (!active) return

		const { tl, overlay, clone, cleanup } = active
		cleanup()

		tl.eventCallback('onReverseComplete', () => {
			overlay.remove()
			clone.remove()
			active = null
		})

		tl.reverse()
	}

	function open(img) {
		const rect = img.getBoundingClientRect()
		const w = rect.width
		const h = rect.height
		if (!w || !h) return

		const vw = window.innerWidth
		const vh = window.innerHeight
		const pad = Math.max(16, Math.round(vw * 0.04))

		const maxW = vw - pad * 2
		const maxH = vh - pad * 2
		const scale = Math.min(maxW / w, maxH / h)

		const targetW = w * scale
		const targetH = h * scale
		const x = (vw - targetW) / 2 - rect.left
		const y = (vh - targetH) / 2 - rect.top

		const overlay = document.createElement('div')
		overlay.setAttribute('data-pbl-tap-zoom-overlay', 'true')
		overlay.style.cssText =
			'position:fixed;inset:0;z-index:9998;' +
			'background:rgba(0,0,0,.30);' +
			'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
			'cursor:zoom-out;opacity:0;'

		const clone = img.cloneNode(true)
		clone.setAttribute('data-pbl-tap-zoom-clone', 'true')
		clone.style.cssText =
			`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${w}px;height:${h}px;` +
			'object-fit:contain;margin:0;z-index:9999;' +
			'transform-origin:0 0;will-change:transform;cursor:zoom-out;' +
			'transform:translate3d(0,0,0) scale(1);'

		document.body.append(overlay, clone)

		// prevent first-frame hesitation
		clone.getBoundingClientRect()

		function onKey(e) {
			if (e.key === 'Escape') close()
		}

		function onScrollIntent() {
			close()
		}

		function onOverlayClick(e) {
			if (e.target !== overlay) return
			close()
		}

		function cleanup() {
			window.removeEventListener('keydown', onKey)
			window.removeEventListener('scroll', onScrollIntent, true)
			window.removeEventListener('wheel', onScrollIntent, true)
			window.removeEventListener('touchmove', onScrollIntent, true)
			overlay.removeEventListener('click', onOverlayClick)
			clone.removeEventListener('click', close)
		}

		const tl = gsap.timeline({
			paused: true,
			defaults: { ease: 'expo.inOut', duration: 0.55 },
		})

		tl.to(overlay, { autoAlpha: 1, duration: 0.18, ease: 'none' }, 0)
		tl.to(clone, { x, y, scale, force3D: true }, 0)

		active = { tl, overlay, clone, cleanup }

		window.addEventListener('keydown', onKey)
		window.addEventListener('scroll', onScrollIntent, true)
		window.addEventListener('wheel', onScrollIntent, {
			capture: true,
			passive: true,
		})
		window.addEventListener('touchmove', onScrollIntent, {
			capture: true,
			passive: true,
		})

		overlay.addEventListener('click', onOverlayClick)
		clone.addEventListener('click', close)

		tl.play(0)
	}
}
