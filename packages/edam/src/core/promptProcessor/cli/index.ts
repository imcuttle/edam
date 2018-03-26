/**
 * @file ink
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import { Prompt, Variable } from '../../../types/TemplateConfig'
const inquirer = require('inquirer')
const debug = require('debug')('edam:inquirer')

export default async function(prompt: Prompt): Promise<Variable> {
  debug('input: %O', prompt)
  const answers = await inquirer.prompt([prompt])
  debug('output: %O', answers)
  return answers[prompt.name]
}
