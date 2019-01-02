/**
 * @file isGitUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
const isGitUrl = require('../lib/isGitUrl').default

describe('isGitUrl', function () {
  it('should isGitUrl works', function () {
    expect(
      isGitUrl('https://github.com/telescopejs/telescope')
    ).toBeTruthy()
    expect(
      isGitUrl('ssh://g@gitlab.example.com:8022/be-fe/matriks2-seed.git')
    ).toBeTruthy()
    expect(
      isGitUrl('ssh://g@gitlab.example.com:8022/be-fe/matriks2-seed')
    ).toBeTruthy()
    expect(
      isGitUrl('https://github.com/telescopejs/telescope.git')
    ).toBeTruthy()

    expect(
      isGitUrl('git@github.com:telescopejs/telescope.git')
    ).toBeTruthy()

    expect(
      isGitUrl('git@github.com:telescopejs/telescope')
    ).toBeTruthy()
  })

  it('should works 2', function () {
    expect(
      isGitUrl('telescopejs/telescope')
    ).toBeTruthy()

    expect(
      isGitUrl('telescopejs/telescope/master')
    ).toBeFalsy()

    expect(
      isGitUrl('telescopejs/telescope/232abcde')
    ).toBeFalsy()

    expect(
      isGitUrl('telescopejs/telescope/master/no')
    ).toBeFalsy()

    expect(
      isGitUrl('telesc.opejs/telescope/master/no')
    ).toBeFalsy()

    expect(
      isGitUrl('./telescopejs/telescope/master')
    ).toBeFalsy()
  })

  it('should works 3', function () {
    expect(
      isGitUrl('github:telescopejs/telescope/master')
    ).toBeTruthy()
  })
})
