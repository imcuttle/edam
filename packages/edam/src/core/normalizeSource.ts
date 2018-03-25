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
    if (!source.branch) {
      source.branch = 'master'
    }
  }
  return source
}

export default function normalizeSource(
  source: Source | string,
  options?: Options
): Source {
  const { cwd = process.cwd() } = options || {}

  if (_.isObject(source)) {
    return normalizeSourceObject(<Source>source, options)
  }

  let result: Source
  let filename
  debug('input source: %s', source)
  source = (<string>source).trim()
  if (isGitUrl(source)) {
    const parsed = parseGitUrl(source)
    source = parsed.url.replace(/(\.git)?$/, '.git')

    result = {
      type: 'git',
      url: <string>source,
      branch: parsed.branch
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
    result = {
      type: 'npm',
      url: source
    }
  }

  debug('source parsed: %o', result)
  return result
}
