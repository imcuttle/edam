/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */

import filter from './filter'
import adaptor from './adaptor'
import { Edam } from '../../index'

export type Plugin = [
  (
    options: any,
    edam: Edam
  ) => void,
  any
]
export default [
  <Plugin>[filter, {}],
  <Plugin>[adaptor, {}]
]
