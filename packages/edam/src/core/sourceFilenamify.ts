/**
 * @file filenamily
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import * as filenamify from 'filenamify'
import { Source } from '../types/Options'
import { join } from 'path'

export default function wrap(source: Source): string {
  // git/url
  // npm

  if (source.type === 'file') {
    return source.url
  }
  if (source.type === 'npm') {
    return source.type
  }

  return join(source.type)
}
