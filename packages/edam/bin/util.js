/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

const c = require('chalk')

exports.generateFlagHelp = function generateFlagHelp(flags = [], indentPrefix = '') {
  let maxNameLen = 0
  let maxDescLen = 0
  let list = flags.map(({ name, alias, desc = '', default: _d }) => {
    name = (alias ? `-${alias}, ` : '') + `--${name}`
    maxNameLen = Math.max(maxNameLen, name.length)
    maxDescLen = Math.max(maxDescLen, desc.length)
    return [name, desc, _d != null ? `[default: ${_d}]` : '']
  })

  // align
  return list
    .map(arr => {
      if (arr[0].length < maxNameLen) {
        arr[0] = arr[0] + Array(maxNameLen - arr[0].length + 1).join(' ')
      }
      if (arr[1].length < maxDescLen) {
        arr[1] = arr[1] + Array(maxDescLen - arr[1].length + 1).join(' ')
      }
      arr[0] = c.keyword('plum')(arr[0])
      arr[1] = c.blue(arr[1])
      arr[2] = c.keyword('lightgrey')(arr[2])
      return indentPrefix + arr.join('   ')
    })
    .join('\n')
}

exports.generateFlagData = function generateFlagData(flags = []) {
  return flags.reduce((set, { name, alias, type, /*desc = '', */default: _d }) => {
    set[name] = {
      alias,
      type,
      default: _d
    }
    return set
  }, {})
}

// const spinner = require('ora')()
// setTimeout(function () {
//   spinner.start('asdadas')
// }, 2000)
//
// setTimeout(function () {
//   spinner.succeed('asdadas')
// }, 4000)
