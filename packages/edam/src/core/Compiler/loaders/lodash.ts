/**
 * @file ejs
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import { template } from 'lodash'
import Compiler from '../index'

/** Used to match template delimiters. */
// let reEscape = /<%-([\s\S]+?)%>/g
// let reEvaluate = /<%([\s\S]+?)%>/g
// let reInterpolate = /<%=([\s\S]+?)%>/g

let hasExecuted = false
function loDashLoader(content: string, variables): string {
  let compiler = <Compiler>this.compiler
  if (!hasExecuted) {
    compiler.logger.deprecated('loDashLoader will be removed in edam@3, Please see https://imcuttle.github.io/edam/advanced/write-loader for more information.')
    hasExecuted = true
  }
  const options = this.options

  return template(content, { interpolate: /<%=([\s\S]+?)%>/g, ...options })(
    variables
  )
}

module.exports = loDashLoader
