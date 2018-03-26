/**
 * @file isGitUrl
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
const parseGitUrl = require('../lib/parseGitUrl').default

describe('parseGitUrl', function () {
  it('should parseGitUrl works', function () {
    expect(
      parseGitUrl('https://github.com/telescopejs/telescope')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })
    expect(
      parseGitUrl('https://github.com/telescopejs/telescope.git')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope.git')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })
  })

  it('should works 2', function () {
    expect(
      parseGitUrl('telescopejs/telescope')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/master')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/232abcde')
    ).toMatchObject({
      checkout: '232abcde',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/master/no')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('github:telesc.opejs/telescope/master/no')
    ).toMatchObject({
      checkout: 'master',
      name: 'telescope',
      owner: 'telesc.opejs'
    })

    expect(
      parseGitUrl('github:telesc.opejs/telescope/master/no?checkout=dev')
    ).toMatchObject({
      checkout: 'dev',
      name: 'telescope',
      owner: 'telesc.opejs'
    })

  })

  it('should works with querystring', function () {
    expect(
      parseGitUrl('github:telesc.opejs/telescope/master/no?checkout=dev')
    ).toMatchObject({
      checkout: 'dev',
      name: 'telescope',
      owner: 'telesc.opejs'
    })

    expect(
      parseGitUrl('telescopejs/telescope/master?checkout=dev')
    ).toMatchObject({
      checkout: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('https://github.com/telescopejs/telescope.git?checkout=dev')
    ).toMatchObject({
      checkout: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope.git?checkout=dev')
    ).toMatchObject({
      checkout: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })

    expect(
      parseGitUrl('git@github.com:telescopejs/telescope?checkout=dev')
    ).toMatchObject({
      checkout: 'dev',
      name: 'telescope',
      owner: 'telescopejs'
    })
  })
})
