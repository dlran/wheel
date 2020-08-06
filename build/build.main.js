const rm = require('rimraf')
const configs = require('./configs')
const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const uglify = require('uglify-js')
const distPth = path.resolve(__dirname, '../', 'dist')

if (!fs.existsSync(distPth)) {
  fs.mkdirSync(distPth)
}

rm(path.resolve(distPth, './*.js'), (err) => {
  if (err) throw err
  build(configs.js)
})

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
	    built++
	    if (built < total) {
	      next()
	    }
	  }).catch(logError)
  }

  next()
}

async function buildEntry ({ input, output: outputOption }) {
  const bundle = await rollup.rollup(input)
  const { output } = await bundle.generate(outputOption)
  for (const chunkOrAsset of output) {
    console.log(chunkOrAsset.fileName)
    console.log(blue(path.relative(process.cwd(), chunkOrAsset.fileName) + ' ' + getSize(chunkOrAsset.code)))
  }
  await bundle.write(outputOption)
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
