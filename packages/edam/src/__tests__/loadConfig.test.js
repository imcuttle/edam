/**
 * @file loadConfig
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
import { loadConfig } from '../lib/loadConfig'

describe('loadConfig', function () {
  it('should load json5 file', async function () {
    expect(
      await loadConfig('fixture/loadConfig/.filerc', { cwd: __dirname })
    ).toEqual({
      'name': 'fixture',
      'version': '0.0.1'
    })
  })

  it('should load json5 file 2', async function () {
    expect(
      await loadConfig('fixture/loadConfig/.jsonrc', { cwd: __dirname })
    ).toEqual({
      'name': 'fixture',
      'version': '0.0.1',
      x: ['222']
    })
  })

  it('should load js file', async function () {
    expect(
      await loadConfig('fixture/loadConfig/file.js', { cwd: __dirname })
    ).toEqual({
      'name': 'fixture',
      'version': '0.0.1'
    })
  })

  it('should throws error when js file is not found', async function () {
    try {
      await loadConfig('fixture/loadConfig/404.js', { cwd: __dirname })
    } catch (ex) {
      expect(ex).not.toBeNull()
    }
  })

  it('should throws error when json5 file is not found', async function () {
    try {
      await loadConfig('fixture/loadConfig/404.json', { cwd: __dirname })
    } catch (ex) {
      expect(ex).not.toBeNull()
    }
  })
})
