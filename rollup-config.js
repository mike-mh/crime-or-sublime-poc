//import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

export default {
  entry: 'compiled_app/src/public/app/main.js',
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
    commonjs({
      include: ['node_modules/rxjs/**', 'compiled_app/configurations/**'],
      namedExports: {
        'email-validator': [ 'validate' ]
      }
    }),
    json({
      include: 'compiled_app/configurations/**', 
      preferConst: true,
    }),
    nodeResolve({ jsnext: true, module: true }),
    uglify()
  ]
}