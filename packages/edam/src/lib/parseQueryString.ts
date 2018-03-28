import parseQuery from './parseQuery'

/**
 * @file parseQueryString
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

export default function parseQueryString(source: string) {
  let qIndex = source.lastIndexOf('?')
  let query = {}
  let tmpSource = source
  if (qIndex >= 0) {
    query = parseQuery(source.slice(qIndex + 1))
    tmpSource = source.substring(0, qIndex)
  }
  return {
    query,
    name: tmpSource
  }
}
