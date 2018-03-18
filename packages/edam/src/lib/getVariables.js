/**
 * @file: getVariables
 * @author: Cuttle Cong
 * @date: 2018/1/26
 * @description:
 */
import moment from 'moment'
import nps from 'path'

/**
 * 支持 function、DATE——FORMAT、String rule ...
 * @param old
 * @param rule
 */
// eslint-disable-next-line no-unused-vars
function getVariable(old, rule) {

}

export default function getVariables(variables = {}, options = {}) {
  const {
    DATE = 'YYYY/MM/DD',
    TIME = 'HH:mm',
    DATETIME = DATE + ' ' + TIME,
    AUTHOR = process.env.USER || 'anonymity'
  } = variables

  const {
    cwd = process.cwd(),
    filename = ''
  } = options

  const nowMoment = moment()
  const EXT = nps.extname(filename)
  const DIRNAME = nps.dirname(filename)
  return {
    DATE: nowMoment.format(DATE),
    DATETIME: nowMoment.format(DATETIME),
    TIME: nowMoment.format(TIME),
    FILENAME: filename,
    EXT,
    DIRNAME,
    R_FILENAME: nps.relative(cwd, filename),
    R_DIRNAME: nps.relative(cwd, DIRNAME),
    BASENAME: nps.basename(filename.replace(/\..*?$/, '')),
    AUTHOR
  }
}
