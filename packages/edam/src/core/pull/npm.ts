/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import EdamError from '../EdamError'
import { Source } from '../../types/Options'

module.exports = function(
  source: Source,
  options: { npmClient?: 'yarn' | 'npm'; cacheDir?: boolean | string } = {
    cacheDir: false,
    npmClient: 'npm'
  }
) {
  const {
    // npmClient = 'npm',
    cacheDir
  } = options
  if (cacheDir) {
    //
  }
  throw new EdamError('todo npm')
}
