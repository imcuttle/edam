/**
 * @file normalizeSource
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import normalizeSource from '../lib/normalizeSource'

describe('normalizeSource', function () {
  it('should normalizeSource works on github', function () {
    expect(
      normalizeSource('https://github.com/telescopejs/telescope.git')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      branch: 'master'
    })

    expect(
      normalizeSource('git@github.com:telescopejs/telescope')
    ).toEqual({
      type: 'git',
      url: 'git@github.com:telescopejs/telescope.git',
      branch: 'master'
    })

    expect(
      normalizeSource('https://github.com/telescopejs/telescope')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      branch: 'master'
    })

    expect(
      normalizeSource('github:telescopejs/telescope/dev')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      branch: 'dev'
    })

    expect(
      normalizeSource('github:telescopejs/telescope/dev?branch=master')
    ).toEqual({
      type: 'git',
      url: 'https://github.com/telescopejs/telescope.git',
      branch: 'master'
    })
  })

  it('should normalizeSource works on gitlab', function () {
    expect(
      normalizeSource('ssh://g@gitlab.baidu.com:8022/aa/vvv.git')
    ).toEqual({
      type: 'git',
      url: 'ssh://g@gitlab.baidu.com:8022/aa/vvv.git',
      branch: 'master'
    })

    expect(
      normalizeSource('ssh://g@gitlab.baidu.com:8022/aa/vvv?branch=dev')
    ).toEqual({
      type: 'git',
      url: 'ssh://g@gitlab.baidu.com:8022/aa/vvv.git',
      branch: 'dev'
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
      branch: 'master'
    })

    expect(
      normalizeSource({
        type: 'git',
        url: './a.git'
      })
    ).toEqual({
      type: 'git',
      url: './a.git',
      branch: 'master'
    })
  })
})
