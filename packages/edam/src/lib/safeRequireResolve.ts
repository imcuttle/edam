/**
 * @file safeRequireResolve
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */

function safeRequireResolve(path: string) {
  try {
    return require.resolve(path)
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return false
    }
    throw error
  }
}

export default safeRequireResolve
