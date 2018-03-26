/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import npmPull from '../../core/pull/npm'
import constant from '../../core/constant'
import sourceFilenamily from '../../core/sourceFilenamily'
import * as nps from 'path'
import { fileSystem } from '../../lib'

describe('npm', function() {
  let name = 'git-range-files'
  let source = {
    type: 'npm',
    url: name
  }
  let output = nps.join(
    nps.join(constant.DEFAULT_CACHE_DIR, sourceFilenamily(source)),
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
      await npmPull.call(
        { logger: { log: console.log } },
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
      await npmPull.call(
        { logger: { log: console.log } },
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
})
