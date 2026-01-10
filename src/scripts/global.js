// @scripts/global.js

import { _loopingQuotes } from '@scripts/motion/looping-quotes'
import { _reelReveal } from '@scripts/motion/real-reveal'
import { _revealZoom } from '@scripts/motion/reveal-zoom'

document.addEventListener('DOMContentLoaded', () => {
    once()
    init()
})

function init() {
    _loopingQuotes()
    _reelReveal()
    _revealZoom()
}

function once() {}