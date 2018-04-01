/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import npmPull from '../../core/pull/npm'
import constant from '../../core/constant'
import sourceFilenamify from '../../core/sourceFilenamify'
import * as nps from 'path'
import { fileSystem } from '../../lib'

jest.setTimeout(60000) // 60s
describe('npm', function() {
  let name = 'git-range-files'
  let source = {
    type: 'npm',
    url: name
  }
  let output = nps.join(
    nps.join(constant.DEFAULT_CACHE_DIR, sourceFilenamify(source)),
    'node_modules',
    name
  )

  function version(path = output) {
    return JSON.parse(
      fileSystem.readFileSync(nps.resolve(path, 'package.json')).toString()
    ).version
  }

  beforeEach(async function () {
    await fileSystem.cleanDir(output)
  })
  it('should npm pull universal package when use `npm`', async () => {
    expect(
      await npmPull(
        { ...source, version: '=1.0.0' },
        constant.DEFAULT_CACHE_DIR,
        {
          cacheDir: true,
          pull: {
            npmClient: 'npm'
          }
        }
      )
    ).toBe(output)
    expect(version()).toBe('1.0.0')
    // await fileSystenpmm.cleanDir(output)
  })

  it('should npm pull universal package when use `npm` and nocache', async () => {
    expect(
      await npmPull(
        source,
        constant.DEFAULT_CACHE_DIR,
        {
          cacheDir: false,
          pull: {
            npmClient: 'npm'
          }
        }
      )
    ).toBe(output)
    expect(version()).toBe('1.0.1')
  })

  afterAll(async function () {
    await fileSystem.cleanDir(this.constants.DEFAULT_CACHE_DIR)
  })
})
