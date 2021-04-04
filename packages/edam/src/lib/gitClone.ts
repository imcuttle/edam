/* eslint-disable */
// Forked from https://github.com/jaz303/git-clone/blob/master/index.js
// use cross-spawn, instead spawn

import processAsync from "./processAsync";

var pify = require('pify')
var spawn = require('cross-spawn')
var env = {
  ...process.env,
  GIT_TERMINAL_PROMPT: '0'
}

function _checkout(checkout, { targetPath = '', git = 'git' } = {}, cb) {
  var args = ['checkout', checkout]
  var process = spawn(git, args, { env, cwd: targetPath })

  processAsync(process, 'git checkout', cb)
}

function clone(repo, targetPath, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = null
  }

  opts = opts || {}

  var git = opts.git || 'git'
  var args = ['clone']

  if (opts.shallow) {
    args.push('--depth')
    args.push('1')
    args.push('--recurse-submodules')
    args.push('-j8')
  }

  args.push('--')
  args.push(repo)
  args.push(targetPath)

  var process = spawn(git, args, {env})
  processAsync(process, 'git clone', function (err, stdout) {
    if (opts.checkout) {
      checkout()
    } else {
      cb && cb()
    }
  })

  function checkout() {
    _checkout(opts.checkout, { targetPath, git }, cb)
  }
}

function _pullForce(targetPath, cb) {
  var process = spawn(
    'git',
    ['pull', '--force', '--allow-unrelated-histories'],
    {
      cwd: targetPath,
      env
    }
  )

  processAsync(process, 'git pull', cb)
}

export default pify(clone)
export const checkout = pify(_checkout)
export const pullForce = pify(_pullForce)
