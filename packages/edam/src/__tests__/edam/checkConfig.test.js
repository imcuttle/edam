/* eslint-disable quotes */
/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/3/28
 * @description
 */
import edam from '../../'

describe('checkConfig', function() {
  it('should edam through object', async () => {
    const em = edam({
      source: 'react',
      output: '',
      includes: false,
      excludes: /1/,
    })
    expect(() => em.checkConfig()).toThrowErrorMatchingInlineSnapshot(
      `"includes: expected: oneOf([string, array(string), function, instanceOf(RegExp)]).optional, actual: false."`
    )
  })

  it('check extends types', async () => {
    let em = edam({
      source: 'react',
      output: '',
      extends: {
        source: 's',
        pick: 's',
      },
      excludes: /1/,
    })
    expect(() => em.checkConfig()).toThrowErrorMatchingInlineSnapshot(
      `"extends: expected: oneOf([oneOf([string, equal({source:string, pick:array(string).optional, omit:array(string).optional})]), array(oneOf([string, equal({source:string, pick:array(string).optional, omit:array(string).optional})]))]).optional, actual: {source:'s', pick:'s'}."`
    )

    em = edam({
      source: 'react',
      output: '',
      extends: {
        source: 's',
        other: '',
        pick: ['s'],
      },
    })
    expect(() => em.checkConfig()).toThrowErrorMatchingInlineSnapshot(
      `"extends: expected: oneOf([oneOf([string, equal({source:string, pick:array(string).optional, omit:array(string).optional})]), array(oneOf([string, equal({source:string, pick:array(string).optional, omit:array(string).optional})]))]).optional, actual: {source:'s', other:'', pick:['s']}."`
    )

    em = edam({
      source: 'react',
      output: '',
      extends: {
        source: 's',
        pick: ['s'],
      },
      excludes: /1/,
    })
    expect(() => em.checkConfig()).not.toThrow()
  })
})
