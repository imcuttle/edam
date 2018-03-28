// https://github.com/mmalecki/spawn-command/blob/master/lib/spawn-command.js
/**
 * @file runner
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
const spawn = require('cross-spawn')

export default function(command, options) {
  let file, args
  if (process.platform === 'win32') {
    file = 'cmd.exe'
    args = ['/s', '/c', '"' + command + '"']
    options = Object.assign({}, options)
    options.windowsVerbatimArguments = true
  } else {
    file = '/bin/sh'
    args = ['-c', command]
  }
  file = file || options.shell

  return spawn(file, args, options)
}
