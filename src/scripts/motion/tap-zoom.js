// @scripts/motion/tap-zoom.js
import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'

export function _tapZoom() {
	const triggers = _ql('[data-pbl-tap-zoom]')
	if (!triggers.length) return

	let active = null

	const close = () => {
		if (!active) return
		const { tl, clone, backdrop, cleanup } = active

		cleanup()

		tl.eventCallback('onReverseComplete', () => {
			clone.remove()
			backdrop.remove()
			active = null
		})
		tl.reverse()
	}

	const open = (img) => {
		const rect = img.getBoundingClientRect()
		if (!rect.width || !rect.height) return

		const vw = window.innerWidth
		const vh = window.innerHeight
		const pad = Math.max(16, Math.round(vw * 0.04))

		const scale = Math.min(
			(vw - pad * 2) / rect.width,
			(vh - pad * 2) / rect.height,
		)

		const x = (vw - rect.width * scale) / 2 - rect.left
		const y = (vh - rect.height * scale) / 2 - rect.top

		const backdrop = document.createElement('div')
		backdrop.style.cssText =
			'position:fixed,inset:0'.replace(',', ';') +
			';background:rgba(0,0,0,.3);backdrop-filter:blur(14px);opacity:0;z-index:9998'

		const clone = img.cloneNode(true)
		clone.style.cssText =
			`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;` +
			'object-fit:contain;transform-origin:0 0;will-change:transform;cursor:zoom-out;z-index:9999'

		document.body.append(backdrop, clone)

		const tl = gsap.timeline({
			defaults: { ease: 'expo.inOut', duration: 0.6 },
		})

		tl.to(backdrop, { autoAlpha: 1 }, 0).to(clone, { x, y, scale }, 0)

		const onKey = (e) => e.key === 'Escape' && close()
		const onScroll = () => close()

		const cleanup = () => {
			window.removeEventListener('keydown', onKey)
			window.removeEventListener('wheel', onScroll, true)
			window.removeEventListener('touchmove', onScroll, true)
		}

		active = { tl, clone, backdrop, cleanup }

		window.addEventListener('keydown', onKey)
		window.addEventListener('wheel', onScroll, {
			capture: true,
			passive: true,
		})
		window.addEventListener('touchmove', onScroll, {
			capture: true,
			passive: true,
		})

		backdrop.addEventListener('click', close)
		clone.addEventListener('click', close)
	}

	triggers.forEach((btn) => {
		btn.style.cursor = 'zoom-in'

		btn.addEventListener('click', (e) => {
			e.preventDefault()
			if (active) return close()

			const img = _q('img', btn)
			if (img) open(img)
		})
	})
}
