/**
 * @file logger
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */

import c from 'chalk'
import { Logger } from '../types/core'
const logSymbols = require('log-symbols')

function concat(head, arr, label) {
  const out = []
  if (typeof head === 'string' || head instanceof String) {
    out.push(label + ' ' + head)
  } else {
    out.push(label)
    out.push(head)
  }
  return out.concat(arr)
}

export default class DefaultLogger implements Logger {
  public log(head, ...arr) {
    console.log.apply(console, concat(head, arr, logSymbols.info))
  }
  public success(head, ...arr) {
    console.log.apply(console, concat(head, arr, logSymbols.success))
  }
  public warn(head, ...arr) {
    console.warn.apply(console, concat(head, arr, logSymbols.warning))
  }
  public error(head, ...arr) {
    console.error.apply(console, concat(head, arr, logSymbols.error))
  }
}
