/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { TreeProcessor, Tree, State } from '../../types/core'
import { isMatch, default as match } from '../../lib/match'
import { Matcher } from '../../types/TemplateConfig'
import toArray from '../../lib/toArray'
import * as mkdirp from 'mkdirp'
import * as rimraf from 'rimraf'
import * as pify from 'pify'

export default class FileProcessor extends TreeProcessor {
  public async writeToFile(
    filepath: string,
    option: { clean: boolean } = { clean: true }
  ): Promise<boolean> {
    await pify(mkdirp)(filepath)
    if (option.clean) {
      await pify(rimraf)(filepath)
    }

    return true
  }

  public file(m: Matcher): string | undefined {
    return this.match(m)[0]
  }
  public match(m: Matcher): string[] {
    return match(Object.keys(this.tree), m)
  }
  public delete(paths: string | string[]): State | State[] {
    const fileStates = toArray(paths).map((path: string) => {
      const state = this.tree[path]
      delete this.tree[path]
      return state
    })
    return fileStates.length === 1 ? fileStates[0] : fileStates
  }

  public async move(m: Matcher, dest: string): FileProcessor {
    const paths = this.match(m)
    // file
    if (paths.length === 1 && paths[0] === m) {
      const state = <State>this.delete(paths[0])
      this.new(dest, state)
    } else {
    }
    // dest
    // paths.forEach()
    return this
  }

  public new(path: string, file: State): FileProcessor {
    this[path] = file
    return this
  }

  public async copy(): Promise<FileProcessor> {
    return this
  }
}
