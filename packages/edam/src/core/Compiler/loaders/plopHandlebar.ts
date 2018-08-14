/**
 * @file plopHandlebar
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import * as handlebars from 'handlebars'
import * as changeCase from 'change-case'

const helpers = {
  ...changeCase,
  camelCase: changeCase.camel,
  snakeCase: changeCase.snake,
  dotCase: changeCase.dot,
  pathCase: changeCase.path,
  lowerCase: changeCase.lower,
  upperCase: changeCase.upper,
  sentenceCase: changeCase.sentence,
  constantCase: changeCase.constant,
  titleCase: changeCase.title,

  dashCase: changeCase.param,
  kabobCase: changeCase.param,
  kebabCase: changeCase.param,

  properCase: changeCase.pascal,
  pascalCase: changeCase.pascal
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
