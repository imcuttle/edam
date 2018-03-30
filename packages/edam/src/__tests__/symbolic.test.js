/**
 * @file symbolic
 * @author Cuttle Cong
 * @date 2018/3/29
 * @description
 */

import symbolic from '../lib/symbolic'

describe('symbolic', function () {
  it('should symbolic', () => {
    const t = {
      a: 2222
    }
    const r = {
      b: 'bbb'
    }
    symbolic(t, 'a', [r, 'b'])
    expect(r.b).toBe('bbb')
    expect(t.a).toBe('bbb')
    t.a = 'aaa'
    expect(t.a).toBe('aaa')
    expect(r.b).toBe('aaa')
  })
})
