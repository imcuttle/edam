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

function ejsLoader(content: string, options: any, path: string): string {
  let variables: object = this.variables.get()

  // this.root

  // let variables: object = this.root.get()

  return template(content, {

  })(variables)
}

module.exports = ejsLoader
