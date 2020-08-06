const path = require('path')
const buble = require('@rollup/plugin-buble')
const { uglify } = require('rollup-plugin-uglify')

const resolve = _path => path.resolve(__dirname, '../', _path)

const JSOptions = {
  umdDev: {
    input: resolve('src/index.js'),
    file: resolve('dist/wheel.js'),
    format: 'umd'
  },
  umdPord: {
    input: resolve('src/index.js'),
    file: resolve('dist/wheel.min.js'),
    format: 'umd',
    plugins: [uglify()]
  },
  esm: {
    input: resolve('src/index.js'),
    file: resolve('dist/wheel.esm.js'),
    format: 'es'
  }
}

const CSSOptions = {
  input: path.resolve(__dirname, '../src/theme/index.scss'),
  output: path.resolve(__dirname, '../release/cdm-ui.css')
}

function genConfig (opt) {
  return {
    input: {
      input: opt.input,
      plugins: [ buble(), ...(opt.plugins || []) ]
    },
    output: {
      file: opt.file,
      format: opt.format,
      name: 'wheel'
    }
  }
}

function mapOpts (opts, fn) {
  return Object.keys(opts).map(key => {
    return fn(opts[key])
  })
}

module.exports = {
  js: mapOpts(JSOptions, genConfig),
  // css: CSSOptions
}
