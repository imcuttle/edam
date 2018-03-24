/**
 * @file sourceAnalysis
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 *  Analyzes `source`
 */

export default function toArray(item: any): Array<any> {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}
