import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'apexcharts': 'apexcharts/dist/apexcharts.min.js'
    }
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: "https://48a5-150-107-43-54.ngrok-free.app", // Backend server URL
  //       changeOrigin: true,
  //       secure: true,
  //       // This option allows cookies to be sent when proxying
  //       configure: (proxy, options) => {
  //         proxy.on('proxyReq', (proxyReq, req, res) => {
  //           proxyReq.setHeader('origin', "https://astounding-bonbon-431166.netlify.app/");
  //         });
  //       },
  //     },
  //   },
  // },
})
