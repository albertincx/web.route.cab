import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

const base: any = {};
// @ts-ignore
const appUrl = process.env['VITE_API_SITE_URL'];
export default defineConfig({
    define: {
        __BUILD__: `"${new Date().toISOString()}"`,
        __VITE_ENV__: {
// @ts-ignore
            VITE_API_SITE_URL: appUrl,
        }
    },
    plugins: [
        react(),
        VitePWA({
            injectRegister: false,
            manifest: {
                short_name: 'Route.cab',
                name: 'Route.cab',
                // @ts-ignore
                url: appUrl,
                iconUrl: appUrl + "apple-touch-icon.png",
                termsOfUseUrl: appUrl + "terms.html",
                privacyPolicyUrl: appUrl + "policy.html"
            },
            manifestFilename: 'manifest.json',
        }),
    ],
    server: {
        fs: {
            allow: ['../sdk', './'],
        },
    },
    ...base,
})
