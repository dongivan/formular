import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      svgoOptions: false,
      iconDirs: [path.resolve(__dirname, "./src/components/input-pad/svgs")],
      symbolId: "icon-[dir]-[name]",
      inject: "body-first",
      customDomId: "__svg__icons__dom__",
    }),
    eslintPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
