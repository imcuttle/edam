import { Source } from '../../types/Options'
import Error from '../EdamError'
import * as nps from 'path'

module.exports = function(
  source: Source
) {
  if (!nps.isAbsolute(source.url)) {
    return new Error(`check the source: ${source.url} is not absolute path of file`)
  }

  source.url
}
