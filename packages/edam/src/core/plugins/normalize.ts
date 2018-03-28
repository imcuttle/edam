/**
 * @file normalizeTemplateConfig
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import TemplateConfig, {
  Hook,
  Loader,
  StrictLoader,
  Variables
} from '../../types/TemplateConfig'
import * as nps from 'path'
import toArray from '../../lib/toArray'
import * as _ from 'lodash'

export type NormalizedTemplateConfig = TemplateConfig & {
  hooks?: {
    [hookName: string]: Array<Hook>
  }
  loaders?: {
    [loaderId: string]: Loader
  }
  root: string
}

async function dynamicGet<T>(valOrCb, args = [], self?): Promise<T> {
  if (typeof valOrCb === 'function') {
    return await valOrCb.apply(self, args)
  }
  return valOrCb
}

export default async function normalize(
  templateConfig: TemplateConfig,
  templateConfigPath?: string
) {
  await this.emit('normalize:templateConfig:before', templateConfig)
  const data = await this.compiler.variables.get()
  templateConfig.root = await dynamicGet<string>(templateConfig.root, [data])
  if (!templateConfig.root) {
    templateConfig.root = './template'
  }
  if (templateConfig.root && templateConfigPath) {
    templateConfig.root = nps.resolve(
      nps.dirname(templateConfigPath),
      templateConfig.root
    )
  }

  templateConfig.ignore = await dynamicGet<string[]>(templateConfig.ignore, [
    data
  ])
  if (!templateConfig.ignore) {
    templateConfig.ignore = []
  }
  templateConfig.ignore = toArray<string>(templateConfig.ignore)

  templateConfig.hooks = await dynamicGet<any>(templateConfig.hooks, [data])
  templateConfig.variables = await dynamicGet<Variables>(
    templateConfig.variables,
    [data]
  )
  templateConfig.loaders = await dynamicGet<any>(templateConfig.loaders, [data])
  templateConfig.mappers = await dynamicGet<any>(templateConfig.mappers, [data])
  templateConfig.move = await dynamicGet<any>(templateConfig.move, [data])
  templateConfig.copy = await dynamicGet<any>(templateConfig.copy, [data])
  templateConfig.usefulHook = await dynamicGet<any>(templateConfig.usefulHook, [
    data
  ])

  _.each(templateConfig.loaders, function(val, key) {
    if (val) {
      templateConfig.loaders[key] = toArray<StrictLoader>(val)
    }
  })

  this.templateConfig = templateConfig
  await this.emit('normalize:templateConfig:after', this.templateConfig)

  return templateConfig
}
