/* eslint-disable indent */
/**
 * @file storePrompts
 * @author Cuttle Cong
 * @date 2018/3/29
 * @description
 */
import { Source } from '../types/Options'
import * as nps from 'path'
import fileSystem from '../lib/fileSystem'
import EdamError from './EdamError'
import { Prompt } from '../types/TemplateConfig'
const tildify = require('tildify')
const mkdirp = require('mkdirp')
const debug = require('debug')('edam:storePrompts')

function getFilename(cacheDir: string) {
  return nps.join(cacheDir, 'edam-prompts.json')
}
async function _get(cacheDir: string) {
  const filename = getFilename(cacheDir)
  debug('(filename): %s', filename)
  mkdirp.sync(nps.dirname(filename))
  try {
    if (!fileSystem.existsSync(filename)) {
      await fileSystem.writeFile(filename, '{}')
      return {}
    }

    return JSON.parse(await fileSystem.readFile(filename, { encoding: 'utf8' }))
  } catch (err) {
    throw new EdamError(
      `Parse JSON store prompts: "${tildify(
        filename
      )}" error. please check it manually.`
    )
  }
}

function getKeyBySource(source: Source) {
  let key
  switch (source.type) {
    case 'git':
      key = source.url + '?checkout=' + source.checkout
      break
    case 'npm':
      key = source.url + '?version=' + source.version
      break
    case 'file':
      key = source.url
      break
    default:
      key = source.url
  }
  return key
}

async function _store(cacheDir: string, source, promptValues) {
  const filename = getFilename(cacheDir)
  const old = await _get(cacheDir)
  let key = getKeyBySource(source)
  // assign
  old[key] = { ...old[key], ...promptValues }
  await fileSystem.writeFile(filename, JSON.stringify(old))
}

export async function store(
  promptValues: object,
  prompts: Prompt[],
  {
    source,
    cacheDir
  }: {
    source?: Source
    cacheDir?: string | boolean
  } = {}
) {
  if (!cacheDir || !source) {
    return
  }
  const deniesStoreNames = prompts.filter(x => !!x.deniesStore).map(x => x.name)
  promptValues = { ...promptValues }
  deniesStoreNames.forEach(name => {
    if (promptValues.hasOwnProperty(name)) {
      delete promptValues[name]
    }
  })
  debug(
    '(store): promptValues %O, deniesStoreNames: %O',
    promptValues,
    deniesStoreNames
  )
  await _store(<string>cacheDir, source, promptValues)
}

export async function get({
  source,
  prompts = [],
  cacheDir
}: {
  source?: Source
  prompts?: Prompt[]
  cacheDir?: string | boolean
} = {}) {
  if (!cacheDir || !source) {
    return
  }
  let old = (await _get(<string>cacheDir))[getKeyBySource(source)]
  old = { ...old }
  const deniesStoreNames = prompts.filter(x => !!x.deniesStore).map(x => x.name)
  deniesStoreNames.forEach(name => {
    if (old.hasOwnProperty(name)) {
      delete old[name]
    }
  })
  debug('(get): promptValues %O', old)
  return old
}
