/**
 * @file hookify
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { Hook } from '../../types/TemplateConfig'
import processAsync from '../../lib/processAsync'
import runner from '../../lib/runner'
const pify = require('pify')

const debug = require('debug')('edam:hookify')

export default function hookify(hook: Hook, cwd: string): Function {
  if (typeof hook === 'function') {
    return hook
  }

  if (typeof hook !== 'string') {
    throw new Error('Hook requires string or function, but ' + typeof hook)
  }

  debug('hockify cmd: %s', hook)
  // string
  return async function(...args) {
    // const string = JSON.stringify(args)
    debug('invoke cmd hook "%s" \n with input: %O', hook, args)

    const env = Object.assign({}, process.env, {
      HOOK_PARAMS: JSON.stringify(args)
    })
    args.forEach(function (arg, index) {
      env['HOOK_PARAMS_' + index] = arg.toString()
    })
    let proc = runner(hook, {
      env,
      cwd
    })
    const output = await pify(processAsync)(proc, `[${hook}]`)
    debug('hook "%s" output: %s', hook, output)
    return
  }
}
