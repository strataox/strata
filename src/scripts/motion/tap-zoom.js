// @scripts/motion/tap-zoom.js
import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { _ql, _q } from '@scripts/utils/snips'

gsap.registerPlugin(Flip)

export function _tapZoom() {
	const imgs = _ql('img[data-pbl-tap-zoom]')
	if (!imgs.length) return

	const detail = _q('[data-pbl-tap-zoom-detail]')
	const detailImg = _q('[data-pbl-tap-zoom-detail-img]', detail)
	if (!detail || !detailImg) return

	let activeItem = null
	let isOpen = false
	let isAnimating = false

	const setClosedState = () => {
		gsap.set(detail, { autoAlpha: 0, visibility: 'hidden' })
		detail.classList.add('pointer-events-none')
	}

	const setOpenState = () => {
		gsap.set(detail, { autoAlpha: 1, visibility: 'visible' })
		detail.classList.remove('pointer-events-none')
	}

	const close = () => {
		if (!isOpen || !activeItem || isAnimating) return
		isAnimating = true

		const state = Flip.getState(detail)

		Flip.fit(detail, activeItem, { scale: true, fitChild: detailImg })

		Flip.from(state, {
			duration: 0.55,
			ease: 'power2.inOut',
			scale: true,
			onComplete: () => {
				setClosedState()
				activeItem = null
				isOpen = false
				isAnimating = false
			},
		})
	}

	const open = (itemImg) => {
		if (isOpen || isAnimating) return
		isAnimating = true
		activeItem = itemImg

		// ensure image is loaded so Flip.fit has correct natural sizing
		const src = itemImg.currentSrc || itemImg.src
		if (!src) {
			isAnimating = false
			return
		}

		const onReady = () => {
			detailImg.removeEventListener('load', onReady)

			Flip.fit(detail, itemImg, { scale: true, fitChild: detailImg })

			const state = Flip.getState(detail)

			// final layout, centered and constrained, like the demo but responsive
			gsap.set(detail, {
				clearProps: true,
				xPercent: -50,
				left: '50%',
				top: '50%',
				yPercent: -50,
				visibility: 'visible',
				overflow: 'hidden',
			})

			setOpenState()

			Flip.from(state, {
				duration: 0.55,
				ease: 'power2.inOut',
				scale: true,
				onComplete: () => {
					isOpen = true
					isAnimating = false
				},
			})
		}

		detailImg.addEventListener('load', onReady)
		detailImg.src = src
	}

	const activate = (img) => {
		if (isOpen) return close()
		open(img)
	}

	const onKey = (e) => {
		if (e.key === 'Escape') close()
	}

	const onScrollIntent = () => close()

	// init
	setClosedState()

	window.addEventListener('keydown', onKey)
	window.addEventListener('wheel', onScrollIntent, {
		capture: true,
		passive: true,
	})
	window.addEventListener('touchmove', onScrollIntent, {
		capture: true,
		passive: true,
	})
	window.addEventListener('scroll', onScrollIntent, true)

	detail.addEventListener('click', close)

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
}
