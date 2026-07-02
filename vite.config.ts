import { defineConfig } from 'vite';

export default defineConfig({
    root: 'example',
    server: {
    proxy: {
        '/api': {
            target: 'https://api.noscrape.eu',
            changeOrigin: true,
        },
    },
}
});
