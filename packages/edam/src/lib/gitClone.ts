/* eslint-disable */
// Forked from https://github.com/jaz303/git-clone/blob/master/index.js
// use cross-spawn, instead spawn

var pify = require('pify')
var spawn = require('cross-spawn')


function _checkout(checkout, { targetPath = '', git = 'git' } = {}, cb) {
  var args = ['checkout', checkout]
  var process = spawn(git, args, { cwd: targetPath })

  process.on('close', function(status) {
    if (status == 0) {
      cb && cb()
    } else {
      cb && cb(new Error("'git checkout' failed with status " + status))
    }
  })
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

  var process = spawn(git, args)
  process.on('close', function(status) {
    if (status == 0) {
      if (opts.checkout) {
        checkout()
      } else {
        cb && cb()
      }
    } else {
      cb && cb(new Error("'git clone' failed with status " + status))
    }
  })

  function checkout() {
    _checkout(opts.checkout, { targetPath, git }, cb)
  }
}

function _pullForce(targetPath, cb) {
  var process = spawn('git', ['pull', '--force', '--allow-unrelated-histories'], {
    cwd: targetPath
  })
  process.on('close', function(status) {
    if (status == 0) {
      cb && cb()
    } else {
      cb && cb(new Error("'git pull' failed with status " + status))
    }
  })
}

export default pify(clone)
export const checkout = pify(_checkout)
export const pullForce = pify(_pullForce)
