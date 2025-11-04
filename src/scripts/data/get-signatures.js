// @scripts/data/get-signatures.js

import { getCollection } from 'astro:content'

export async function _getSignatures() {
    let signatures = await getCollection('signatures', ({ data }) => data.draft !== true)

    return signatures
}
