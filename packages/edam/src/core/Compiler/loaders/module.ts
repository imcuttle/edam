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

function moduleLoader(content: string, variables): string {
  // const options = this.options
  // this.root

  const root = this.root
  const path = this.path

  console.log(root, path)

  // let variables: object = this.root.get()

  return template(content, {})(variables)
}

module.exports = moduleLoader
