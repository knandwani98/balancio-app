const { createJiti } = require("jiti");

const jiti = createJiti(__filename);
const {
  colors,
  spacing,
  borderRadius,
  fontSize,
  letterSpacing,
  boxShadow,
} = jiti("./utils/constants.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      fontSize,
      letterSpacing,
      boxShadow,
    },
  },
};
