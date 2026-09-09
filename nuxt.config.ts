import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
    alias: {
        '~~': fileURLToPath(new URL('../', import.meta.url)),
    },
    modules: ['@comark/nuxt'],
    imports: {
        dirs: ['models', 'models/**'],
    },
    tailwindcss: {
        config: {
            content: [
                fileURLToPath(new URL('./components/**/*.{vue,js,ts}', import.meta.url)),
                fileURLToPath(new URL('./pages/**/*.{vue,js,ts}', import.meta.url)),
            ],
        },
    },
    typescript: {
        tsConfig: {
            include: ['./models/**/*.ts'],
        },
    },
});
