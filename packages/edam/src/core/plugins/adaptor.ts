/**
 * @file filter
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { Edam } from '../../index'
import getExtendsMerge from '../../lib/getExtendsMerge'
import * as _ from 'lodash'
import toArray from '../../lib/toArray'
import { Hook, default as TemplateConfig } from '../../types/TemplateConfig'
import { dirname, resolve } from 'path'
const npmInstall = require('../../lib/yarnInstall')
const debug = require('debug')('edam:adaptor')

export default async function filter(/*options*/) {
  const edam = <Edam>this

  edam.prependOnceListener('normalize:templateConfig:after', () => {
    const templateConfig: TemplateConfig = edam.templateConfig
    let { loaders, mappers, hooks } = templateConfig

    const compiler = edam.compiler
    const variables = edam.compiler.variables

    debug('compiler preset loaders %O', compiler.loaders)
    debug('compiler preset mappers %O', compiler.mappers)
    debug('input mappers %O', mappers)
    getExtendsMerge({ concatKeys: ['mappers'] })(compiler, {
      loaders,
      mappers: mappers || []
    })

    debug('compiler merged loaders %O', compiler.loaders)
    debug('compiler merged mappers %O', compiler.mappers)

    if (templateConfig.usefulHook) {
      const {
        gitInit,
        installDependencies,
        installDevDependencies
      } = templateConfig.usefulHook
      if (gitInit) {
        compiler.addHook('post', 'cd $HOOK_PARAMS_0 && git init', {
          type: 'once',
          silent: edam.config.silent
        })
      }
      if (installDependencies || installDevDependencies) {
        compiler.addHook('post', async function (output) {
          await edam.emit('install:packages:before')
          await npmInstall({
            production: installDependencies && !installDevDependencies,
            dev: !installDependencies && installDevDependencies,
            stdio: 'pipe',
            cwd: resolve(output)
          })
          await edam.emit('install:packages:after')
        }, {
          type: 'once',
          silent: edam.config.silent
        })
      }
    }

    _.each(hooks, (hook, key) => {
      toArray(hook).forEach(hook => {
        compiler.addHook(key, <Hook>hook, {
          type: 'on',
          silent: edam.config.silent
        })
      })
    })

    variables.assign(templateConfig.variables)
  })
}
