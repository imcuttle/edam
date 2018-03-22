/**
 * @file fileSystem
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
const fs = require('fs')
const pify = require('pify')

function isFile(filename: string): boolean {
  return fs.existsSync(filename)
    && fs.statSync(filename).isFile()
}

function isDirectory(filename: string): boolean {
  return fs.existsSync(filename)
    && fs.statSync(filename).isDirectory()
}

module.exports = {
  ...fs,
  isFile,
  isDirectory,
  readFile: pify(fs.readFile)
}
