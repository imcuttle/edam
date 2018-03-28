/**
 * @file ejs
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import { template } from 'lodash'

/** Used to match template delimiters. */
// let reEscape = /<%-([\s\S]+?)%>/g
// let reEvaluate = /<%([\s\S]+?)%>/g
// let reInterpolate = /<%=([\s\S]+?)%>/g

function loDashLoader(content: string, variables): string {
  const options = this.options
  // this.root

  // let variables: object = this.root.get()

  return template(content, options)(variables)
}

module.exports = loDashLoader
