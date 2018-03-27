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

export default async function filter(/*options*/) {
  const edam = <Edam>this

  edam.on('normalize:templateConfig:after', () => {
    const templateConfig: TemplateConfig = edam.templateConfig
    let { loaders, mappers, hooks } = templateConfig

    const compiler = edam.compiler
    const variables = edam.compiler.variables

    getExtendsMerge({ concatKeys: ['mappers'] })(
      compiler,
      {
        loaders,
        mappers
      }
    )
    _.each(hooks, (hook, key) => {
      toArray(hook).forEach(hook => {
        edam.compiler.addHook(key, <Hook>hook, 'on')
      })
    })

    variables.assign(templateConfig.variables)
  })
}
