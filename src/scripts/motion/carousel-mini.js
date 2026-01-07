// @scripts/motion/carousel-mini.js

import gsap from 'gsap'
import { _q, _ql } from '@scripts/utils/snips'

export function _carouselMini() {
	const root = _q('[data-pbl-cmini]')
	if (!root) return

	const imgs = _ql('[data-pbl-cmini-img]', root)
	const btns = _ql('[data-pbl-cmini-btn]', root)
	if (imgs.length < 3 || btns.length < 2) return

	let pool = []
	try {
		pool = JSON.parse(root.dataset.pblCminiImages || '[]')
	} catch {
		pool = []
	}

	if (!Array.isArray(pool) || pool.length < 3) return

	const imgLeft = _q('[data-pbl-cmini-img][data-pbl-cmini-slot="left"]', root)
	const imgActive = _q(
		'[data-pbl-cmini-img][data-pbl-cmini-slot="active"]',
		root,
	)
	const imgRight = _q(
		'[data-pbl-cmini-img][data-pbl-cmini-slot="right"]',
		root,
	)

	const btnLeft = _q('[data-pbl-cmini-btn][data-pbl-cmini-slot="left"]', root)
	const btnRight = _q(
		'[data-pbl-cmini-btn][data-pbl-cmini-slot="right"]',
		root,
	)

	if (!imgLeft || !imgActive || !imgRight || !btnLeft || !btnRight) return

	let isBusy = false

	// start aligned with the first three items already rendered
	let iLeft = 0
	let iActive = 1
	let iRight = 2

	const wrap = (n) => {
		const len = pool.length
		return ((n % len) + len) % len
	}

	const setImg = (img, idx) => {
		const item = pool[idx]
		if (!item) return
		img.src = item.src
		img.alt = item.alt || ''
	}

	const swap3 = ({ nextLeft, nextActive, nextRight, dir }) => {
		if (isBusy) return
		isBusy = true

		const ease = 'power3.out'
		const dur = 0.28
		const nudge = dir === 'next' ? -18 : 18

		const tl = gsap.timeline({
			onComplete: () => {
				isBusy = false
			},
		})

		// Fade out active and the side we are pulling from, then swap sources, then fade in with a nudge
		tl.to([imgActive, dir === 'next' ? imgRight : imgLeft], {
			autoAlpha: 0,
			duration: dur * 0.6,
			ease,
		})

		tl.add(() => {
			iLeft = nextLeft
			iActive = nextActive
			iRight = nextRight

			setImg(imgLeft, iLeft)
			setImg(imgActive, iActive)
			setImg(imgRight, iRight)

			gsap.set([imgLeft, imgActive, imgRight], { x: 0 })
			gsap.set(imgActive, { x: -nudge })
			gsap.set(dir === 'next' ? imgRight : imgLeft, { x: nudge })
		})

		tl.to([imgActive, imgLeft, imgRight], {
			autoAlpha: 1,
			x: 0,
			duration: dur,
			ease,
			clearProps: 'x',
		})
	}

	const next = () => {
		const nextActive = wrap(iActive + 1)
		const nextRight = wrap(iRight + 1)
		const nextLeft = iActive

		swap3({
			nextLeft,
			nextActive,
			nextRight,
			dir: 'next',
		})
	}

	const prev = () => {
		const nextActive = wrap(iActive - 1)
		const nextLeft = wrap(iLeft - 1)
		const nextRight = iActive

		swap3({
			nextLeft,
			nextActive,
			nextRight,
			dir: 'prev',
		})
	}

	btnRight.addEventListener('click', next)
	btnLeft.addEventListener('click', prev)
}
