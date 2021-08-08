/**
 * @file extendsConfig
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { default as normalizeSource, Options } from './normalizeSource'
import { EdamConfig } from '../types/Options'
import toArray from '../lib/toArray'
import extendsMerge from './extendsMerge'
import { loadConfig } from '../lib/loadConfig'
import * as _ from 'lodash'
import * as preduce from 'p-reduce'
import * as nps from 'path'
import resolve from '../lib/resolve'
import * as fs from 'fs'

const untildify = require('untildify')
const debug = require('debug')('edam:extendsConfig')

export type Track = {
  [id: string]: {
    status: 'visiting' | 'visited' | 'first'
    value?: any
  }
}

export function normalizePlugins(plugins, options: Options) {
  plugins = toArray(plugins)
  return <[Function, any]>plugins.map(p => {
    function getPlugin(p) {
      const res = resolve(p, { ...options, safe: false, global: true })
      debug('get Plugin: %s -> %s', p, res)
      return require(res)
    }

    if (_.isString(p)) {
      return [getPlugin(p), {}]
    } else if (_.isArray(p) && _.isString(p[0])) {
      return [getPlugin(p[0]), p[1]]
    }
    return p
  })
}

function normalizeExtend(
  extend: string | { source: string; pick?: string[]; omit?: string[] }
): { source: string; pick: string[]; omit: string[] } {
  if (typeof extend === 'string') {
    return {
      source: extend,
      pick: [],
      omit: [],
    }
  }

  return {
    pick: [],
    omit: [],
    ...extend,
  }
}

export async function innerExtendsConfig(config: EdamConfig, options: Options, track?: Track): Promise<EdamConfig> {
  let extendConfig: EdamConfig
  config = _.cloneDeep(config)
  debug('config %O', config)

  if (typeof config.output === 'string') {
    config.output = nps.resolve(options.cwd, config.output)
  }

  // source and alias could be relative path
  config.source = normalizeSource(config.source, options)
  if (config.alias) {
    _.each(config.alias, (val, key) => {
      config.alias[key] = normalizeSource(val, options)
    })
  }

  if (config.plugins) {
    config.plugins = normalizePlugins(config.plugins, options)
  }
  if (config.extends) {
    const extendsArray = (config.extends = toArray(config.extends))
    const configList = await Promise.all(
      extendsArray.map(async source => {
        const extendConfig = normalizeExtend(source)
        const sourcePath = nps.resolve(options.cwd || '', extendConfig.source)
        let result: any
        if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
          result = await loadConfig(untildify(extendConfig.source), {
            ...options,
            filename: true,
            stopPath: sourcePath,
          })
        } else {
          result = await loadConfig(untildify(extendConfig.source), { ...options, filename: true })
        }
        return {
          ...result,
          config: _.omit(
            !!extendConfig.pick?.length ? _.pick(result.config, extendConfig.pick) : result.config,
            extendConfig.omit
          ),
        }
      })
    )
    extendConfig = await preduce(
      configList,
      async (collection, { config: innerConfig, invalid, filename }) => {
        if (invalid) {
          innerConfig = {}
        }

        let value
        track[filename] = track[filename] || { status: 'first' }
        if (track[filename].status === 'visited') {
          value = track[filename].value
        } else if (track[filename].status === 'visiting') {
          value = {}
        } else {
          track[filename] = { status: 'visiting' }
          value = await innerExtendsConfig(
            innerConfig,
            {
              ...options,
              cwd: nps.dirname(filename),
            },
            track
          )
          track[filename] = {
            status: 'visited',
            value,
          }
        }

        return extendsMerge(collection, value)
      },
      {}
    )
  }

  const result = extendsMerge({}, extendConfig, config)
  debug('extended track %O', track)
  debug('extended result %O', result)
  return result
}

export default async function extendsConfig(
  config: EdamConfig,
  options: Options & { track?: boolean }
): Promise<{ config: EdamConfig; track?: Track }> {
  options = {
    track: true,
    ...options,
  }
  const track = {}
  return {
    config: await innerExtendsConfig(config, options, track),
    track: options.track ? track : null,
  }
}
