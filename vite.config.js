import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import path from "path"

function sslPlugin() {
  return {
    name: "vite:ssl",
    async configResolved(config) {
      const https = () => ({
        key: __dirname + "/certs/192.168.31.49.key",
        cert: __dirname + "/certs/192.168.31.49.crt"
      });
      config.server.https = Object.assign({}, config.server.https, https());
      config.preview.https = Object.assign({}, config.preview.https, https());
    }
  };
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    sslPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
