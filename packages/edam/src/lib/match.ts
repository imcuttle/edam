/**
 * @file match
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { Matcher } from '../types/TemplateConfig'
import * as mm from 'micromatch'
import toArray from './toArray'
import { isString, isArray } from 'lodash'

export function isMatch(value: string, m: Matcher): boolean {
  if (isString(m) || isArray(m)) {
    return !!mm([value], m, { matchBase: true, dot: true }).length
  }
  if (m instanceof RegExp) {
    return m.test(value)
  }
  if (typeof m === 'function') {
    return !!m(value)
  }
  throw new TypeError('isMatch requires glob[]/glob/regexp/function, but ' + m)
}

export default function match(value: Array<string>, m: Matcher): string[] {
  const list: string[] = toArray(value)
  return list.filter(val => isMatch(val, m))
}
