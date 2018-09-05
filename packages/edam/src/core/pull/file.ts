import { Source } from '../../types/Options'
import EdamError from '../EdamError'
import * as nps from 'path'

module.exports = function(source: Source, /*edam: Edam*/): string {
  // console.log(source.url)

  if (!nps.isAbsolute(source.url)) {
    throw new EdamError(
      `check the source: ${source.url} is not absolute path of file`
    )
  }

  return source.url
  // let tplConfig: TemplateConfig = edam.utils.getTemplateConfig(
  //   require(),
  //   [edam]
  // )
  // if (tplConfig.root) {
  //
  // }
}
