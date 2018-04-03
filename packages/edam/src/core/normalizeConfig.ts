/**
 * @file normalizeConfig
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import { EdamConfig } from '../types/Options'
import { default as normalizeSource, Options } from './normalizeSource'
import { load } from '../lib/loadConfig'
import extendsMerge from './extendsMerge'
/* eslint-disable no-unused-vars */
import parseQuery from '../lib/parseQuery'
import extendsConfig, { innerExtendsConfig, Track } from './extendsConfig'
import * as _ from 'lodash'
import * as nps from 'path'
import constant from './constant'
import * as assert from 'assert'
import toArray from '../lib/toArray'
import resolve from '../lib/resolve'
import fileSystem from '../lib/fileSystem'
import parseQueryString from '../lib/parseQueryString'

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
      // plugins: [],
      alias: {},
      cacheDir: true,
      updateNotify: true
    },
    looseConfig
  )

  const coreSpecial = {
    userc: looseConfig.userc,
    yes: looseConfig.yes,
    silent: looseConfig.silent,
    updateNotify: looseConfig.updateNotify,
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

  if (!mergedConfig.plugins) {
    mergedConfig.plugins = []
  }
  // normalize source
  _.each(mergedConfig.alias, (val, key) => {
    mergedConfig.alias[key] = normalizeSource(mergedConfig.alias[key], options)
  })

  // Given source is alias
  let source = mergedConfig.source
  if (_.isString(source)) {
    // mergedConfig.source append with querystring
    let { query, name } = parseQueryString(source)
    let tmpSource = name

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

  if (typeof mergedConfig.storePrompts === 'undefined') {
    mergedConfig.storePrompts = true
  }

  const normalized = {
    ...mergedConfig,
    pull: {
      npmClient: 'npm',
      ...mergedConfig.pull
    },
    ...coreSpecial
  }

  debug('normalized Config: %O', normalized)
  return { config: normalized, track }
}
