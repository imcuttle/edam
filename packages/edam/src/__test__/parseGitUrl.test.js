/**
 * @file isGitUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
const parseGitUrl = require('../utils/parseGitUrl').default

describe('parseGitUrl', function () {
  it('should parseGitUrl works', function () {
    expect(
      parseGitUrl('https://github.com/telescopejs/telescope')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })
    expect(
      parseGitUrl('https://github.com/telescopejs/telescope.git')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope.git')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })
  })

  it('should works 2', function () {
    expect(
      parseGitUrl('telescopejs/telescope')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/master')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/232abcde')
    ).toMatchObject({
      branch: '232abcde',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/master/no')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('github:telesc.opejs/telescope/master/no')
    ).toMatchObject({
      branch: 'master',
      name: 'telescope',
      owner: 'telesc.opejs'
    })

    expect(
      parseGitUrl('github:telesc.opejs/telescope/master/no?branch=dev')
    ).toMatchObject({
      branch: 'dev',
      name: 'telescope',
      owner: 'telesc.opejs'
    })

  })

  it('should works with querystring', function () {
    expect(
      parseGitUrl('github:telesc.opejs/telescope/master/no?branch=dev')
    ).toMatchObject({
      branch: 'dev',
      name: 'telescope',
      owner: 'telesc.opejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/master?branch=dev')
    ).toMatchObject({
      branch: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('https://github.com/telescopejs/telescope.git?branch=dev')
    ).toMatchObject({
      branch: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope.git?branch=dev')
    ).toMatchObject({
      branch: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope?branch=dev')
    ).toMatchObject({
      branch: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })
  })
})
