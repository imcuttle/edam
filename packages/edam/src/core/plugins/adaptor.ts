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
import { Hook } from '../../types/TemplateConfig'

export default async function filter(/*options*/) {
  const edam = <Edam>this
  const templateConfig = edam.templateConfig
  let { loaders, mapper, hooks } = templateConfig

  const compiler = edam.compiler
  const variables = edam.compiler.variables

  getExtendsMerge()(compiler, {
    loaders,
    mapper
  })
  _.each(hooks, (hook, key) => {
    toArray(hook).forEach(hook => {
      edam.compiler.addHook(key, <Hook>hook, 'on')
    })
  })
  variables.assign(templateConfig.variables)
}
