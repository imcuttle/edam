/**
 * @file Compiler
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import * as _ from 'lodash'
import * as AwaitEventEmitter from 'await-event-emitter'
import * as mm from 'micromatch'
import { Hook, Loader, StrictLoader } from '../../types/TemplateConfig'
import pReduce from 'p-reduce'
import { Tree } from '../../types/core'
import toArray from '../../lib/toArray'
import EdamError from '../EdamError'

const debug = require('debug')('edam:Compiler')

export type Asset = {
  value: Buffer | string | any
  loaders?: Array<StrictLoader>
}

export default class Compiler extends AwaitEventEmitter {
  emit: Function
  emitSync: Function
  removeListener: Function

  public removeHook(hookName: string, hook?: Function) {
    // @todo
    this.removeListener(hookName, hook)
  }
  public addHook(hookName: string, hook: Hook, type: 'on' | 'off' = 'on'): Function {
    // @todo hookily
    hook = hookify(hook)
    this[type](hookName, )
    return <Function>hook
  }
  constructor(loaders?, mapper?) {
    super()
    if (loaders) {
      this.loaders = loaders
    }
    if (mapper) {
      this.mapper = mapper
    }
  }
  public addLoader(loaderId: string, loader: Loader): Compiler {
    this.loaders[loaderId] = toArray(loader)
    return this
  }
  public removeLoader(loaderId: string): Compiler {
    delete this.loaders[loaderId]
    return this
  }
  public assets: {
    [path: string]: Asset
  } = {}
  public variables: {
    [hookName: string]: Array<Hook>
  } = {}
  public loaders: {
    [loaderId: string]: Array<StrictLoader>
  } = {}
  public mapper: {
    [glob: string]: Loader
  } = {}

  matchedLoaders(path: string) {
    let matchedLoader
    _.some(this.mapper, function(mapper, glob) {
      if (mm.isMatch(path, glob.toString(), { matchBase: true, dot: true })) {
        matchedLoader = mapper
        return true
      }
    })
    return matchedLoader
  }

  async transform(input, loaders: Loader) {
    loaders = toArray(loaders)
    let data = { input, loaders }
    await this.emit('loader:each:before', data)
    const result = await pReduce(
      data.loaders,
      async (input, loader) => {
        if (_.isString(loader)) {
          let id = loader
          loader = this.loaders[id]
          if (!loader) {
            throw new EdamError(`loaderId: ${id} is not matched.`)
          }
          return await this.transform(input, loader)
        }

        if (loader.raw === true) {
          const buf = Buffer.isBuffer(input) ? input : new Buffer(input)
          return await loader(buf)
        }
      },
      data.input
    )
    let temp = { result }
    await this.emit('loader:each:after', temp)
    return temp.result
  }

  public async run(): Promise<Tree> {
    const workers = _.map(this.assets, async (asset, path) => {
      const input = asset.value
      const loaders = asset.loaders
      const data = { input, loaders }
      if (_.isString(data.input)) {
        // @todo match first line for use loader
        const { content, meta } = matchMetaFromString(data.input, path)
        data.input = content
        if (meta && meta.useLoader) {
          debug('matchMetaFromString meta: %o, path: %s', meta, path)
          data.loaders = this.loaders[meta.useLoader]
        }
      }
      if (!data.loaders) {
        data.loaders = this.matchedLoaders(path)
      }
      debug('loader path: %s, loaders: %o', path, data.loaders)
      if (data.loaders) {
        try {
          await this.emit('loader:before', data)
          return {
            path,
            output: await this.transform(data.input, data.loaders),
            ...data
          }
        } catch (err) {
          return {
            path,
            error: err,
            ...data
          }
        }
      }
      return {
        path,
        ...data
      }
    })

    const array = await Promise.all(workers)
    let output: Tree = {}
    array
      .filter(Boolean)
      .forEach(data => {
        const { path, ...rest } = data
        output[path] = rest
      })
    return output
  }

}
