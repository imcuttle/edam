/**
 * @file filter
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import EdamError from '../EdamError'
import fileSystem from '../../lib/fileSystem'
import toArray from '../../lib/toArray'
import { NormalizedTemplateConfig } from './normalize'
import { Edam } from '../../index'

export default function filter(/*options*/) {
  const edam = <Edam>this
  const templateConfig = edam.templateConfig
  if (!templateConfig.root) {
    throw new EdamError('templateConfig.root is required on pre treat: filter')
  }
  let { root, files } = templateConfig
  files = toArray(files)
  if (!fileSystem.existsSync(root)) {
    throw new EdamError(`templateConfig.root "${root}" is not found`)
  }

  if (fileSystem.isDirectory(root)) {
    files.forEach(glob => {})
  }
}
