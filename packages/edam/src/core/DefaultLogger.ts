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
  silent = false
  public _log = (head, ...arr) => {
    console.log.apply(console, concat(head, arr, logSymbols.info))
  }
  public _success = (head, ...arr) => {
    console.log.apply(console, concat(head, arr, logSymbols.success))
  }
  public _warn = (head, ...arr) => {
    console.warn.apply(console, concat(head, arr, logSymbols.warning))
  }
  public _error = (head, ...arr) => {
    console.error.apply(console, concat(head, arr, logSymbols.error))
  }
  public log = (head, ...arr) => {
    !this.silent && this._log(head, ...arr)
  }
  public success = (head, ...arr) => {
    !this.silent && this._success(head, ...arr)
  }
  public warn = (head, ...arr) => {
    !this.silent && this._warn(head, ...arr)
  }
  public error = (head, ...arr) => {
    this._error(head, ...arr)
  }
}
