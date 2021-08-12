/**
 * @file fileSystem
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
const nps = require('path')
const fs = require('fs')
const pify = require('pify')
const _ = require('lodash')
const rimraf = require('rimraf')
const match = require('./match').default

function isSymbolicLink(filename: string): boolean {
  return fs.lstatSync(filename).isSymbolicLink()
}

function isFile(filename: string): boolean {
  return fs.existsSync(filename) && fs.lstatSync(filename).isFile()
}

function isDirectory(filename: string): boolean {
  return fs.existsSync(filename) && fs.lstatSync(filename).isDirectory()
}

const readdir = pify(fs.readdir)
async function readdirDeep(path: string, options?: { filter?: any }) {
  options = options || {}
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
        i--
      }
    }
    files = _.uniq(files)
  }
  return options.filter
    ? match(files, options.filter)
    : files
}

async function cleanDir(path: string): Promise<undefined> {
  return pify(rimraf)(path)
}



export default {
  ...fs,
  isFile,
  isDirectory,
  lstatSync: fs.lstatSync,
  isSymbolicLink,
  readFile: pify(fs.readFile),
  writeFile: pify(fs.writeFile),
  readdir,
  readdirDeep,
  cleanDir
}
