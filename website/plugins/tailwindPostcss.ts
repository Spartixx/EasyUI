import type { Plugin } from '@docusaurus/types';
import tailwindPostcss from '@tailwindcss/postcss';

export default function tailwindPostcssPlugin(): Plugin {
  return {
    name: 'tailwind-postcss-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.unshift(tailwindPostcss);
      return postcssOptions;
    },
  };
}
