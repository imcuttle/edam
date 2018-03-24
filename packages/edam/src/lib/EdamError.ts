/**
 * @file EdamError
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */

export default class EdamError extends Error {
  public id = 'EDAM_ERROR'
  constructor(message: string, public code?) {
    super(`[EDAM] ${message}`)
    this.code = code
    // https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
    Error.captureStackTrace(this, EdamError)
  }
}
