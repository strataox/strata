// @scripts/global.js

import { _loopingQuotes } from '@scripts/motion/looping-quotes'
import { _reelReveal } from '@scripts/motion/real-reveal'
import { _carousel } from '@scripts/motion/carousel'

document.addEventListener('DOMContentLoaded', () => {
    once()
    init()
})

function init() {
    _loopingQuotes()
    _reelReveal()
    _carousel()
}
function once() {}