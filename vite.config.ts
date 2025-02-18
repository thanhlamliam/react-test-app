import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import basicSsl from '@vitejs/plugin-basic-ssl';
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      // "X-Frame-Options": "ALLOW-FROM http://localhost:3000", // Stops your site being used as an iframe
    },
  },
  plugins: [react(), tsconfigPaths(), svgr()],
});
