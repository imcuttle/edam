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
const semver = require('semver')
const debug = require('debug')('edam:normalizeSource')

export type Options = {
  cwd?: string
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
    source.url = source.url.replace(/(\.git)?$/, '.git')
    if (!source.checkout) {
      source.checkout = 'master'
    }
  }
  return source
}

export default function normalizeSource(
  source: Source | string,
  options?: Options
): Source {
  // const { cwd = process.cwd() } = options || {}

  if (_.isObject(source)) {
    return normalizeSourceObject(<Source>source, options)
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
  }

  if (isGitUrl(source)) {
    const parsed = parseGitUrl(source)
    source = parsed.url.replace(/(\.git)?$/, '.git')

    result = {
      type: 'git',
      url: <string>source,
      checkout: parsed.checkout
    }
  } else if (
    ((filename = resolve(source, { ...options, safe: true })),
    fs.isFile(filename))
  ) {
    result = {
      type: 'file',
      url: filename
    }
  } else {
    let version = ''
    if (/^(.+)@([^@]*)$/.test(source)) {
      let matchedSource = RegExp.$1
      version = RegExp.$2

      source = matchedSource
    }

    result = {
      type: 'npm',
      url: source,
      version
    }
  }

  debug('source parsed: %o', result)
  return result
}
