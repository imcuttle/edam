/**
 * @file normalizeConfig
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import { EdamOptions } from '../types/Options'
import EdamError from './EdamError'
import { default as normalizeSource, Options } from './normalizeSource'

import extendsConfig from './extendsConfig'
import * as _ from 'lodash'
import * as nps from 'path'
import { DEFAULT_CACHE_DIR } from './constant'

const debug = require('debug')('edam:normalizeConfig')

export default async function normalizeConfig(
  looseConfig: EdamOptions,
  options: Options
): Promise<EdamOptions> {
  debug('input: loose Config %O', looseConfig)
  looseConfig = Object.assign(
    {
      userc: true,
      yes: false,
      silent: false,
      extends: [],
      alias: {},
      cacheDir: true
    },
    looseConfig
  )

  if (!looseConfig.source) {
    throw new EdamError('Sorry, the configuration file requires `source`')
  }

  const coreSepecial = {
    userc: looseConfig.userc,
    yes: looseConfig.yes,
    silent: looseConfig.silent,
    name: looseConfig.name
  }

  // merge extends Configuration
  const { config: mergedConfig } = await extendsConfig(looseConfig, {
    ...options,
    track: false
  })
  // normalize source
  mergedConfig.source = normalizeSource(mergedConfig.source, options)
  _.each(mergedConfig.alias, (val, key) => {
    mergedConfig.alias[key] = normalizeSource(mergedConfig.alias[key], options)
  })
  // normalize cacheDir
  if (_.isString(mergedConfig.cacheDir)) {
    mergedConfig.cacheDir = nps.resolve(
      options.cwd,
      <string>mergedConfig.cacheDir
    )
  } else if (mergedConfig.cacheDir) {
    mergedConfig.cacheDir = nps.resolve(options.cwd, DEFAULT_CACHE_DIR)
  }

  const normalized = {
    ...mergedConfig,
    ...coreSepecial
  }
  debug('normalized Config: %O', normalized)
  return normalized
}
