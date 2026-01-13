// @scripts/motion/tap-zoom.js

import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { _ql, _q } from '@scripts/utils/snips'

gsap.registerPlugin(Flip)

export function _tapZoom() {
    const items = gsap.utils.toArray('[data-pbl-tap-zoom]')
	const box = _q('[data-pbl-tap-zoombox]')
	const boxImg = _q('img', box)

	let activeItem = null

	function showBox(item) {
		if (!box || !boxImg) return
		if (activeItem) return hideBox()

		const img = _q('img', item)
		if (!img) return

		const onLoad = () => {
            Flip.fit(box, item, { scale: true, fitChild: boxImg })

			const state = Flip.getState(box)
			gsap.set(box, { clearProps: true })
			gsap.set(box, {
				visibility: 'visible',
				overflow: 'hidden',
			})

			Flip.from(state, {
				duration: 0.3,
				ease: 'power2.inOut',
				scale: true,
				onComplete: () => gsap.set(box, { overflow: 'hidden' }),
			})

			boxImg.removeEventListener('load', onLoad)
			document.addEventListener('click', hideBox)
		}

		// Swap only the image
		boxImg.addEventListener('load', onLoad)
		boxImg.src = img.src

		gsap.to(items, {
			opacity: 0.3,
		}).kill(item)

		activeItem = item
	}

	function hideBox() {
		if (!box || !boxImg || !activeItem) return

		document.removeEventListener('click', hideBox)
		gsap.set(box, { overflow: 'hidden' })

		const state = Flip.getState(box)

		Flip.fit(box, activeItem, { scale: true, fitChild: boxImg })

		const tl = gsap.timeline()
		tl.to(items, {
			opacity: 1,
		})

		Flip.from(state, {
			scale: true,
			duration: 0.3,
			onInterrupt: () => tl.kill(),
		}).set(box, { visibility: 'hidden' })

		activeItem = null
	}

	items.forEach((item) =>
		item.addEventListener('click', () => showBox(item)),
	)
}
