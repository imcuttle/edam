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

describe('mode', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')
  beforeEach(() => {
    sync(join(outputRoot, 'mode'))
  })

  it('should emit assets', async () => {
    const ft = await mockPrompts(join(tplPath, 'mode'), {}, join(outputRoot, 'mode'))

    await ft.writeToFile()
    expect(() =>
      fileSystem.accessSync(join(join(outputRoot, 'mode'), '.husky/commit-msg'), fileSystem.constants.X_OK)
    ).not.toThrow()
    // expect(Object.keys(ft.tree)).toEqual(
    //   expect.arrayContaining([
    //     normalize('favicon.ico'),
    //     normalize('logo.png'),
    //   ])
    // )
  })
})
