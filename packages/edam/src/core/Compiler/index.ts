/* eslint-disable indent */
/**
 * @file Compiler
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import * as _ from 'lodash'
import * as nps from 'path'

import { Hook, Loader, Mapper, Matcher, StrictLoader, StrictLoaderWithOption } from '../../types/TemplateConfig'
import * as pReduce from 'p-reduce'
import { AwaitEventEmitter, Logger, Tree } from '../../types/core'
import toArray from '../../lib/toArray'
import { isMatch, isIncludes } from '../../lib/match'
import VariablesImpl from './Variables'
import hookify from './hookify'
import matchMeta from './matchMeta'
import parseQueryString from '../../lib/parseQueryString'
import DefaultLogger from '../DefaultLogger'
import EdamError from '../EdamError'

const debug = require('debug')('edam:Compiler')

export type Asset = {
  value: Buffer | string | any
  loaders?: Array<StrictLoader>
}

export default class Compiler extends AwaitEventEmitter {
  public logger: Logger = new DefaultLogger()
  public root: string = ''
  public hookCwd: string = process.cwd()
  public includes: Matcher = () => true
  public excludes: Matcher = () => false

  public removeHook(hookName: string, hook?: Function) {
    this.removeListener(hookName, hook)
    return this
  }
  public addHook(hookName: string, hook: Hook, options: { type?: 'on' | 'once'; silent?: boolean } = {}): Function {
    let cmd = typeof hook === 'string' && hook
    options = Object.assign({ type: 'on', silent: false }, options)
    hook = hookify(hook, this.hookCwd)
    const wrapped = options.silent
      ? hook
      : (function wrapHook(hook, logger) {
          return function() {
            logger.log('Trigger hook:', hookName, cmd ? JSON.stringify(cmd) : '')
            return hook.apply(this, arguments)
          }
        })(hook, this.logger)
    this[options.type](hookName, wrapped)
    return <Function>wrapped
  }
  constructor({
    loaders,
    mappers,
    hookCwd,
    root,
    includes,
    excludes
  }: {
    excludes?: Matcher
    includes?: Matcher
    loaders?
    mappers?
    root?: string
    hookCwd?: string
  } = {}) {
    super()
    if (hookCwd) {
      this.hookCwd = hookCwd
    }
    if (loaders) {
      this.loaders = loaders
    }
    if (mappers) {
      this.mappers = mappers
    }
    if (root) {
      this.root = root
    }
    if (excludes) {
      this.excludes = excludes
    }
    if (includes) {
      this.includes = includes
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

  public static defaultLoaders: {
    [loaderId: string]: Array<StrictLoader | StrictLoaderWithOption>
  } = {
    module: require('./loaders/module'),
    hbs: require('./loaders/plopHandlebar')
  }

  public static defaultMappers: Array<Mapper> = [
    {
      test: '*',
      loader: ['hbs']
    }
  ]

  public loaders = {...Compiler.defaultLoaders}
  public mappers = Compiler.defaultMappers.slice()
  public variables = new VariablesImpl()

  private _matchedLoaders(path: string) {
    let matchedLoader
    _.some(this.mappers, function(mapper) {
      if (isMatch(path, mapper.test)) {
        matchedLoader = mapper.loader
        return true
      }
    })
    return matchedLoader
  }

  async transform(input, loaders: Loader, path: string, highOrderOptions: object) {
    loaders = toArray(loaders)
    let data = { input, loaders }
    await this.emit('loader:each:before', data)
    const result = await pReduce(
      data.loaders,
      async (input, loader) => {
        if (_.isString(loader)) {
          let { name, query } = parseQueryString(loader)
          let id = name
          loader = this.loaders[id]

          if (!loader) {
            throw new EdamError(`loaderId: ${id} is not matched.`)
          }

          return await this.transform(input, loader, path, _.isEmpty(query) ? highOrderOptions : query)
        }

        let options = {}
        // [ loader, options ]
        if (_.isArray(loader)) {
          options = loader[1] || {}
          loader = loader[0]
        }
        options = _.isEmpty(highOrderOptions) ? options : highOrderOptions

        const context = await this.variables.get()
        _.merge(context, {
          _: {
            file: {
              path,
              dirname: nps.dirname(path),
              name: nps.basename(path).replace(/(.+)\.[^.]+?$/, '$1'),
              ext: nps.extname(path)
            }
          }
        })
        const loaderSelf = {
          compiler: this,
          path,
          options
        }

        if (loader.raw === true) {
          input = Buffer.isBuffer(input) ? input : new Buffer(input)
        } else {
          input = String(input)
        }
        try {
          return await loader.apply(loaderSelf, [input, context])
        } catch (e) {
          if (loader.allowError === true) {
            this.logger.warn(
              'Error occurs when transforming content of file: `' +
                path +
                '`, but the loader allows error happening.\n',
              e
            )
            return input
          }
          throw e
        }
      },
      data.input
    )
    let temp = { result }
    await this.emit('loader:each:after', temp)
    return temp.result
  }

  public async run(): Promise<Tree> {
    await this.emit('run:before')
    await this.emit('assets', this.assets)
    await this.emit('variables', this.variables)
    const workers = _.map(this.assets, async (asset, path) => {
      if (!isIncludes(path, { excludes: this.excludes, includes: this.includes })) {
        return
      }

      const input = asset.value
      const loaders = asset.loaders
      const data = { input, loaders }
      let highOrderOptions

      if (_.isString(data.input)) {
        const { content, meta } = matchMeta(data.input)
        data.input = content
        if (meta && meta.loader) {
          debug('matched meta: \n%O \npath: %s', meta, path)
          if (!(meta.loader.name in this.loaders)) {
            this.logger.warn('%s loader that from file "%s" is not existed', meta.loader.name, path)
          } else {
            // data.loaders = this.loaders[meta.loader.name]
            // use name instead of function
            data.loaders = meta.loader.name
            highOrderOptions = meta.loader.query
          }
        }
      }

      if (!data.loaders) {
        data.loaders = this._matchedLoaders(path)
      }
      debug('loader path: %s, loaders: %o', path, data.loaders)
      if (data.loaders) {
        try {
          await this.emit('loader:before', data)
          return {
            path,
            output: await this.transform(data.input, data.loaders, path, highOrderOptions),
            ...data
          }
        } catch (err) {
          this.logger.error('Error occurs when transforming content of file: `' + path + '`\n', err)

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
    array.filter(Boolean).forEach(data => {
      const { path, ...rest } = data
      output[path] = rest
    })

    await this.emit('run:after', output)
    return output
  }
}
