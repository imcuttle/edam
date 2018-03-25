/**
 * @file normalizeTemplateConfig
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import TemplateConfig, { Hook } from '../../types/TemplateConfig'
import * as nps from 'path'

export type NormalizedTemplateConfig = TemplateConfig & {
  files: Array<string>
  hooks?: {
    [hookName: string]: Array<Hook>
  }
  loaders?: {
    [loaderId: string]: Array<Function>
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
  return <NormalizedTemplateConfig>{}
}
