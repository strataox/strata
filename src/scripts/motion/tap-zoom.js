// @scripts/motion/tap-zoom.js
import gsap from 'gsap'
import { _ql, _q } from '@scripts/utils/snips'

export function _tapZoom() {
	const triggers = _ql('[data-pbl-tap-zoom]')
	if (!triggers.length) return

	let active = null

	const close = () => {
		if (!active) return

		const { clone, backdrop, cleanup } = active
		cleanup()

		gsap.to(backdrop, {
			autoAlpha: 0,
			duration: 0.18,
			ease: 'none',
		})

		gsap.to(clone, {
			x: 0,
			y: 0,
			scale: 1,
			duration: 0.5,
			ease: 'expo.inOut',
			onComplete: () => {
				clone.remove()
				backdrop.remove()
				active = null
			},
		})
	}

	const open = (img) => {
		const startRect = img.getBoundingClientRect()
		const w = startRect.width
		const h = startRect.height
		if (!w || !h) return

		const vw = window.innerWidth
		const vh = window.innerHeight

		const pad = Math.max(16, Math.round(vw * 0.04))
		const maxW = vw - pad * 2
		const maxH = vh - pad * 2

		// contain within viewport, still feels like "fills width" when height allows
		const scale = Math.min(maxW / w, maxH / h)

		const targetW = w * scale
		const targetH = h * scale
		const targetLeft = (vw - targetW) / 2
		const targetTop = (vh - targetH) / 2

		const x = targetLeft - startRect.left
		const y = targetTop - startRect.top

		const backdrop = document.createElement('div')
		backdrop.setAttribute('data-pbl-tap-zoom-backdrop', 'true')
		backdrop.style.position = 'fixed'
		backdrop.style.inset = '0'
		backdrop.style.background = 'rgba(0,0,0,0.55)'
		backdrop.style.backdropFilter = 'blur(10px)'
		backdrop.style.webkitBackdropFilter = 'blur(10px)'
		backdrop.style.opacity = '0'
		backdrop.style.zIndex = '9998'

		const clone = img.cloneNode(true)
		clone.setAttribute('data-pbl-tap-zoom-clone', 'true')
		clone.style.position = 'fixed'
		clone.style.left = `${startRect.left}px`
		clone.style.top = `${startRect.top}px`
		clone.style.width = `${w}px`
		clone.style.height = `${h}px`
		clone.style.objectFit = 'contain'
		clone.style.margin = '0'
		clone.style.zIndex = '9999'
		clone.style.transformOrigin = '0 0'
		clone.style.willChange = 'transform'
		clone.style.cursor = 'zoom-out'
		clone.style.borderRadius = 'inherit'

		document.body.appendChild(backdrop)
		document.body.appendChild(clone)

		const onKey = (ev) => {
			if (ev.key === 'Escape') close()
		}

		const onScroll = () => close()

		const cleanup = () => {
			window.removeEventListener('keydown', onKey)
			window.removeEventListener('scroll', onScroll, true)
			window.removeEventListener('wheel', onScroll, true)
			window.removeEventListener('touchmove', onScroll, true)
		}

		active = { clone, backdrop, cleanup }

		window.addEventListener('keydown', onKey)
		window.addEventListener('scroll', onScroll, true)
		window.addEventListener('wheel', onScroll, true)
		window.addEventListener('touchmove', onScroll, true)

		backdrop.addEventListener('click', close, { once: true })
		clone.addEventListener('click', close)

		gsap.set(backdrop, { autoAlpha: 0 })
		gsap.to(backdrop, { autoAlpha: 1, duration: 0.18, ease: 'none' })

		gsap.fromTo(
			clone,
			{ x: 0, y: 0, scale: 1 },
			{
				x,
				y,
				scale,
				duration: 0.65,
				ease: 'expo.inOut',
			},
		)
	}

	triggers.forEach((btn) => {
		btn.style.cursor = 'zoom-in'

		btn.addEventListener('click', (e) => {
			e.preventDefault()

			if (active) return close()

			const img = _q('img', btn)
			if (!img) return

			open(img)
		})
	})
}
