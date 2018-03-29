/* eslint-disable indent */
/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { TreeProcessor, Tree, State, AwaitEventEmitter } from '../../types/core'
import toArray from '../../lib/toArray'
import * as mkdirp from 'mkdirp'
import * as rimraf from 'rimraf'
import * as pify from 'pify'
import * as _ from 'lodash'
import * as nps from 'path'
import fileSystem from '../../lib/fileSystem'
import * as mm from 'micromatch'
const debug = require('debug')('edam:FileProcessor')
const tildify = require('tildify')

export default class FileProcessor extends TreeProcessor {
  constructor(
    public tree: Tree,
    public dest?: string,
    public emitter?: AwaitEventEmitter
  ) {
    super(tree)
    this.emitter = emitter || new AwaitEventEmitter()
    this.dest = dest
  }
  public async writeToFile(
    filepath: string = this.dest,
    option: { clean?: boolean; overwrite?: boolean } = {
      clean: false,
      overwrite: false
    }
  ): Promise<boolean> {
    await pify(mkdirp)(filepath)
    if (option.clean) {
      await pify(rimraf)(filepath)
    }
    await this.emitter.emit('pre', filepath)
    const workers = []
    _.each(this.tree, function(data: State, path) {
      const filename = nps.join(filepath, path)
      if (!option.overwrite && fileSystem.existsSync(filename)) {
        debug('%s already existed, ignored!', tildify(filename))
        return
      }
      workers.push(
        (async function write() {
          await pify(mkdirp)(nps.dirname(filename))
          await fileSystem.writeFile(filename, data.output)
        })()
      )
    })
    await Promise.all(workers)
    await this.emitter.emit('post', filepath)
    return true
  }

  public get(name: string): State {
    name = nps.normalize(name)
    return this.tree[name]
  }
  public match(m: string | string[]): string[] {
    // const arr =
    return mm(Object.keys(this.tree), m, { dot: true })
  }
  public delete(paths: string | string[]): State | State[] {
    const fileStates = toArray(paths).map((path: string) => {
      path = nps.normalize(path)
      const state = this.tree[path]
      delete this.tree[path]
      return state
    })
    return fileStates.length === 1 ? fileStates[0] : fileStates
  }

  public remove(m: string | string[]): void {
    debug('remove input: %o', m)
    toArray(m).forEach(eachm => {
      const paths = this.match(<string>eachm)
      this.delete(paths)
    })
  }

  private _move(path: string, to: string) {
    path = nps.normalize(path)
    to = nps.normalize(to)
    debug('move from %s to %s', path, to)
    const state = <State>this.delete(path)
    if (state) {
      this.new(to, state)
      return state
    }
  }

  private _copy(path: string, to: string) {
    path = nps.normalize(path)
    to = nps.normalize(to)
    debug('cp from %s to %s', path, to)
    const state = <State>this.get(path)
    if (state) {
      this.new(to, { ...state })
      return state
    }
  }

  public move(m: string | string[], dest: string): FileProcessor {
    return this._moveOrCopy(m, dest, this._move.bind(this))
  }

  public copy(m: string | string[], dest: string): FileProcessor {
    return this._moveOrCopy(m, dest, this._copy.bind(this))
  }

  private _moveOrCopy(
    m: string | string[],
    dest: string,
    action: Function
  ): FileProcessor {
    dest = nps.normalize(dest)
    debug('move input: %o, %s', m, dest)
    toArray(m).forEach(eachm => {
      const paths = this.match(<string>eachm)
      // mv a.js b.js
      if (paths.length === 1 && paths[0] === eachm) {
        action(paths[0], dest)
      } else {
        // implement simply, not robustly
        // a: mv a/* b
        // b: mv a/ b
        // https://www.npmjs.com/package/micromatch#parse
        const { nodes } = mm.parse(eachm)
        let basename = ''
        let hasGlobFlag = false
        if (nodes && nodes.length) {
          nodes.some(function(node) {
            switch (node.type) {
              case 'bos':
              case 'eos':
              case 'text':
              case 'slash':
                basename += node.val
                return false
              default:
                hasGlobFlag = true
                return true
            }
          })
        }
        // b: mv a/ b
        if (!hasGlobFlag) {
          basename = ''
        }

        paths.forEach(path => {
          let to = dest
          if (path.startsWith(basename)) {
            to = nps.join(dest, path.slice(basename.length))
          }
          action(path, to)
        })
      }
    })

    return this
  }

  public new(path: string, file: State): FileProcessor {
    path = nps.normalize(path)
    this.tree[path] = file
    return this
  }
}
