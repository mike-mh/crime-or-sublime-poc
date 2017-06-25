//import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

export default {
  entry: './src/public/main.ts',
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
  globals: {
    jquery: '$'
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
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render'],
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render', 'unmountComponentAtNode'],
        'node_modules/react-hyperscript-helpers/lib/index.js': ['connect'],
        'node_modules/jQuery/lib/node-jquery.js': ['ajax'],
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