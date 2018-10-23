/**
 * @file detectLegacyLodash
 * @author Cuttle Cong
 * @date 2018/10/23
 *
 */
const loc = require('vfile-location')

export default function detectLegacyLodash(content: string, variables = {}) {
  function check(
    reg: RegExp,
    // eslint-disable-next-line no-unused-vars
    { requiresVar = true, confirm = (name: string) => true } = {}
  ) {
    let posList = []

    let arr: RegExpExecArray
    while ((arr = reg.exec(content)) !== null) {
      const start = arr.index
      let name = RegExp.$1.trim()

      if (confirm(name)) {
        if (!requiresVar || variables.hasOwnProperty(name)) {
          const pos = loc(content).toPosition(start)
          // {line: 3, column: 3, offset: 10}
          posList.push(pos)
        }
      }
    }
    return posList
  }

  return check(/<%-([\s\S]+?)%>/g)
    .concat(check(/<%=([\s\S]+?)%>/g))
    .concat(
      check(/<%(?:[^=-])([\s\S]+?)%>/g, {
        requiresVar: false
      })
    )
}
