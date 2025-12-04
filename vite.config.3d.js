import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    // 可以添加其他插件，如vue插件等，如果需要的话
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.3d.js'),
      name: 'mapv',
      formats: ['umd'],
      fileName: (format, entryName) => 'mapv.3d.js'
    },
    rollupOptions: {
      external: [
        'maptalks',
        'openlayers',
        'leaflet'
      ],
      output: {
        globals: {
          openlayers: 'ol',
          leaflet: 'L',
          maptalks: 'maptalks'
        }
      }
    },
    outDir: 'build',
    sourcemap: true
  }
});
