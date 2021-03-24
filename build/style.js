const sass = require('node-sass')
const path = require('path')
const fs = require('fs')
const cleanCSS = require('clean-css')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const rm = require('rimraf')
const configs = require('./configs')
const distPth = path.resolve(__dirname, '../', 'dist')


if (!fs.existsSync(distPth)) {
  fs.mkdirSync(distPth)
}

rm(path.resolve(distPth, './**/*.?(woff2?|eot|ttf|otf|svg|css)'), (err) => {
  if (err) throw err
  compile(configs.css)
})

function compile (build) {
  sass.render({
	  file: build.input,
	  precision: 8
  }, function (err, result) {
    if (!err) {
      post(result.css, build)
    }
  })
}

function post (code, {input, output}) {
    postcss([autoprefixer])
      .process(code, { from: input, to: output })
      .then(result => {
          write(output, clean(result.css))
      })
}

function clean (bundle) {
  return new cleanCSS({
    level: {
	    1: {
	    }
	  }
  }).minify(bundle).styles
}

function write (dest, code) {
  fs.writeFile(dest, code, (err) => {
    if (err) throw err

    console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code))
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
