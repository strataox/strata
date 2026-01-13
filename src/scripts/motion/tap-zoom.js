// @scripts/motion/tap-zoom.js

import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { _q, _ql } from '@scripts/utils/snips'

gsap.registerPlugin(Flip)

export function _tapZoom() {
	const images = _ql('[data-pbl-tap-zoom]')
	if (!images.length) return

	const box = _q('[data-pbl-tap-zoombox]')
	const image = box ? _q('img', box) : null
	if (!box || !image) return

	let activeItem = null

	images.forEach((item) => item.addEventListener('click', () => showBox(item)))
	box.addEventListener('click', hideBox)
	window.addEventListener('keydown', (e) => e.key === 'Escape' && hideBox())

	function showBox(item) {
		if (activeItem) return hideBox()

		const img = _q('img', item)
		if (!img) return

		activeItem = item
		openBox()

		image.src = img.currentSrc || img.src || ''

		ready(image, () => {
			Flip.fit(image, img, { scale: true })
			const state = Flip.getState(image)
			gsap.set(image, { clearProps: true })

			Flip.from(state, {
				duration: 0.35,
				ease: 'power2.inOut',
				scale: true,
			})
		})
	}

	function hideBox() {
		if (!activeItem) return

		const img = _q('img', activeItem)
		if (!img) return closeBox()

        const state = Flip.getState(image)

		Flip.fit(image, img, { scale: true })
		Flip.from(state, {
			duration: 0.4,
			ease: 'power2.inOut',
			scale: true,
			onComplete: closeBox,
			onInterrupt: closeBox,
		})
	}

	function openBox() {
		document.documentElement.classList.add('overflow-hidden')
		box.classList.remove('invisible', 'pointer-events-none')
		box.setAttribute('aria-hidden', 'false')
		gsap.to(box, { opacity: 1, duration: 0.5, ease: 'none' })
		document.addEventListener('click', onDocClick, true)
	}

	function closeBox() {
		document.removeEventListener('click', onDocClick, true)
		document.documentElement.classList.remove('overflow-hidden')
		gsap.to(box, {
			opacity: 0,
			duration: 0.4,
			ease: 'none',
			onComplete: () => {
				box.classList.add('invisible', 'pointer-events-none')
				box.setAttribute('aria-hidden', 'true')
				image.removeAttribute('src')
				activeItem = null
			},
		})
	}

	function onDocClick(e) {
		if (!activeItem) return
		if (box.contains(e.target)) return
		hideBox()
	}

	function ready(img, done) {
		if (!img.src) return done()
		img.decode ? img.decode().then(done, done) : done()
	}
}
