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
import npmInstall from 'yarn-install'
import symbolic from "../../lib/symbolic";

export default async function filter(/*options*/) {
  const edam = <Edam>this

  edam.prependOnceListener('normalize:templateConfig:after', () => {
    const templateConfig: TemplateConfig = edam.templateConfig
    let { loaders, mappers, hooks } = templateConfig

    const compiler = edam.compiler
    const variables = edam.compiler.variables
    getExtendsMerge({ concatKeys: ['mappers'] })(compiler, {
      loaders,
      mappers
    })
    _.each(hooks, (hook, key) => {
      toArray(hook).forEach(hook => {
        compiler.addHook(key, <Hook>hook, {
          type: 'on',
          silent: edam.config.silent
        })
      })
    })

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
        compiler.addHook('post', function (output) {
          npmInstall({
            production: installDependencies && !installDevDependencies,
            dev: !installDependencies && installDevDependencies,
            stdio: 'pipe',
            cwd: resolve(output)
          })
        }, {
          type: 'once'
        })
      }
    }

    variables.assign(templateConfig.variables)
  })
}
