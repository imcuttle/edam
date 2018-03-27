/**
 * @file git
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */
import gitPull from '../../core/pull/git'
import constant from '../../core/constant'
import sourceFilenamify from '../../core/sourceFilenamify'
import * as nps from 'path'
const filenamify = require('filenamify')

jest.setTimeout(20000) // 20s
describe('git', function() {
  let source = {
    type: 'git',
    url: 'https://github.com/imcuttle/html-markdown.git',
    checkout: 'master'
  }
  let output = nps.join(
    nps.join(constant.DEFAULT_CACHE_DIR, sourceFilenamify(source))
  )

  it('should clone works on simple case', async () => {
    expect(
      await gitPull(source, constant.DEFAULT_CACHE_DIR, {
        cacheDir: true,
        pull: {
          npmClient: 'npm',
          git: 'clone'
        }
      })
    ).toBe(nps.join(output, 'clone', filenamify(source.url)))

    expect(
      await gitPull(source, constant.DEFAULT_CACHE_DIR, {
        cacheDir: false,
        pull: {
          npmClient: 'npm',
          git: 'clone'
        }
      })
    ).toBe(nps.join(output, 'clone', filenamify(source.url)))
  })

  it('should download works on simple case', async () => {
    expect(
      await gitPull(source, constant.DEFAULT_CACHE_DIR, {
        cacheDir: true,
        pull: {
          npmClient: 'npm',
          git: 'download'
        }
      })
    ).toBe(nps.join(output, 'download', filenamify(source.url), 'master'))

    expect(
      await gitPull(
        { ...source, checkout: 'cheerio' },
        constant.DEFAULT_CACHE_DIR,
        {
          cacheDir: true,
          pull: {
            npmClient: 'npm',
            git: 'download'
          }
        }
      )
    ).toBe(nps.join(output, 'download', filenamify(source.url), 'cheerio'))
  })

  // it('should download deals with the gitlab', async function() {
  //   let s = {
  //     ...source,
  //     url: 'http://gitlab.baidu.com/be-fe/befe-utils.git',
  //     checkout: 'master'
  //   }
  //   expect(
  //     await gitPull(s, constant.DEFAULT_CACHE_DIR, {
  //       cacheDir: true,
  //       pull: {
  //         npmClient: 'npm',
  //         git: 'clone'
  //       }
  //     })
  //   ).toBe(nps.join(output, 'download', filenamify(s.url), 'master'))
  // })
})
