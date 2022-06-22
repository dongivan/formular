import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import eslintPlugin from "vite-plugin-eslint";

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin()],
  build: {
    lib: {
      entry: resolvePath("src/models/index.ts"),
      name: "lib",
      fileName: (format) => `lib.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
