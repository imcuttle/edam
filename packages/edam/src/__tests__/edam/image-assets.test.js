/* eslint-disable quotes */
/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import { mockPrompts } from '../../index'
import { join, relative, normalize } from 'path'
import { sync } from 'rimraf'
import fileSystem from '../../lib/fileSystem'

async function readdirDeep(dest) {
  const files = await fileSystem.readdirDeep(dest)
  return files.filter(x => fileSystem.isFile(x)).map(x => relative(dest, x))
}
describe('image-assets', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')
  beforeEach(() => {
    sync(join(outputRoot, 'image-assets'))
  })

  it('should emit assets', async () => {
    const ft = await mockPrompts(
      join(tplPath, 'image-assets'),
      {
      },
      join(outputRoot, 'image-assets')
    )

    console.log(Object.keys(ft.tree))
    await ft.writeToFile()
    expect(Object.keys(ft.tree)).toEqual(
      expect.arrayContaining([
        normalize('favicon.ico'),
        normalize('logo.png'),
      ])
    )
  })
})
