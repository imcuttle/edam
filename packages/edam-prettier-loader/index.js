/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/31
 * @description
 */
const prettier = require('prettier')

module.exports = function(content) {
  const path = this.path
  const { filePath, ...options } = this.options
  if (filePath) {
    return prettier.resolveConfig(filePath).then(rcOptions => {
      return prettier.format(content, {
        // parser: 'babylon',
        ...rcOptions,
        ...options,
        filepath: path
      })
    })
  }

  return prettier.format(content, { /*parser: 'babylon', */...options, filepath: path })
}

module.exports.allowError = true
