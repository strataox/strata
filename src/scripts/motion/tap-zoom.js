// @scripts/motion/tap-zoom.js
import gsap from 'gsap'
import { _ql } from '@scripts/utils/snips'

export function _tapZoom() {
	const imgs = _ql('[data-pbl-tap-zoom]')
    if (!imgs.length) return

    imgs.forEach((img) => {
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

	function close() {
		if (!active) return

		const { tl, cleanup } = active
		cleanup()

		tl.eventCallback('onReverseComplete', () => {
			active.backdrop.remove()
			active.clone.remove()
			active = null
		})

		tl.reverse()
	}

	function open(img) {
		const rect = img.getBoundingClientRect()
		if (!rect.width || !rect.height) return

		const vw = window.innerWidth
		const vh = window.innerHeight
		const pad = Math.max(16, Math.round(vw * 0.04))

		const maxW = vw - pad * 2
		const maxH = vh - pad * 2
		const scale = Math.min(maxW / rect.width, maxH / rect.height)

		const targetW = rect.width * scale
		const targetH = rect.height * scale
		const x = (vw - targetW) / 2 - rect.left
		const y = (vh - targetH) / 2 - rect.top

		const backdrop = document.createElement('div')
		backdrop.setAttribute('data-pbl-tap-zoom-backdrop', 'true')
		backdrop.style.position = 'fixed'
		backdrop.style.inset = '0'
		backdrop.style.background = 'rgba(0,0,0,0.30)'
		backdrop.style.backdropFilter = 'blur(14px)'
		backdrop.style.webkitBackdropFilter = 'blur(14px)'
		backdrop.style.opacity = '0'
		backdrop.style.zIndex = '9998'
		backdrop.style.cursor = 'zoom-out'

		const clone = img.cloneNode(true)
		clone.setAttribute('data-pbl-tap-zoom-clone', 'true')
		clone.style.position = 'fixed'
		clone.style.left = `${rect.left}px`
		clone.style.top = `${rect.top}px`
		clone.style.width = `${rect.width}px`
		clone.style.height = `${rect.height}px`
		clone.style.objectFit = 'contain'
		clone.style.margin = '0'
		clone.style.transformOrigin = '0 0'
		clone.style.willChange = 'transform'
		clone.style.zIndex = '9999'
		clone.style.cursor = 'zoom-out'
		clone.style.pointerEvents = 'auto'

		document.body.append(backdrop, clone)

		gsap.set(backdrop, { autoAlpha: 0 })
		gsap.set(clone, { x: 0, y: 0, scale: 1, force3D: true })

		// Prevent the first-frame hesitation
		clone.getBoundingClientRect()

		const tl = gsap.timeline({
			paused: true,
			defaults: { ease: 'expo.inOut', duration: 0.55 },
		})

		tl.to(backdrop, { autoAlpha: 1, duration: 0.18, ease: 'none' }, 0)
		tl.to(clone, { x, y, scale }, 0)

		function onKey(e) {
			if (e.key === 'Escape') close()
		}

		function onScrollIntent() {
			close()
		}

		function cleanup() {
			window.removeEventListener('keydown', onKey)
			window.removeEventListener('scroll', onScrollIntent, true)
			window.removeEventListener('wheel', onScrollIntent, true)
			window.removeEventListener('touchmove', onScrollIntent, true)
		}

		active = { tl, clone, backdrop, cleanup }

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

		backdrop.addEventListener('click', close, { once: true })
		clone.addEventListener('click', close)

		tl.play(0)
	}

	function activate(img) {
		if (active) return close()
		open(img)
	}


}
