/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import EdamError from '../EdamError'
import { EdamConfig, Source } from '../../types/Options'
import gitClone from '../../lib/gitClone'
import sourceFilenamily from '../sourceFilenamily'
import { join } from 'path'

module.exports = async function(
  source: Source,
  destDir: string,
  config: EdamConfig
) {
  const { cacheDir } = config
  const log = (this && this.logger && this.logger.log) || function() {}

  const target = join(destDir, sourceFilenamily(source))
  if (cacheDir) {
    await gitClone(source.url, target, {
      checkout: source.checkout
    })
    //
  }
  throw new EdamError('todo git')
}
