/**
 * @file loadConfig
 * @author Cuttle Cong
 * @date 2018/3/22
 * @description
 */
const loadConfig = require('../utils/loadConfig')

describe('loadConfig', function () {
  it('should load json5 file', async function () {
    expect(
      await loadConfig('fixture/.filerc', { cwd: __dirname })
    ).toEqual({
      'name': 'fixture',
      'version': '0.0.1'
    })
  })

  it('should load js file', async function () {
    expect(
      await loadConfig('fixture/file.js', { cwd: __dirname })
    ).toEqual({
      'name': 'fixture',
      'version': '0.0.1'
    })
  })

  it('should throws error when js file is not found', async function () {
    try {
      await loadConfig('fixture/404.js', { cwd: __dirname })
    } catch (ex) {
      expect(ex).not.toBeNull()
    }
  })

  it('should throws error when json5 file is not found', async function () {
    try {
      await loadConfig('fixture/404.json', { cwd: __dirname })
    } catch (ex) {
      expect(ex).not.toBeNull()
    }
  })
})
