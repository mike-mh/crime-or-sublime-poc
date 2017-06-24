//import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

export default {
  entry: './src/public/index.ts',
  dest: 'dist/public/build.js', // output a single application bundle
  sourceMap: false,
  format: 'iife',
  onwarn: function (warning) {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }

    // console.warn everything else
    console.warn(warning.message);
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig-react.json"
    }),
    nodeResolve({ jsnext: true, module: true }),
    commonjs({
      include: [
        'node_modules/**'
      ],
      exclude: [
        'node_modules/process-es6/**'
      ],
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render'],
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render'],
        'node_modules/react-hyperscript-helpers/lib/index.js': [
          'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo',
          'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col',
          'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
          'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
          'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins',
          'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem',
          'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
          'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select',
          'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td',
          'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'video',
          'wbr', 'circle', 'clipPath', 'defs', 'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask',
          'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
        ]
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    /* uglify({
       compress: {
         screw_ie8: true,
         warnings: false
       },
       output: {
         comments: false
       },
       sourceMap: false
     })*/
  ]
}