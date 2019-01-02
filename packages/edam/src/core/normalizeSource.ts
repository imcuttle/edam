/**
 * @file normalizeSource
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import parseGitUrl from '../lib/parseGitUrl'
import isGitUrl from '../lib/isGitUrl'
import fs from '../lib/fileSystem'
import * as nps from 'path'
import * as _ from 'lodash'
import { Source } from '../types/Options'
import resolve from '../lib/resolve'
import { normalizePlugins } from './extendsConfig'
import parseQuery from '../lib/parseQuery'
const debug = require('debug')('edam:normalizeSource')
const untildify = require('untildify')

export type Options = {
  cwd?: string
}

function tran(ref, name, fn) {
  if (ref[name] != null) {
    ref[name] = fn(ref[name])
  }
}

function parsePureGitUrl(source: string) {
  const parsed = parseGitUrl(source)
  return parsed.url.replace(/(\.git)?$/, '.git')
}

function parseGit(source: string): any {
  return {
    type: 'git',
    url: <string>parsePureGitUrl(source),
    checkout: parseGitUrl(source).checkout
  }
}

export function normalizeSourceObject(
  source: Source,
  options?: Options
): Source {
  const { cwd = process.cwd() } = options || {}
  if (source.type === 'file') {
    source.url = nps.resolve(cwd, source.url)
  }
  if (source.type === 'git') {
    source.url = parsePureGitUrl(source.url)
    if (!source.checkout) {
      source.checkout = 'master'
    }
  }
  if (source.config) {
    tran(source.config, 'output', str => nps.resolve(cwd, str))
    tran(source.config, 'cacheDir', cacheDir => {
      if (_.isString(cacheDir)) {
        return nps.resolve(cwd, cacheDir)
      }
      return cacheDir
    })
    tran(source.config, 'plugins', plugins =>
      normalizePlugins(plugins, options)
    )
  }

  return source
}

function parseNpm(source: string): any {
  let version = ''
  if (/^(.+)@([^@]*)$/.test(source)) {
    let matchedSource = RegExp.$1
    version = RegExp.$2

    source = matchedSource
  }

  return {
    type: 'npm',
    url: source,
    version
  }
}

export default function normalizeSource(
  source: Source | string,
  options?: Options
): Source {
  // const { cwd = process.cwd() } = options || {}

  if (_.isObject(source)) {
    return normalizeSourceObject(<Source>source, options)
  }

  if (!_.isString(source)) {
    return <Source>source
  }

  let result: Source
  let filename
  debug('input source: %s', source)
  source = (<string>source).trim()

  let prefix = ''
  if (/^(.+?):/.test(source)) {
    prefix = RegExp.$1
  }
  if (['npm'].includes(prefix)) {
    source = source.substring(prefix.length + 1)
    return parseNpm(source)
  }

  if (
    ((filename = resolve(untildify(source), { ...options, safe: true })),
    fs.isFile(filename))
  ) {
    result = {
      type: 'file',
      url: filename
    }
  } else if (isGitUrl(source)) {
    result = parseGit(source)
  } else {
    result = parseNpm(source)
  }

  let i = result.url.lastIndexOf('?')
  if (i >= 0) {
    result = {
      ...parseQuery(result.url.slice(i)),
      ...result,
      url: result.url.slice(0, i)
    }
  }

  debug('source parsed: %o', result)
  return result
}
