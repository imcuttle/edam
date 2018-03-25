import { Variable, Variables } from '../../types/TemplateConfig'
import * as _ from 'lodash'
import pReduce from 'p-reduce'

/**
 * @file Variables
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

export default class VariablesImpl {
  public store: Variables = {}
  public assign(vars: Variables) {
    Object.assign(this.store, vars)
    return this
  }
  public set(variables) {
    this.store = variables
    return this
  }

  public clear() {
    this.store = {}
    return this
  }

  private async _get(key: string): Promise<Variable> {
    const variable = this.store[key]
    if (!variable) {
      throw new Error(`Variable key: ${key} is not found.`)
    }

    let rlt: Variable = variable
    if (_.isFunction(variable)) {
      const vCenter = {
        _type: 'once',
        once() {
          this._type = 'once'
        },
        always() {
          this._type = 'always'
        }
      }
      rlt = await variable(vCenter)
      if (vCenter._type === 'once') {
        this.store[key] = rlt
      }
      // this.store[key] = rlt
    } else {
      this.store[key] = rlt
    }

    return rlt
  }

  public async get(key?: string): Promise<Variables | Variable> {
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
