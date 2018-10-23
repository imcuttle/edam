/* eslint-disable quotes */
/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import { mockPrompts } from '../../index'
import { join, relative, normalize } from 'path'
import fileSystem from '../../lib/fileSystem'

async function readdirDeep(dest) {
  const files = await fileSystem.readdirDeep(dest)
  return files.filter(x => fileSystem.isFile(x)).map(x => relative(dest, x))
}
describe('includes-excludes', function() {
  const tplPath = join(__dirname, '../fixture/edam/includes-excludes')
  const outputRoot = join(__dirname, '../fixture/edam-output/includes-excludes')

  it('should includes-excludes', async () => {
    let ft = await mockPrompts(tplPath, {}, outputRoot)

    expect(Object.keys(ft.tree)).toEqual(
      expect.arrayContaining([
        normalize('deep/bar.js'),
        normalize('deep/foo.jsx'),
        normalize('deep/foo.js'),
        normalize('bar.js'),
        normalize('foo.js'),
        normalize('foo.jsx')
      ])
    )
    expect(Object.keys(ft.tree).length).toBe(6)

    ft = await mockPrompts(tplPath, {}, { includes: ['foo.js'] })
    expect(Object.keys(ft.tree)).toEqual([normalize('foo.js')])
  })
})
