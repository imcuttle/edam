import { Variable, Variables } from '../../types/TemplateConfig'
import * as _ from 'lodash'
const pReduce = require('p-reduce')

/**
 * @file Variables
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

// export type VariablesController = {
//   always: Function
//   once: Function
//   _type: 'once' | 'always'
// }

export default class VariablesStore {
  public store: Variables = {}
  public merge(vars: Variables) {
    _.merge(this.store, vars)
    return this
  }
  public assign(vars: Variables) {
    _.assign(this.store, vars)
    return this
  }
  public setStore(variables: Variables) {
    this.store = variables
    return this
  }

  public set(key: string | string[], data: any) {
    _.set(this.store, key, data)
    return this
  }

  public clear() {
    this.store = {}
    return this
  }

  private async _get(key: string | string[]): Promise<Variable> {
    const variable = _.get(this.store, key)
    if (!variable) {
      return variable
    }

    // if (_.isFunction(variable)) {
    //   const vCenter: VariablesController = {
    //     _type: 'once',
    //     once() {
    //       this._type = 'once'
    //     },
    //     always() {
    //       this._type = 'always'
    //     }
    //   }
    //   rlt = await variable(vCenter)
    //   if (vCenter._type === 'once') {
    //     this.set(key, rlt)
    //   }
    // } else {
    //   this.set(key, rlt)
    // }

    return variable
  }

  public async get(key?: string | string[]): Promise<Variables | Variable> {
    if (key) {
      return await this._get(key)
    }

    const variables = {}
    return await pReduce(
      Object.keys(this.store),
      async (set, key) => {
        variables[key] = await this._get(key)
        return variables
      },
      variables
    )
  }
}
