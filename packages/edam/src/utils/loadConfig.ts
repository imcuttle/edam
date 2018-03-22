const JSON5 = require('json5')
const nps = require('path')
const fileSystem = require('./fileSystem')

type Options = {
  cwd: string
}

function isJSFile(filename: string): boolean {
  return ['.js', '.jsx'].includes(
    nps.extname(filename).toLowerCase()
  )
}

module.exports = async function loadConfig(
  path: string,
  options: Options = {
    cwd: process.cwd(),
  }
): Promise<any> {
  const { cwd } = options
  let filename = nps.resolve(cwd, path)
  // nodejs module algorithm
  filename = require.resolve(filename)
  if (isJSFile(filename)) {
    // Should removes cache in file watcher
    // delete require.cache[filename]

    return require(filename)
  }
  return JSON5.parse(
    await fileSystem.readFile(filename, { encoding: 'utf8' })
  )
}
