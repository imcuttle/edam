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
import extendsConfig, { innerExtendsConfig, Track } from './extendsConfig'
import * as _ from 'lodash'
import * as nps from 'path'
import { DEFAULT_CACHE_DIR } from './constant'
import toArray from '../lib/toArray'
import safeRequireResolve from '../lib/safeRequireResolve'

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

  if (!looseConfig.source) {
    throw new EdamError('Sorry, the configuration file requires `source`')
  }

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
  let rcData
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
  // normalize source
  _.each(mergedConfig.alias, (val, key) => {
    mergedConfig.alias[key] = normalizeSource(mergedConfig.alias[key], options)
  })

  if (mergedConfig.source in mergedConfig.alias) {
    mergedConfig.source = mergedConfig.alias[<string>mergedConfig.source]
  } else {
    mergedConfig.alias = normalizeSource(mergedConfig.source, options)
  }

  // normalize cacheDir
  if (_.isString(mergedConfig.cacheDir)) {
    mergedConfig.cacheDir = nps.resolve(
      options.cwd,
      <string>mergedConfig.cacheDir
    )
  } else if (mergedConfig.cacheDir) {
    mergedConfig.cacheDir = nps.resolve(options.cwd, DEFAULT_CACHE_DIR)
  }

  // plugin
  if (mergedConfig.plugins) {
    mergedConfig.plugins = toArray(mergedConfig.plugins)
    mergedConfig.plugins.map(p => {
      function getPlugin(p) {
        let path = safeRequireResolve(p)
        if (path) {
          return require(p)
        }
        return require.resolve(nps.resolve(options.cwd, p))
      }

      if (_.isString(p)) {
        return require[getPlugin(p)]
      } else if (_.isArray(p) && _.isString(p[0])) {
        return [getPlugin(p[0]), p[1]]
      }
    })
  }

  const normalized = {
    ...mergedConfig,
    ...coreSpecial
  }
  debug('normalized Config: %O', normalized)
  return { config: normalized, track }
}
