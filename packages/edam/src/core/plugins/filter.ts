/**
 * @file filter
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import fileSystem from '../../lib/fileSystem'
import { Edam } from '../../index'
import * as nps from 'path'
import * as _ from 'lodash'
import * as mm from 'micromatch'
import EdamError from '../EdamError'
import * as FileType from 'file-type'
import * as fs from "fs";

const tildify = require('tildify')

const debug = require('debug')('edam:filter')

export default async function filter(/*options*/) {
  const edam = <Edam>this

  edam.prependOnceListener('normalize:templateConfig:after', async templateConfig => {
    // const templateConfig = edam.templateConfig

    if (!templateConfig.root) {
      throw new EdamError('templateConfig.root is required on pre treat: filter')
    }
    const compiler = edam.compiler
    let { root, ignore } = templateConfig
    if (!fileSystem.isDirectory(root)) {
      throw new EdamError(`templateConfig.root ${tildify(root)} is illegal, maybe it is not existed or is file path.`)
    }

    if (_.isFunction(ignore)) {
      ignore = await ignore(compiler.variables)
    }

    let files = await fileSystem.readdirDeep(root, {
      filter: [`!${edam.templateConfigPath}`]
    })

    debug('assets files: %O', files)
    files = mm(
      files.map(f => nps.relative(root, f)),
      ['*'],
      {
        ignore: ignore,
        dot: true,
        matchBase: true
      }
    ).map(f => nps.join(root, f))

    // deep read dir and filter
    debug('assets filter files: %O', files)
    await Promise.all(
      files.map(async function(file) {
        const name = nps.relative(root, file)
        const buffer = await fileSystem.readFile(file)

        const lstat = fileSystem.lstatSync(file)

        compiler.assets[name] = {
          value: buffer,
          meta: {
            filename: file,
            lstat: lstat,
            mime: 'text/plain',
            ...(await FileType.fromBuffer(buffer))
          }
        }
      })
    )
  })
}
