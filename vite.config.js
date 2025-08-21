import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/", 
  build: {
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "pages/services.html"),
        contact_us: resolve(__dirname, "pages/contact_us.html"),
        blog: resolve(__dirname, "pages/blog.html"),
      },
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
