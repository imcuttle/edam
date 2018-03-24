/**
 * @file merge
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
import * as _ from 'lodash'
import toArray from './toArray'

export default async function get<T> (data, args): Promise<T> {
  if (_.isFunction(data)) {
    return await data(toArray(args))
  }
  return data
}
