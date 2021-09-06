
/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */

module.exports = function(/*options*/) {
  return {
    mappers: [
      {
        test: '!**/*'
      }
    ],
    variables: {
      '__name__': JSON.stringify('foo')
    }
  }
}
