/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2018/1/26
 * @description:
 */

import normalizeConfig from './core/normalizeConfig'
import { EdamConfig, Source } from './types/Options'
import { Track } from './core/extendsConfig'
import { Options } from './core/normalizeSource'
import { Tree } from './types/core'
import * as presetSourcePull from './core/pull/preset'
import EdamError from './core/EdamError'

class Edam {
  public track: Track
  constructor(public config: EdamConfig, public options: Options = {}) {
    this.setConfig(config)
    this.setOption(options)
  }

  async normalizeConfig(): Promise<Edam> {
    const { track, config } = await normalizeConfig(this.config, this.options)
    this.config = config
    this.track = track
    return this
  }

  addLoader() {
    return this
  }
  setConfig(config: EdamConfig): Edam {
    this.config = config
    return this
  }
  setOption(options: Options): Edam {
    this.options = options
    return this
  }

  static sourcePullMethods = {
    ...presetSourcePull
  }

  async process(): Promise<Tree> {
    await this.normalizeConfig()

    const source = <Source>this.config.source
    if (source) {
      const pullMethod = Edam.sourcePullMethods[source.type]
      if (typeof pullMethod !== 'function') {
        throw new EdamError(`source pull method is not found of type: ${source.type}`)
      }
      // eslint-disable-next-line no-unused-vars
      const templatePath: string = await pullMethod(source, this.config)
    }

    return {}
  }
}

async function edam(config: EdamConfig, options: Options) {
  return await new Edam(config, options)
}
module.exports = edam
module.exports.Edam = Edam
