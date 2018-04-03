/**
 * @file FileProcessor
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import FileProcessor from '../core/TreeProcessor/FileProcessor'
import { join, relative, normalize } from 'path'
import fileSystem from '../lib/fileSystem'
const mkdirp = require('mkdirp')

async function readdirDeep(dest) {
  const files = await fileSystem.readdirDeep(dest)
  return files.filter(x => fileSystem.isFile(x)).map(x => relative(dest, x))
}

describe('FileProcessor', function() {
  let dest = join(__dirname, 'fixture/FileProcessor')
  mkdirp.sync(dest)

  let fp
  beforeEach(function() {
    const tree = {
      'pull/git.ts': {
        output: 'im pull/git.ts output'
      },
      'pull/file.ts': {
        output: 'im pull/file.ts output'
      },
      'pull/npm.ts': {
        output: 'im pull/npm.ts output'
      },
      'push/git.ts': {
        output: 'im push/git.ts output'
      },
      'root.txt': {
        output: 'im root output'
      }
    }
    fp = new FileProcessor(tree, dest)
  })
  afterEach(async function () {
    await fileSystem.cleanDir(dest)
  })
  it('should FileProcessor delete works', async () => {
    expect(fp.delete('root.txt')).toEqual({
      output: 'im root output'
    })
    expect(await fp.writeToFile(dest)).toBeTruthy()

    const files = await readdirDeep(dest)
    expect(files.length).toBe(4)
    expect(files).toEqual(
      expect.arrayContaining([
        normalize('pull/git.ts'),
        normalize('pull/file.ts'),
        normalize('pull/npm.ts'),
        normalize('push/git.ts')
      ])
    )
  })

  it('should FileProcessor new works', async function () {
    fp.new('root-clone.txt', fp.get('root.txt'))
    expect(await fp.writeToFile(dest)).toBeTruthy()

    const files = await readdirDeep(dest)
    expect(files.length).toBe(6)
    expect(files).toEqual(
      expect.arrayContaining([
        normalize('pull/git.ts'),
        normalize('pull/file.ts'),
        normalize('pull/npm.ts'),
        normalize('push/git.ts'),
        normalize('root.txt'),
        normalize('root-clone.txt')
      ])
    )
  })

  it('should FileProcessor move works with star', async function () {
    fp.move('pull/*', 'x')
    expect(Object.keys(fp.tree)).toEqual(
      expect.arrayContaining([
        normalize('x/git.ts'),
        normalize('x/file.ts'),
        normalize('x/npm.ts'),
        normalize('push/git.ts'),
        normalize('root.txt')
      ])
    )
  })

  it('should FileProcessor move works with star 2', async function () {
    fp.move('pull/**', 'x')
    expect(Object.keys(fp.tree)).toEqual(
      expect.arrayContaining([
        normalize('x/git.ts'),
        normalize('x/file.ts'),
        normalize('x/npm.ts'),
        normalize('push/git.ts'),
        normalize('root.txt')
      ])
    )
  })

  it('should FileProcessor move works with exact path', async function () {
    fp.move('pull/npm.ts', 'x.ts')
    fp.move('root.txt', 'xyz.ts')
    expect(Object.keys(fp.tree)).toEqual(
      expect.arrayContaining([
        normalize('pull/git.ts'),
        normalize('pull/file.ts'),
        normalize('x.ts'),
        normalize('push/git.ts'),
        normalize('xyz.ts')
      ])
    )
  })

  it('should FileProcessor copy works with exact path', async function () {
    fp.copy('pull/npm.ts', 'x.ts')
    fp.copy('root.txt', 'xyz.ts')
    expect(Object.keys(fp.tree)).toEqual(
      expect.arrayContaining([
        normalize('pull/git.ts'),
        normalize('pull/file.ts'),
        normalize('pull/npm.ts'),
        normalize('x.ts'),
        normalize('push/git.ts'),
        normalize('xyz.ts'),
        normalize('root.txt')
      ])
    )

    expect(fp.tree['x.ts']).toEqual(fp.tree['pull/npm.ts'])
    expect(fp.tree['x.ts']).not.toBe(fp.tree['pull/npm.ts'])
  })

  it('should FileProcessor remove works with exact path', async function () {
    fp.remove('pull/*')

    expect(Object.keys(fp.tree)).toEqual(
      expect.arrayContaining([
        normalize('push/git.ts'),
        normalize('root.txt')
      ])
    )
  })

  // NOT Support now
  // it('should FileProcessor move works on directory', async function () {
  //   fp.move('pull/', 'x')
  //   expect(Object.keys(fp.tree)).toEqual(
  //     expect.arrayContaining([
  //       'x/pull/git.ts',
  //       'x/pull/file.ts',
  //       'x/pull/npm.ts',
  //       'push/git.ts',
  //       'root.txt'
  //     ])
  //   )
  // })
})
