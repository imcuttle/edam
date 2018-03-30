/**
 * @file normalizeSource
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import normalizeSource from '../core/normalizeSource'
import * as nps from 'path'

describe('normalizeSource', function () {
  it('should normalizeSource works on github', function () {
    expect(
      normalizeSource('https://github.com/telescopejs/telescope.git')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      checkout: 'master'
    })

    expect(
      normalizeSource('git@github.com:telescopejs/telescope')
    ).toEqual({
      type: 'git',
      url: 'git@github.com:telescopejs/telescope.git',
      checkout: 'master'
    })

    expect(
      normalizeSource('github:telescopejs/telescope')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      checkout: 'master'
    })

    expect(
      normalizeSource('telescopejs/telescope')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      checkout: 'master'
    })

    expect(
      normalizeSource('https://github.com/telescopejs/telescope')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      checkout: 'master'
    })

    expect(
      normalizeSource('github:telescopejs/telescope/dev')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      checkout: 'dev'
    })

    expect(
      normalizeSource('github:telescopejs/telescope/dev?checkout=master')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      checkout: 'master'
    })
  })

  it('should normalizeSource works on gitlab', function () {
    expect(
      normalizeSource('ssh://g@gitlab.baidu.com:8022/aa/vvv.git')
    ).toEqual({
      type: 'git',
      url: 'ssh://g@gitlab.baidu.com:8022/aa/vvv.git',
      checkout: 'master'
    })

    expect(
      normalizeSource('ssh://g@gitlab.baidu.com:8022/aa/vvv?checkout=dev')
    ).toEqual({
      type: 'git',
      url: 'ssh://g@gitlab.baidu.com:8022/aa/vvv.git',
      checkout: 'dev'
    })

    expect(
      normalizeSource({
        type: 'file',
        url: './a'
      }, { cwd: '/a/b' })
    ).toEqual({
      type: 'file',
      url: '/a/b/a'
    })

    expect(
      normalizeSource({
        type: 'git',
        url: './a'
      })
    ).toEqual({
      type: 'git',
      url: './a.git',
      checkout: 'master'
    })

    expect(
      normalizeSource({
        type: 'git',
        url: './a.git'
      })
    ).toEqual({
      type: 'git',
      url: './a.git',
      checkout: 'master'
    })
  })

  it('should normalizeSource works on npm', function () {
    expect(normalizeSource('ssds'))
      .toEqual({
        type: 'npm',
        url: 'ssds',
        version: ''
      })

    expect(normalizeSource('npm:react'))
      .toEqual({
        type: 'npm',
        url: 'react',
        version: ''
      })

    expect(normalizeSource('npm:react@1.2.3'))
      .toEqual({
        type: 'npm',
        url: 'react',
        version: '1.2.3'
      })

    expect(normalizeSource('npm:@abc/cli@>=1.2.3'))
      .toEqual({
        type: 'npm',
        url: '@abc/cli',
        version: '>=1.2.3'
      })

    expect(normalizeSource('@abc/cli@>=1.2.3'))
      .toEqual({
        type: 'npm',
        url: '@abc/cli',
        version: '>=1.2.3'
      })

    expect(normalizeSource('@abc/cli@v1.2.3'))
      .toEqual({
        type: 'npm',
        url: '@abc/cli',
        version: 'v1.2.3'
      })

    expect(normalizeSource('@abc/cli/a@v1.2.3'))
      .toEqual({
        type: 'npm',
        url: '@abc/cli/a',
        version: 'v1.2.3'
      })
    expect(normalizeSource('@v1.2.3'))
      .toEqual({
        type: 'npm',
        url: '@v1.2.3',
        version: ''
      })

    expect(normalizeSource('react@latest'))
      .toEqual({
        type: 'npm',
        url: 'react',
        version: 'latest'
      })
  })

  it('should normalizeSource works on file', function () {
    expect(normalizeSource('fixture/loadConfig/file', { cwd: __dirname }))
      .toEqual({
        type: 'file',
        url: nps.resolve(__dirname, 'fixture/loadConfig/file.js')
      })

    expect(normalizeSource('fixture/.edamrc', { cwd: __dirname }))
      .toEqual({
        type: 'file',
        url: nps.resolve(__dirname, 'fixture/.edamrc')
      })

    expect(normalizeSource('npm:fixture/.edamrc', { cwd: __dirname }))
      .toEqual({
        type: 'npm',
        url: 'fixture/.edamrc',
        version: ''
      })
  })
})
