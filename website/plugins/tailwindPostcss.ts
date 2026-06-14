import type { Plugin } from '@docusaurus/types';

export default function tailwindPostcssPlugin(): Plugin {
  return {
    name: 'tailwind-postcss-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.unshift(require('@tailwindcss/postcss'));
      return postcssOptions;
    },
  };
}
