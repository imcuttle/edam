/**
 * @file sourceAnalysis
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 *  Analyzes `source`
 */
import {EdamOptions, RCOptions} from '../types/Options'

const toArray = require('./toArray')
const load = require('./loadConfig')


module.exports = function analyze(
  cwd = process.cwd(),
  options: EdamOptions = {
    source: '',
    userc: true,
    cacheDir: true,
    logLevel: 'log'
  }
) {
  let {
    alias,
    source,
    extends: _extends,
    userc,
    name
  } = options

  if (_extends) {
    const extendsArray: Array<string> = toArray(_extends)
    extendsArray.reduce(async (extendSrc, mergedConfig) => {
      await load(extendSrc, { cwd })
      return mergedConfig
    }, {})
  }

}
