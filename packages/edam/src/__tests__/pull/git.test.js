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
import fileSystem from '../../lib/fileSystem'
const filenamify = require('filenamify')

jest.setTimeout(60000) // 40s
describe('git', function() {
  let source = {
    type: 'git',
    url: 'https://github.com/imcuttle/html-markdown.git',
    checkout: 'master'
  }
  let output = nps.join(
    nps.join(constant.DEFAULT_CACHE_DIR, sourceFilenamify(source))
  )

  // it('should clone works on simple case with offline mode', async () => {
  //   jest.mock('is-online', () => () => Promise.resolve(false))
  //   // ../../lib/gitClone
  //
  //   expect(
  //     await gitPull(source, constant.DEFAULT_CACHE_DIR, {
  //       cacheDir: true,
  //       pull: {
  //         npmClient: 'npm',
  //         git: 'clone'
  //       }
  //     })
  //   ).toBe(nps.join(output, 'clone', filenamify(source.url)))
  //
  //   expect(
  //     await gitPull(source, constant.DEFAULT_CACHE_DIR, {
  //       cacheDir: false,
  //       pull: {
  //         npmClient: 'npm',
  //         git: 'clone'
  //       }
  //     })
  //   ).toBe(nps.join(output, 'clone', filenamify(source.url)))
  //
  //   jest.unmock('is-online')
  // })

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

  afterAll(async function () {
    await fileSystem.cleanDir(this.constants.DEFAULT_CACHE_DIR)
  })

  // it('should download deals with the gitlab', async function() {
  //   let s = {
  //     ...source,
  //     url: 'http://gitlab.example.com/be-fe/befe-utils.git',
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
