// @scripts/global.js

import { _loopingQuotes } from '@scripts/motion/looping-quotes'

document.addEventListener('DOMContentLoaded', () => {
    once()
    init()
})

function init() {
    _loopingQuotes()
}
function once() {}