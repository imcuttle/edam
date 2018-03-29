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
async function _store(cacheDir: string, source, promptValues) {
  const filename = getFilename(cacheDir)
  const old = await _get(cacheDir)
  old[source.url] = promptValues
  await fileSystem.writeFile(filename, JSON.stringify(old))
}

export async function store(
  promptValues: object,
  {
    source,
    cacheDir
  }: {
    source?: Source
    cacheDir?: string | boolean
  } = {}
) {
  if (!cacheDir) {
    return
  }
  debug('(store): promptValues %O', promptValues)
  await _store(<string>cacheDir, source, promptValues)
}

export async function get({
  source,
  cacheDir
}: {
  source?: Source
  cacheDir?: string | boolean
} = {}) {
  if (!cacheDir) {
    return
  }
  const old = (await _get(<string>cacheDir))[source.url]
  debug('(get): promptValues %O', old)
  return old
}
