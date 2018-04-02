/**
 * @file match
 * @author Cuttle Cong
 * @date 2018/4/2
 * @description
 */
import { isMatch } from '../lib/match'

describe('match', function () {
  it('should match case 1', () => {
    expect(isMatch('test.js', '*.js')).toBeTruthy()
  })

  it('should match case 2', () => {
    expect(isMatch('test.js', '*.jsx?')).toBeFalsy()
  })
})
