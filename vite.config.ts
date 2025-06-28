import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/time-converter-tool-new-/', // ⚠️ 請務必對應你實際 repo 名稱
});
