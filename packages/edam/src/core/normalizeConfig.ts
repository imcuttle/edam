/**
 * @file normalizeConfig
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import { EdamConfig } from '../types/Options'
import EdamError from './EdamError'
import { default as normalizeSource, Options } from './normalizeSource'
import { load } from '../lib/loadConfig'
import extendsMerge from './extendsMerge'
/* eslint-disable no-unused-vars */
import * as qs from 'querystring'
import extendsConfig, { innerExtendsConfig, Track } from './extendsConfig'
import * as _ from 'lodash'
import * as nps from 'path'
import constant from './constant'
import * as assert from 'assert'
import toArray from '../lib/toArray'
import resolve from '../lib/resolve'
import fileSystem from '../lib/fileSystem'

const tildify = require('tildify')
const debug = require('debug')('edam:normalizeConfig')

/**
 *
 * @param {EdamConfig} looseConfig
 * @param {Options} options
 * @return {Promise<EdamConfig>}
 */
export default async function normalizeConfig(
  looseConfig: EdamConfig,
  options: Options = { cwd: process.cwd() }
): Promise<{ config: EdamConfig; track: Track }> {
  debug('input: loose Config %O', looseConfig)
  debug('input: options %o', options)
  looseConfig = Object.assign(
    {
      userc: true,
      yes: false,
      silent: false,
      extends: [],
      plugins: [],
      alias: {},
      cacheDir: true
    },
    looseConfig
  )

  const coreSpecial = {
    userc: looseConfig.userc,
    yes: looseConfig.yes,
    silent: looseConfig.silent,
    name: looseConfig.name
  }

  // merge extends Configuration
  let { config: mergedConfig, track } = await extendsConfig(looseConfig, {
    ...options,
    track: true
  })

  // mergedConfig = _.cloneDeep(mergedConfig)
  if (coreSpecial.userc) {
    const obj = await load(options.cwd)
    debug('rc config: %o', obj)
    if (obj) {
      const { config: rcConfig, filepath } = obj
      const mergedRcConfig = await innerExtendsConfig(
        rcConfig,
        { cwd: nps.dirname(filepath) },
        track
      )
      debug('rc merged config: %O', mergedRcConfig)
      mergedConfig = extendsMerge({}, mergedRcConfig, mergedConfig)
    }
  }

  if (!mergedConfig.source) {
    throw new Error('Sorry, the config file requires `source`')
  }

  if (typeof mergedConfig.output !== 'string') {
    throw new Error(
      '`config.output` requires dir path, but ' + typeof mergedConfig.output
    )
  }

  mergedConfig.output = nps.resolve(options.cwd, mergedConfig.output)
  if (!fileSystem.isDirectory(mergedConfig.output)) {
    throw new Error(
      '`config.output` requires dir path, but "' +
        tildify(mergedConfig.output) +
        '" isn\'t directory or not exists'
    )
  }

  // normalize source
  _.each(mergedConfig.alias, (val, key) => {
    mergedConfig.alias[key] = normalizeSource(mergedConfig.alias[key], options)
  })

  // Given source is alias
  let source = mergedConfig.source
  if (_.isString(source)) {
    // mergedConfig.source append with querystring
    let qIndex = source.lastIndexOf('?')
    let query = {}
    let tmpSource = source
    if (qIndex >= 0) {
      query = qs.parse(source.slice(qIndex + 1))
      tmpSource = source.substring(0, qIndex)
    }
    if (tmpSource in mergedConfig.alias) {
      source = { ...mergedConfig.alias[tmpSource], ...query }
    } else {
      source = normalizeSource(source, options)
    }
  } else {
    source = normalizeSource(source, options)
  }
  mergedConfig.source = source

  // normalize cacheDir
  if (_.isString(mergedConfig.cacheDir)) {
    mergedConfig.cacheDir = nps.resolve(
      options.cwd,
      <string>mergedConfig.cacheDir
    )
  } else if (mergedConfig.cacheDir) {
    mergedConfig.cacheDir = constant.DEFAULT_CACHE_DIR
  }

  const normalized = {
    ...mergedConfig,
    pull: {
      npmClient: 'npm',
      ...mergedConfig.pull
    },
    ...coreSpecial
  }
  if (!['npm', 'yarn'].includes(normalized.pull.npmClient)) {
    throw Error(`config.pull.npmClient allows the value which is one of 'npm' | 'yarn'. but ${normalized.pull.npmClient}`)
  }

  debug('normalized Config: %O', normalized)
  return { config: normalized, track }
}
