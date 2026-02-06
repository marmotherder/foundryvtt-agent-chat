const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
module.exports = {
  input: 'dist/src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  // Do not mark dependencies as external so they get bundled
  external: [],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
  ]
};
