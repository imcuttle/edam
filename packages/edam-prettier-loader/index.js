/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/31
 * @description
 */
const prettier = require('prettier')

module.exports = function(content) {
  const { filePath, ...options } = this.options
  if (filePath) {
    return prettier.resolveConfig(filePath).then(rcOptions => {
      return prettier.format(content, { ...rcOptions, ...options })
    })
  }

  return prettier.format(content, options)
}
