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

exports.getRawArgs = flags => {
  const booleans = []
  const aliases = []
  const minimistOpts = flags.reduce(
    (opts, flag) => {
      if (flag.type === 'boolean') {
        booleans.push(flag.name)
      } else if (flag.type === 'string') {
        opts.string.push(flag.name)
      }
      if (flag.alias) {
        aliases.push(flag.alias)
        opts.alias[flag.name] = flag.alias
      }
      return opts
    },
    {
      string: [],
      boolean: [],
      alias: {}
    }
  )

  const rawArgv = require('minimist')(process.argv.slice(2), minimistOpts)

  Object.keys(rawArgv).forEach(name => {
    if (booleans.includes(name)) {
      rawArgv[name] = Boolean(rawArgv[name])
    }
    if (aliases.includes(name)) {
      delete rawArgv[name]
    }
  })

  const input = rawArgv._
  delete rawArgv._
  return {
    input,
    flags: rawArgv
  }
}

exports.generateFlagHelp = function generateFlagHelp(flags = []) {
  const ui = cliui()
  let maxNameLen = 0
  let maxDescLen = 0
  let rightMax = 0
  let list = flags.map(({name, alias, desc = '', default: _d}) => {
    name = (alias ? `-${alias}, ` : '') + `--${name}`
    maxNameLen = Math.max(maxNameLen, name.length)
    maxDescLen = Math.max.apply(null, [maxDescLen].concat(desc.split('\n').map(x => x.length)))

    _d = typeof _d !== 'function' && _d != null ? `[default: ${String(_d).trim()}]` : ''
    rightMax = Math.max(_d.length, rightMax)
    return [name, desc, _d]
  })

  const shouldDefaultHidden = CLI_WIDTH <= 90

  // 50 is gussed align right chars width
  maxDescLen = Math.min(maxDescLen, CLI_WIDTH - (maxNameLen + 11) - (shouldDefaultHidden ? 0 : rightMax))
  // align
  list.forEach(arr => {
    let children = [
      {
        text: c.keyword('plum')(arr[0]),
        width: maxNameLen + 11,
        padding: [0, 5, 0, 6]
      },
      {
        text: c.blue(arr[1]),
        width: maxDescLen,
        padding: [0, 6, 0, 0]
      },
      !shouldDefaultHidden && {
        text: c.keyword('lightgrey')(arr[2]),
        width: rightMax
        // align: 'right'
      }
    ].filter(Boolean)

    ui.div.apply(ui, children)
  })

  return ui.toString()
}

exports.generateFlagData = function generateFlagData(flags = []) {
  return flags.reduce((set, {name, alias, type, /*desc = '', */ default: _d}) => {
    set[name] = {
      alias,
      type,
      default: _d
    }
    return set
  }, {})
}
