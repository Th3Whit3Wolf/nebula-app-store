import { defineConfig } from "unocss";

import presetIcons from "@unocss/preset-icons";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { presetAstro } from "unocss-preset-astro";
export default defineConfig({
  rules: [["logo", { transform: "scale(1.1)" }]],
  presets: [
    presetAstro(),
    presetIcons({
      scale: 1.2,
      unit: "em",
      extraProperties: {
        height: "1.2em",
        width: "1.2em",

        // ℹ️ We also have to find a way to inject this without this config. (e.g. [class^=i-])
        "vertical-align": "text-top",
        "flex-shrink": "0",
        display: "inline-block",
      },
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
