import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000';
const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@pocketledger/contracts': path.resolve(workspaceRoot, 'contracts/src/index.ts'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': {
                target: apiProxyTarget,
                changeOrigin: true,
            },
        },
    },
});
