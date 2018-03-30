/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

const c = require('chalk')
const cliui = require('cliui')
const cliWidth = require('cli-width')
const CLI_WIDTH = cliWidth()

exports.generateFlagHelp = function generateFlagHelp(flags = []) {
  const ui = cliui()
  let maxNameLen = 0
  let maxDescLen = 0
  let list = flags.map(({ name, alias, desc = '', default: _d }) => {
    name = (alias ? `-${alias}, ` : '') + `--${name}`
    maxNameLen = Math.max(maxNameLen, name.length)

    maxDescLen = Math.max.apply(
      null,
      [maxDescLen].concat(desc.split('\n').map(x => x.length))
    )

    return [name, desc, _d != null ? `[default: ${_d}]` : '']
  })

  // 50 is gussed align right chars width
  maxDescLen = Math.min(maxDescLen, CLI_WIDTH - (maxNameLen + 11) - 50)
  // align
  list.map(arr => {
    ui.div(
      {
        text: c.keyword('plum')(arr[0]),
        width: maxNameLen + 11,
        padding: [0, 5, 0, 6]
      },
      {
        text: c.blue(arr[1]),
        width: maxDescLen
      },
      {
        text: c.keyword('lightgrey')(arr[2]),
        align: 'right'
      }
    )
  })

  return ui.toString()
}

exports.generateFlagData = function generateFlagData(flags = []) {
  return flags.reduce(
    (set, { name, alias, type, /*desc = '', */ default: _d }) => {
      set[name] = {
        alias,
        type,
        default: _d
      }
      return set
    },
    {}
  )
}
