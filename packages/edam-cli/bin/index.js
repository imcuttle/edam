#!/usr/bin/env node

const importLocal = require('import-local')

if (importLocal(__filename)) {
  console.log('using local version of edam')
} else {
  const resolveFrom = require('resolve-from')
  const Module = require('module')

  const _resolveFilename = Module._resolveFilename

  const unhook = () => {
    Module._resolveFilename = _resolveFilename
  }
  const hook = () => {
    Module._resolveFilename = function(request, parent, isMain, options) {
      const basedir = parent ? parent.filename : process.cwd()
      // require('edam*'), 可以允许使用全局环境的 edam*
      if (request.startsWith('edam')) {
        unhook()
        let result =
          resolveFrom.silent(basedir, request) ||
          resolveFrom(__dirname, request)
        hook()
        return result
      }

      return _resolveFilename.call(this, request, parent, isMain, options)
    }
  }

  hook()
  require('./edam')
}
