import * as _ from 'lodash'

export default function(replaceCtx: object, string: string) {
  return string.replace(/\${(.+?)}/g, (__, key) => {
    if (_.hasIn(replaceCtx, key)) {
      return _.get(replaceCtx, key).toString()
    }
    return __
  })
}
