import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import ta from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), ta()],
});
