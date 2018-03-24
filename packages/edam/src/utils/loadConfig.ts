import { Options } from '../lib/normalizeSource'

const JSON5 = require('json5')
const cosmiconfig = require('cosmiconfig')
const nps = require('path')
const fileSystem = require('./fileSystem').default

const explorer = cosmiconfig('edam')

async function parseJSONFile(filename) {
  try {
    const text = await fileSystem.readFile(filename, { encoding: 'utf8' })
    return JSON5.parse(text)
  } catch (err) {
    throw new Error(`${err.message} in file: "${filename}"`)
  }
}

function getMatchJSONErrorFilename(err): string|null {
  // Error: Failed to parse "/Users/yucong02/self/edam/packages/edam/src/__test__/fixture/loadConfig/.filerc" as JSON, JS, or YAML.
  if (/Failed to parse "(.+)" as JSON, JS, or YAML\.$/.test(err.message)) {
    return RegExp.$1
  }
  if (/JSON Error in (.+):/.test(err.message)) {
    return RegExp.$1
  }
}

export async function load(searchPath?: string): Promise<any> {
  try {
    const { config, filepath } = await explorer.load(searchPath)
    return { config, filepath }
  } catch (err) {
    const filename = getMatchJSONErrorFilename(err)
    if (filename) {
      return {
        config: await parseJSONFile(filename),
        filepath: filename
      }
    }
    throw err
  }
}

export async function loadConfig(
  path: string,
  options: Options & { filename?: boolean } = {
    cwd: process.cwd(),
    filename: false
  }
): Promise<any> {
  const { cwd } = options
  let filename = nps.resolve(cwd, path)
  filename = require.resolve(filename)
  let resultConfig
  try {
    const { config, filepath } = await explorer.load(null, filename)
    resultConfig = config
    filename = filepath
  } catch (err) {
    filename = getMatchJSONErrorFilename(err)
    if (filename) {
      resultConfig = await parseJSONFile(filename)
    } else {
      throw err
    }
  }
  return options.filename ? { config: resultConfig, filename } : resultConfig
}
