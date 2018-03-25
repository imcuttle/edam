/**
 * @file fileSystem
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
const mm = require('micromatch')
const nps = require('path')
const fs = require('fs')
const pify = require('pify')
const _ = require('lodash')

function isFile(filename: string): boolean {
  return fs.existsSync(filename) && fs.statSync(filename).isFile()
}

function isDirectory(filename: string): boolean {
  return fs.existsSync(filename) && fs.statSync(filename).isDirectory()
}

const readdir = pify(fs.readdir)
async function readdirDeep(path: string, options?: { filter: any }) {
  let files = [path]
  if (isDirectory(path)) {
    files = await readdir(path, options)
    files = files.map(f => nps.join(path, f))

    for (let i = 0; i < files.length; i++) {
      if (isDirectory(files[i])) {
        const newFiles = await readdirDeep(files[i], {
          ...options,
          filter: null
        })
        files.splice(i, 1)
        files = files.concat(newFiles)
      }
    }
    files = _.uniq(files)
  }
  return options.filter
    ? mm(files, options.filter, { matchBase: true, dot: true })
    : files
}

export default {
  ...fs,
  isFile,
  isDirectory,
  readFile: pify(fs.readFile),
  readdir,
  readdirDeep
}
