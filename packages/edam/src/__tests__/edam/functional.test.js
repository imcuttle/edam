/* eslint-disable quotes */
/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import { mockPrompts } from '../../index'
import { join, relative } from 'path'
import fileSystem from '../../lib/fileSystem'

async function readdirDeep(dest) {
  const files = await fileSystem.readdirDeep(dest)
  return files.filter(x => fileSystem.isFile(x)).map(x => relative(dest, x))
}
describe('functional', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')

  it('should functional', async () => {
    const ft = await mockPrompts(
      join(tplPath, 'functional'),
      {
        value: 'ojbk'
      },
      join(outputRoot, 'functional')
    )

    expect(Object.keys(ft.tree)).toEqual(
      expect.arrayContaining([
        '.gitignore',
        'imignored/keep.module.js',
        'index.js'
      ])
    )
    expect(ft.tree).toMatchSnapshot()
  })

  it('should functional output', async function() {
    const fp = await mockPrompts(
      join(tplPath, 'functional'),
      {
        value: 'ojbk'
      },
      join(outputRoot, 'functional')
    )

    expect(Object.keys(fp.tree)).toEqual(
      expect.arrayContaining([
        '.gitignore',
        'imignored/keep.module.js',
        'index.js'
      ])
    )
    expect(await fp.writeToFile()).toBeTruthy()

    expect(
      await readdirDeep(join(outputRoot, 'functional'))
    ).toEqual(
      expect.arrayContaining([
        '.gitignore',
        'imignored/keep.module.js',
        'index.js'
      ])
    )

    await fileSystem.cleanDir(join(outputRoot, 'functional'))
  })
})
