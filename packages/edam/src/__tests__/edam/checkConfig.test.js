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
      excludes: /1/
    })
    expect(() => em.checkConfig()).toThrowErrorMatchingInlineSnapshot(
      `"includes: expected: oneOf([string, array(string), function, instanceOf(RegExp)]).optional, actual: false."`
    )
  })
})
