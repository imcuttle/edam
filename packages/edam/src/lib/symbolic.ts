/**
 * @file symbolic
 * @author Cuttle Cong
 * @date 2018/3/29
 * @description
 */
import * as _ from 'lodash'

function symbolic(target, property, [ref, prop]) {
  Object.defineProperty(target, property, {
    get() {
      return _.get(ref, prop)
    },
    set(val) {
      return _.set(ref, prop, val)
    }
  })
}

export default symbolic
