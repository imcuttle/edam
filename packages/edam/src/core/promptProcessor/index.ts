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

const debug = require('debug')('edam:promptProcessor')

export default async function prompt(
  prompts: Array<Prompt>,
  { yes = true, promptProcess = cliProcess, context = {} } = {}
): Promise<Variables> {
  if (!_.isFunction(promptProcess)) {
    throw new Error('prompt is missing the process')
  }
  debug('input: %O', prompts)
  const res = await pReduce(
    prompts,
    async function(set, prompt) {
      prompt = { ...prompt }
      let allow = true
      if (_.isString(prompt.when)) {
        allow = <boolean>!!evaluate(prompt.when, set)
      } else if (_.isFunction(prompt.when)) {
        allow = await prompt.when(set)
      }
      if (!allow) return set
      // ${git.email}
      // ${git.name}
      // ${pm}
      // ${dirName}
      if (_.isString(prompt.default)) {
        const replaceCtx = _.merge({}, set, context)
        prompt.default = prompt.default.replace(/\${(.+?)}/g, (__, key) => {
          if (_.hasIn(replaceCtx, key)) {
            return _.get(replaceCtx, key).toString()
          }
          return __
        })
      }
      if (_.isFunction(prompt.default)) {
        prompt.default = await prompt.default(set, context)
      }

      let value
      const {
        transformer,
        validate
      } = prompt
      delete prompt.when
      delete prompt.transformer
      delete prompt.validate
      if (yes && prompt.yes !== false) {
        value = prompt.default
      } else {
        value = await promptProcess(prompt)
      }
      if (_.isFunction(transformer)) {
        value = await transformer(value, set, context)
      }

      if (_.isFunction(validate) && !await validate(value, set, context)) {
        this.logger.warn('validate %s failed, so the value "%s" is ignored.', prompt.name, value)
        return set
      }

      Object.assign(set, {
        [prompt.name]: value
      })
      return set
    },
    {}
  )
  debug('output: %O', res)
  return res
}
