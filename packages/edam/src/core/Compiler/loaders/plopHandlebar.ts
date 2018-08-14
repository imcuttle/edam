/**
 * @file plopHandlebar
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import * as handlebars from 'handlebars'
import * as changeCase from 'change-case'

const helpers = {
  ...changeCase
}

function hbsLoader(content: string, variables): string {
  Object.keys(helpers).forEach(h => handlebars.registerHelper(h, helpers[h]))
  // Object.keys(partials).forEach(p => handlebars.registerPartial(p, partials[p]))
  const options = this.options
  if (typeof options.process === 'function') {
    options.process(handlebars)
  }

  return handlebars.compile(content)(variables)
}

module.exports = hbsLoader
