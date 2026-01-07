// @scripts/global.js

import { _loopingQuotes } from '@scripts/motion/looping-quotes'
import { _reelReveal } from '@scripts/motion/real-reveal'
import { _carouselMini } from '@scripts/motion/carousel-mini'

document.addEventListener('DOMContentLoaded', () => {
    once()
    init()
})

function init() {
    _loopingQuotes()
    _reelReveal()
    _carouselMini()
}
function once() {}