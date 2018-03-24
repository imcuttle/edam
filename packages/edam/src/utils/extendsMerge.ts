/**
 * @file merge
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
import * as _ from 'lodash'

export default function extendsMerge(source, ...objects: Array<object>) {
  return _.mergeWith(source, ...objects, function customizer(sourceVal, extendsVal) {
    if (_.isArray(sourceVal)) {
      return _.uniq(extendsVal.concat(sourceVal))
    }
  })
}
