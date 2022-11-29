import dotenv from "dotenv";
import solid from "solid-start/vite";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [
      tsconfigPaths(),
      solid({ ssr: true, islands: true, islandsRouter: true }),
      UnoCSS(),
    ],
    ssr: { external: ["@prisma/client"] },
    test: {
      deps: {
        registerNodeLoader: true,
      },
      environment: "jsdom",
      globals: true,
      setupFiles: ["node_modules/@testing-library/jest-dom/extend-expect"],
      transformMode: { web: [/\.[jt]sx?$/] },
    },
  };
});
