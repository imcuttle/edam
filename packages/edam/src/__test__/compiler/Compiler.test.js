/**
 * @file Compiler
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */
import Compiler from '../../core/Compiler'
import DefaultLogger from '../../core/DefaultLogger'

describe('Compiler', function() {
  let cer
  beforeEach(function () {
    cer = new Compiler()
    cer.logger = new DefaultLogger
  })
  it('should Compiler hook worker will', () => {
    const h = cer.addHook('hook', 'echo abc')
    expect(h).toBeInstanceOf(Function)
  })
})
