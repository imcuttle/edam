/* eslint-disable */
// Forked from https://github.com/egoist/yarn-install
// use async instead sync
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const processAsync_1 = require('./processAsync')
const spawn = require('execa')
// cache the install check result
let yarnInstalled
let npmInstalled
// cache npm version check result
let isNpm5

// @ts-ignore
function getPm({ respectNpm5 } = {}) {
  return (respectNpm5 && checkNpmVersion()) || !checkYarnInstalled()
    ? 'npm'
    : 'yarn'
}
// const install = require('yarn-install)
//
// with dependencies
// install(['webpack', 'ava'], {saveDev: true})
// install(['webpack', 'ava'], {save: true})
// install(['webpack', 'ava'], {global: true})
//
// omit dependencies
// it runs npm install or yarn install directly
// install(options)
//
// remove dependencies
// install(['webpack'], {remove: true})
// install(['webpack'], {remove: true, global: true})
module.exports = function(deps, opts) {
  // first argument is not an array
  // then treat it as opts
  if (!Array.isArray(deps)) {
    opts = deps
    deps = null
  }
  opts = opts || {}
  const cwd = opts.cwd
  const stdio = opts.stdio === undefined ? 'inherit' : opts.stdio
  const command = getPm({ respectNpm5: opts.respectNpm5 })
  let args
  if (command === 'yarn') {
    args = getArgs({
      // yarn global
      global: opts.global,
      // yarn add
      add: deps && !opts.remove,
      // yarn install
      install: !deps && !opts.remove,
      // yarn remove
      remove: opts.remove,
      // yarn --dev
      '--dev': opts.dev,
      // yarn --production
      // only install dependencies
      '--production': opts.production
    })
  } else {
    args = getArgs({
      // npm install
      install: !opts.remove,
      // npm uninstall
      uninstall: opts.remove,
      '--save': !opts.dev && !opts.global,
      // npm --save0dev
      '--save-dev': opts.dev,
      // npm --global
      '--global': opts.global,
      // yarn --production
      // only install dependencies
      '--production': opts.production
    })
  }
  if (opts.args) {
    args = args.concat(opts.args || [])
  }
  if (deps) {
    args = args.concat(deps)
  }
  if (opts.showCommand) {
    console.log('>', command, args.join(' '))
  }
  const proc = spawn.shell(command + ' ' + args.join(' '), {
    stdio,
    cwd,
    env: getEnv(opts, command === 'yarn')
  })
  return new Promise((resolve, reject) => {
    processAsync_1.default(proc, [command].concat(args).join(' '), function(
      error,
      stdout,
      stderr
    ) {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}
module.exports.yarnInstalled = yarnInstalled
module.exports.isNpm5 = isNpm5
module.exports.getPm = getPm
function checkYarnInstalled() {
  if (typeof yarnInstalled !== 'undefined') return yarnInstalled
  try {
    const command = spawn.shellSync('yarn --version')
    const installed = command.stdout && command.stdout.toString().trim()
    yarnInstalled = installed
  } catch (e) {
    yarnInstalled = false
  }

  return yarnInstalled
}

function checkNpmInstalled() {
  if (typeof npmInstalled !== 'undefined') return npmInstalled
  try {
    const command = spawn.shellSync('npm --version')
    const installed = command.stdout && command.stdout.toString().trim()
    npmInstalled = installed
  } catch (e) {
    npmInstalled = false
  }

  return npmInstalled
}

function checkNpmVersion() {
  if (typeof isNpm5 !== 'undefined') return isNpm5
  if (!checkNpmInstalled()) {
    return false
  }
  const command = spawn.sync('npm', ['--version'])
  const majorVersion = command.stdout
    .toString()
    .trim()
    .split('.')[0]
  isNpm5 = majorVersion >= 5
  return isNpm5
}

function getArgs(obj) {
  return Object.keys(obj).filter(name => obj[name])
}
function getEnv(opts, isYarn) {
  const env = Object.assign({}, process.env)
  if (opts.registry) {
    if (isYarn) env.yarn_registry = opts.registry
    else env.npm_config_registry = opts.registry
  }
  return env
}
