/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */

import { NormalizedTemplateConfig } from './normalize'
import filter from './filter'
import { Edam } from '../../index'
import TemplateConfig from '../../types/TemplateConfig'

export type Plugin = [
  (
    options: any,
    edam: Edam
  ) => void,
  any
]
export default [
  <Plugin>([filter, {}])
]
