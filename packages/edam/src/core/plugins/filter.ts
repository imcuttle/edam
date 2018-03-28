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
import toArray from '../../lib/toArray'

import * as mm from 'micromatch'

export default async function filter(/*options*/) {
  const edam = <Edam>this

  edam.prependOnceListener(
    'normalize:templateConfig:after',
    async templateConfig => {
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

      let files = await fileSystem.readdirDeep(root, {
        filter: [`!${edam.templateConfigPath}`]
      })

      files = mm(files.map(f => nps.relative(root, f)), ['*'], {
        ignore: ignore,
        dot: true,
        matchBase: true
      }).map(f => nps.join(root, f))

      // deep read dir and filter
      await Promise.all(
        files.map(async function(file) {
          compiler.assets[nps.relative(root, file)] = {
            value: await fileSystem.readFile(file, { encoding: 'utf8' })
          }
        })
      )
    }
  )
}
