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

export default async function filter(/*options*/) {
  const edam = <Edam>this
  const templateConfig = edam.templateConfig
  if (!templateConfig.root) {
    throw new EdamError('templateConfig.root is required on pre treat: filter')
  }
  const compiler = edam.compiler
  let { root, files } = templateConfig
  if (!fileSystem.existsSync(root)) {
    throw new EdamError(`templateConfig.root "${root}" is not found`)
  }

  // @todo dynamic files
  compiler.variables

  files = await fileSystem.readdirDeep(root, {
    filter: [`!${edam.templateConfigPath}`].concat(files)
  })
  if (!files || !files.length) {
    // eslint-disable-next-line quotes
    throw new EdamError("files is empty, may be you don't set files field.")
  }
  // deep read dir and filter
  await Promise.all(
    files.map(async function(file) {
      compiler.assets[nps.relative(root, file)] = {
        value: await fileSystem.readFile(file, { encoding: 'utf8' })
      }
      return
    })
  )

  // compiler.assets[]
}
