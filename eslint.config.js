import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import standard from "eslint-config-standard";

export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Reglas básicas de estilo
      "semi": ["error", "never"],  // Sin punto y coma
      "indent": ["error", 2],      // Indentación de 2 espacios
      "no-trailing-spaces": "error", // No trailing spaces
      "comma-dangle": ["error", "never"], // Sin comas al final
      "quotes": ["error", "single"],  // Comillas simples
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  standard
];