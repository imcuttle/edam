/**
 * @file ink
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */

import { Component as IComponent } from 'ink'
export {
  h,
  render,
  Text
} from 'ink'

export class Component extends IComponent {
  setState: Function
  state: object
  props: object
}
