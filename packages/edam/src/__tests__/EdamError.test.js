/**
 * @file EdamError
 * @author Cuttle Cong
 * @date 2018/3/24
 * @description
 */
import EdamError from '../core/EdamError'

describe('EdamError', function() {
  it('should error instanceof Error', () => {
    expect(new EdamError('error')).toBeInstanceOf(Error)
    expect(new EdamError('error').id).toBe('EDAM_ERROR')
    expect(new EdamError('error', 'NOT_FOUND').code).toBe('NOT_FOUND')
  })
})
