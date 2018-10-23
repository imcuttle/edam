/**
 * @file plopHandlebar
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

import * as Handlebars from 'handlebars'
import * as changeCase from 'change-case'
import detectLegacyLodash from './detectLegacyLodash'
import * as lineColPath from 'line-column-path'
import * as link from 'terminal-link'
import chalk from 'chalk'

// Creates an isolated Handlebars environment
const handlebars = Handlebars.create()

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

// Register helpers
Object.keys(helpers).forEach(h => handlebars.registerHelper(h, helpers[h]))
// https://github.com/helpers/handlebars-helpers
require('handlebars-helpers')({
  handlebars: handlebars
})

function hbsLoader(content: string, variables): string {
  // Object.keys(partials).forEach(p => handlebars.registerPartial(p, partials[p]))
  const { options, path, compiler } = this
  const error =
    compiler && typeof compiler.logger.error === 'function'
      ? compiler.logger.error
      : console.error

  if (typeof options.process === 'function') {
    options.process(handlebars)
  }

  const posList = detectLegacyLodash(content, variables)
  if (posList.length) {
    posList.forEach(pos => {
      error(
        chalk.whiteBright.bgRed(lineColPath.stringify({ file: path, ...pos })),
        `Detected using the deprecated Lodash loader, please ${link(
          'replace it',
          'https://bit.ly/2CYM8lC'
        )} by handlebar.`
      )
    })
  }

  return handlebars.compile(content)(variables)
}

module.exports = hbsLoader
