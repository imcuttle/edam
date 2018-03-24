/**
 * @file normalizeSource
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import parseGitUrl from '../utils/parseGitUrl'
import isGitUrl from '../utils/isGitUrl'
import fs from '../utils/fileSystem'
import * as nps from 'path'
import * as _ from 'lodash'
import { Source } from '../types/Options'
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
  } else if (fs.isFile(nps.resolve(cwd, source))) {
    result = {
      type: 'file',
      url: nps.resolve(cwd, source)
    }
  } else {
    result = {
      type: 'npm',
      url: nps.resolve(cwd, source)
    }
  }

  debug('source parsed: %o', result)
  return result
}
