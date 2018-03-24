/**
 * @file EdamError
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import EdamError from '../lib/EdamError'

describe('EdamError', function() {
  it('should error instanceof Error', () => {
    expect(new EdamError('error')).toBeInstanceOf(Error)
    expect(new EdamError('error').id).toBe('EDAM_ERROR')
    expect(new EdamError('error', 'NOT_FOUND').code).toBe('NOT_FOUND')
  })

  it('should error has right message', () => {
    expect(new EdamError('error').message).toBe('[EDAM] error')
    expect(() => {
      throw new EdamError('error')
    }).toThrow(/\[EDAM\] error/)
  })
})
