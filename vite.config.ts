import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import eslintPlugin from "vite-plugin-eslint";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      svgoOptions: false,
      iconDirs: [path.resolve(__dirname, "./src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
      inject: "body-first",
      customDomId: "__svg__icons__dom__",
    }),
    eslintPlugin(),
    process.env.npm_lifecycle_event == "analyze"
      ? visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      : undefined,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
