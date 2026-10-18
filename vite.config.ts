// @ts-ignore
import path from 'path';
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import ta from "@tailwindcss/vite";

// https://vite.dev/config/
// @ts-ignore
export default ({mode}) => defineConfig({
    plugins: [react(), ta()],
    build: {
        rollupOptions: {
            // @ts-ignore
            input: path.resolve(__dirname, 'dev.html'),
        },
    },
    // 2. Для разработки (vite dev): открывать сразу dev.html
    server: {
        open: '/dev.html',
    },
    resolve: {
        alias: {
            // @ts-ignore
            '@': path.resolve(__dirname, './src'),
        },
    },
    esbuild: mode === 'production' ? {
        drop: ['console', 'debugger'],
    } : {
        supported: {
            'top-level-await': true
        },
    },
    optimizeDeps: mode !== 'production' ? {
        esbuildOptions: {
            supported: {
                "top-level-await": true
            },
        },
    } : {},
});
