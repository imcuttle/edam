/**
 * @file npm
 * @author Cuttle Cong
 * @date 2018/3/26
 * @description
 */
import npmPull from '../../core/pull/npm'
import constant from '../../core/constant'
import sourceFilenamify from '../../core/sourceFilenamify'
import { fileSystem } from '../../lib'

import * as nps from 'path'

const mockIsOnline = require('is-online')
jest.mock('is-online', () => {
  return jest.fn(() => Promise.resolve(true))
})

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

  beforeEach(async function() {
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

    mockIsOnline.mockResolvedValueOnce(false)
    expect(
      await npmPull(
        { ...source, version: '>=1.0.2' },
        constant.DEFAULT_CACHE_DIR,
        {
          cacheDir: true,
          offlineFallback: true,
          pull: {
            npmClient: 'npm'
          }
        }
      )
    ).toBe(output)
    expect(version()).toBe('1.0.0')
    expect(mockIsOnline).toHaveBeenCalledTimes(1)

    mockIsOnline.mockResolvedValueOnce(true)
    expect(
      await npmPull(
        { ...source, version: '>=1.0.2' },
        constant.DEFAULT_CACHE_DIR,
        {
          cacheDir: true,
          offlineFallback: true,
          pull: {
            npmClient: 'npm'
          }
        }
      )
    ).toBe(output)
    expect(version()).not.toBe('1.0.0')
    expect(mockIsOnline).toHaveBeenCalledTimes(2)
  })

  it('should npm pull caches package when use `yarn`', async () => {
    expect(
      await npmPull(
        { ...source, version: '=1.0.0' },
        constant.DEFAULT_CACHE_DIR,
        {
          cacheDir: true,
          pull: {
            npmClient: 'yarn'
          }
        }
      )
    ).toBe(output)
    expect(version()).toBe('1.0.0')
  })

  afterAll(async function() {
    await fileSystem.cleanDir(this.constants.DEFAULT_CACHE_DIR)

    jest.unmock('is-online')
  })
})
