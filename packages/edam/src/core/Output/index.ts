/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { OutputInterface, Tree } from '../../types/core'

export default class Output implements OutputInterface {
  public async writeToFile(filepath: string): Promise<boolean> {
    return true
  }
  public toPrettyStates(): string {
    return JSON.stringify(this.tree, null, 2)
  }
  tree: Tree
}
