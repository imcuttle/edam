/**
 * @file hookify
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { Hook } from '../../types/TemplateConfig'
const spawn = require('cross-spawn')

const debug = require('debug')('edam:hookify')

export default function hookify(hook: Hook): Function {
  if (typeof hook === 'function') {
    return hook
  }

  if (typeof hook !== 'string') {
    throw new Error('Hook requires string or function, but ' + typeof hook)
  }

  debug('hockify cmd: %s', hook)
  // string
  return async function(data) {
    const string = JSON.stringify(data)
    debug('invoke cmd hook %s \n with input: %O', hook, data)
    let proc = spawn(`${hook}`, {
      input: string
    })

    return new Promise((resolve, reject) => {
      const chunks = []
      proc.on('data', chunk => {
        chunks.push(chunk)
      })
      proc.on('end', () => {
        debug('[%s] %s', hook, Buffer.concat(chunks).toString())
      })
      proc.on('error', function(err) {
        reject(err)
      })
      proc.on('close', status => {
        // eslint-disable-next-line eqeqeq
        if (status == 0) {
          resolve(Buffer.concat(chunks).toString())
        } else {
          reject(
            new Error(JSON.stringify(hook) + ' failed with status ' + status)
          )
        }
      })
    })
  }
}
