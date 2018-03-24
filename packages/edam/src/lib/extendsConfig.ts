/**
 * @file extendsConfig
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { Options } from './normalizeSource'
import { EdamOptions } from '../types/Options'
import toArray from '../utils/toArray'
import extendsMerge from '../utils/extendsMerge'
import { loadConfig } from '../utils/loadConfig'
import * as preduce from 'p-reduce'
import * as nps from 'path'
const debug = require('debug')('edam:extendsConfig')

type Track = {
  [id: string]: {
    status: 'visiting' | 'visited' | 'first'
    value?: any
  }
}
async function innerExtendsConfig(
  config: EdamOptions,
  options: Options,
  track?: Track
): Promise<EdamOptions> {
  let extendConfig: EdamOptions
  debug('config %O', config)
  if (config.extends) {
    const extendsArray: Array<string> = (config.extends = toArray(
      config.extends
    ))
    const configList = await Promise.all(
      extendsArray.map(source => {
        return loadConfig(source, { ...options, filename: true })
      })
    )
    extendConfig = await preduce(
      configList,
      async (collection, { config: innerConfig, filename }) => {
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
              cwd: nps.dirname(filename)
            },
            track
          )
          track[filename] = {
            status: 'visited',
            value
          }
        }

        return extendsMerge(collection, value)
      },
      {}
    )
  }

  const result = extendsMerge(extendConfig, config)
  debug('extended track %O', track)
  debug('extended result %O', result)
  return result
}

export default async function extendsConfig<T>(
  config: EdamOptions,
  options: Options & { track?: boolean }
): Promise<{ config: EdamOptions, track?: Track }> {
  options = {
    track: true,
    ...options
  }
  const track = {}
  return {
    config: await innerExtendsConfig(config, options, track),
    track: options.track ? track : null
  }
}
