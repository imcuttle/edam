import { Source } from '../../types/Options'
import Error from '../EdamError'
import * as nps from 'path'
import TemplateConfig from '../../types/TemplateConfig'
import { Edam } from '../../index'

module.exports = function(source: Source) {
  const edam = <Edam>this
  if (!nps.isAbsolute(source.url)) {
    return new Error(
      `check the source: ${source.url} is not absolute path of file`
    )
  }

  let tplConfig: TemplateConfig = require(source.url)
  // edam.utils.
  tplConfig.root
}
