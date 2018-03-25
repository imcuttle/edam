
/**
 * @file sourceAnalysis
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 *  Analyzes `source`
 */

export default function toArray<T>(item: any): Array<T> {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}
