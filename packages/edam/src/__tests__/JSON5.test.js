/**
 * @file JSON5
 * @author Cuttle Cong
 * @date 2018/4/3
 * @description
 */

const JSON5 = require('json5')

describe('JSON5', function() {
  it('should JSON5', () => {
    expect(JSON5.parse(`{
      // a: {},
      v: {
        // y: 'y',
        x: 'x'
      }
    }`)).toEqual({
      v: {
        x: 'x'
      }
    })
  })
})
