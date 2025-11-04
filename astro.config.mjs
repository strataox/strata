import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
    site: 'https://brand.strata.ng',
    integrations: [
        mdx({
            ignoreIndentation: true
        }),
        sitemap()
    ],
    build: {
        format: 'preserve'
    },
    vite: {
        plugins: [tailwindcss()]
    },
    devToolbar: {
        enabled: false,
    }
})