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
describe('move_copy', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')

  it('should functional output', async function() {
    const fp = await mockPrompts(
      join(tplPath, 'move_copy'),
      {
        value: 'ojbk'
      },
      join(outputRoot, 'move_copy')
    )

    expect(Object.keys(fp.tree).length).toBe(4)
    expect(await readdirDeep(join(outputRoot, 'move_copy'))).toEqual(
      expect.arrayContaining(
        [
          '.gitignore_move',
          '.gitignore_move_clone',
          'imignored/keep.module.js',
          'index.js'
        ].map(normalize)
      )
    )
  })
})
