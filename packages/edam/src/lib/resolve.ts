/**
 * @file resolve
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import * as resolve from 'resolve'
import * as nps from 'path'
import { Options } from '../core/normalizeSource'

export default function cusResolve(
  id,
  options: Options & { safe?: boolean }
) {
  options = Object.assign({
    cwd: process.cwd(),
    safe: true
  }, options)
  const opt = {
    basedir: options.cwd,
    extensions: ['.js', '.json']
  }
  try {
    return resolve.sync(id, opt)
  } catch (err) {
    if (options.safe && err.code === 'MODULE_NOT_FOUND') {
      // 'react' -> './react'
      if (!nps.isAbsolute(id) && !id.trimLeft().startsWith('.')) {
        return cusResolve(`./${id}`, options)
      }
      return false
    }
    throw err
  }
}
