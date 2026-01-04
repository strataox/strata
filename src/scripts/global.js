// @scripts/global.js

import { _loopingQuotes } from '@scripts/motion/looping-quotes'
import { _modalVideo } from '@scripts/motion/modal-video'

document.addEventListener('DOMContentLoaded', () => {
    once()
    init()
})

function init() {
    _loopingQuotes()
    _modalVideo()
}
function once() {}