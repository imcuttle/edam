/**
 * @file normalizeTemplateConfig
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import TemplateConfig, {
  Hook,
  Loader, StrictLoader,
} from '../../types/TemplateConfig'
import * as nps from 'path'
import toArray from '../../lib/toArray'
import * as _ from 'lodash'

export type NormalizedTemplateConfig = TemplateConfig & {
  ignore?: string[]
  hooks?: {
    [hookName: string]: Array<Hook>
  }
  loaders?: {
    [loaderId: string]: Loader
  }
  mapper?: {
    [glob: string]: Array<Function>
  }
  root: string
}

export default function normalize(
  templateConfig: TemplateConfig,
  templateConfigPath?: string
): NormalizedTemplateConfig {
  // normalize
  if (!templateConfig.root && templateConfigPath) {
    templateConfig.root = nps.dirname(templateConfigPath)
  }
  if (!templateConfig.ignore) {
    templateConfig.ignore = []
  }
  templateConfig.ignore = toArray<string>(templateConfig.ignore)

  _.each(templateConfig.loaders, function(val, key) {
    if (val) {
      templateConfig.loaders[key] = toArray<StrictLoader>(val)
    }
  })

  return <NormalizedTemplateConfig>templateConfig
}
