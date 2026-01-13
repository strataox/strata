// @scripts/motion/tap-zoom.js

import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { _q } from '@scripts/utils/snips'

gsap.registerPlugin(Flip)

export function _tapZoom() {
	const items = gsap.utils.toArray('[data-pbl-tap-zoom]')
	if (!items.length) return

	const box = _q('[data-pbl-tap-zoombox]')
	const boxImg = box ? _q('img', box) : null
	if (!box || !boxImg) return

	let activeItem = null

	items.forEach((item) => item.addEventListener('click', () => showBox(item)))
	box.addEventListener('click', hideBox)
	window.addEventListener('keydown', (e) => e.key === 'Escape' && hideBox())

	function showBox(item) {
		if (activeItem) return hideBox()

		const img = _q('img', item)
		if (!img) return

		activeItem = item
		openBox()

		boxImg.src = img.currentSrc || img.src || ''

		ready(boxImg, () => {
			Flip.fit(boxImg, img, { scale: true })
			const state = Flip.getState(boxImg)
			gsap.set(boxImg, { clearProps: true })

			Flip.from(state, {
				duration: 0.55,
				ease: 'power2.inOut',
				scale: true,
			})
		})
	}

	function hideBox() {
		if (!activeItem) return

		const img = _q('img', activeItem)
		if (!img) return closeBox()

		const state = Flip.getState(boxImg)
		Flip.fit(boxImg, img, { scale: true })

		Flip.from(state, {
			duration: 0.5,
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
		gsap.to(box, { opacity: 1, duration: 0.18, ease: 'none' })
		document.addEventListener('click', onDocClick, true)
	}

	function closeBox() {
		document.removeEventListener('click', onDocClick, true)
		document.documentElement.classList.remove('overflow-hidden')
		gsap.to(box, {
			opacity: 0,
			duration: 0.18,
			ease: 'none',
			onComplete: () => {
				box.classList.add('invisible', 'pointer-events-none')
				box.setAttribute('aria-hidden', 'true')
				boxImg.removeAttribute('src')
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
		if (img.decode) img.decode().then(done).catch(done)
		else if (img.complete) done()
		else img.addEventListener('load', done, { once: true })
	}
}
