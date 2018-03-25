/**
 * @file hookify
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { Hook } from '../../types/TemplateConfig'
import * as cp from 'child_process'

export default function hookify(hook: Hook): Function {
  if (typeof hook === 'function') {
    return hook
  }

  if (typeof hook !== 'string') {
    throw new Error('Hook requires string or function, but ' + typeof hook)
  }
  // string
  return async function (data) {
    const string = JSON.stringify(data)
    cp.execSync(`${hook}`, {
      input: string
    })
    // @todo string
  }
}
