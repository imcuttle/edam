/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import * as pReduce from 'p-reduce'
import { Prompt, Variables } from '../../types/TemplateConfig'
import evaluate from '../../lib/eval'
import cliProcess from './cli'
import * as _ from 'lodash'

export default async function prompt(
  prompts: Array<Prompt>,
  { yes = true, promptProcess = cliProcess, context = {} } = {}
): Promise<Variables> {
  if (!_.isFunction(promptProcess)) {
    throw new Error('prompt missing the process')
  }

  return await pReduce(
    prompts,
    async function(set, prompt) {
      prompt = { ...prompt }
      // @todo inject context
      if (_.isFunction(prompt.default)) {
        prompt.default = await prompt.default(set, context)
      }

      if (yes) {
        return Object.assign(set, { [prompt.name]: prompt.default })
      }

      let allow = true
      if (_.isString(prompt.when)) {
        prompt.when = evaluate(prompt.when, set)
      }
      if (_.isFunction(prompt.when)) {
        allow = await prompt.when(set)
      }
      if (allow) {
        const transformer = prompt.transformer
        delete prompt.transformer
        let value = await promptProcess(prompt)
        if (_.isFunction(transformer)) {
          value = await transformer(value, set, context)
        }
        Object.assign(set, {
          [prompt.name]: value
        })
      }
      return set
    },
    {}
  )
}
