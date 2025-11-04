// @scripts/utils/link-schema.ts

import { z } from 'zod'

export function _linkSchema() {
	return z.object({
		label: z.string(),
		href: z
			.string()
			.refine(
				(val) => val.startsWith('/') || val.startsWith('http') || val === '#',
				{ message: 'Link must be a valid relative or absolute URL' },
			),
	})
}
