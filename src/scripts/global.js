// @scripts/global.js

import { _loopingQuotes } from '@scripts/motion/looping-quotes'
import { _reelReveal } from '@scripts/motion/real-reveal'

document.addEventListener('DOMContentLoaded', () => {
    once()
    init()
})

function init() {
    _loopingQuotes()
    _reelReveal()
}
function once() {}