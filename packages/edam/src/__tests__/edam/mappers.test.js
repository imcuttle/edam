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

describe('mappers', function() {
  const tplPath = join(__dirname, '../fixture/edam')
  const outputRoot = join(__dirname, '../fixture/edam-output')

  it('should template replace', async () => {
    const ft = await mockPrompts(
      join(tplPath, 'mappers'),
      {
        value: 'ojbk',
      },
      join(outputRoot, 'mappers')
    )

    expect(await ft.writeToFile(null, { overwrite: true })).toBeTruthy()

    expect((await fileSystem.readFile(join(outputRoot, 'mappers', '__tests__/test.foo'), 'utf8')).trim()).toBe(
      'export default "foo";'
    )
  })
})
