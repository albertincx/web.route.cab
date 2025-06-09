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
