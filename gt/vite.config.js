import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // This sets up the proxy
        proxy: {
            // Proxy all API routes to the backend server
            '/chatbox': 'http://localhost:5000',
            '/signin': 'http://localhost:5000',
            '/signup': 'http://localhost:5000',
            '/portfolio': 'http://localhost:5000',
            '/updatePortfolio': 'http://localhost:5000',
            '/news': 'http://localhost:5000',
            '/price': 'http://localhost:5000',
        },
    },
});
