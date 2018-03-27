/**
 * @file filter
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import EdamError from '../EdamError'
import fileSystem from '../../lib/fileSystem'
import { Edam } from '../../index'
import * as nps from 'path'
import * as _ from 'lodash'

function oppositeGlob(globs: Array<string>): Array<string> {
  return globs.map(function (glob) {
    glob = glob.trimLeft()
    if (glob.startsWith('!')) {
      glob = glob.slice(1)
    }
    else {
      glob = '!' + glob
    }
    return glob
  })
}

export default async function filter(/*options*/) {
  const edam = <Edam>this

  edam.on('normalize:templateConfig:after', async templateConfig => {
    // const templateConfig = edam.templateConfig

    if (!templateConfig.root) {
      throw new Error('templateConfig.root is required on pre treat: filter')
    }
    const compiler = edam.compiler
    let { root, ignore } = templateConfig
    if (!fileSystem.existsSync(root)) {
      throw new Error(`templateConfig.root "${root}" is not found`)
    }

    if (_.isFunction(ignore)) {
      ignore = await ignore(compiler.variables)
    }

    const files = await fileSystem.readdirDeep(root, {
      filter: [`!${edam.templateConfigPath}`].concat(oppositeGlob(ignore))
    })
    // deep read dir and filter
    await Promise.all(
      files.map(async function(file) {
        compiler.assets[nps.relative(root, file)] = {
          value: await fileSystem.readFile(file, { encoding: 'utf8' })
        }
      })
    )
  })
}
