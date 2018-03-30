/**
 * @file matchMeta
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */

import matchMeta from '../../core/Compiler/matchMeta'

describe('matchMeta', function() {
  it('should matchMeta works fine on not matched', () => {
    expect(matchMeta('/ @loader module \n' + 'code here')).toEqual(
      expect.objectContaining({
        content: '/ @loader module \n' + 'code here',
        meta: {
        }
      })
    )
  })

  it('should matchMeta works fine on normal', () => {
    expect(matchMeta('// @loader module \n' + 'code here')).toEqual(
      expect.objectContaining({
        content: 'code here',
        meta: {
          loader: {
            name: 'module',
            query: {}
          }
        }
      })
    )

    expect(matchMeta('# @loader module \n' + 'code here')).toEqual(
      expect.objectContaining({
        content: 'code here',
        meta: {
          loader: {
            name: 'module',
            query: {}
          }
        }
      })
    )

    expect(
      matchMeta('/* @loader module?q=123&x=[] */\n' + 'code here')
    ).toEqual(
      expect.objectContaining({
        content: 'code here',
        meta: {
          loader: {
            name: 'module',
            query: {
              q: '123',
              x: '[]'
            }
          }
        }
      })
    )
  })

  it('should works on space prefix', function() {
    expect(matchMeta('// @loader module s \n' + '  code here')).toEqual(
      expect.objectContaining({
        content: '  code here',
        meta: {
          loader: {
            name: 'module s',
            query: {}
          }
        }
      })
    )

    expect(matchMeta('// @loader module?q=22 \n' + '\tcode here')).toEqual(
      expect.objectContaining({
        content: '\tcode here',
        meta: {
          loader: {
            name: 'module',
            query: {
              q: '22'
            }
          }
        }
      })
    )

    expect(matchMeta('// @loader x module a?q=22 \n' + '\tcode here')).toEqual(
      expect.objectContaining({
        content: '\tcode here',
        meta: {
          loader: {
            name: 'x module a',
            query: {
              q: '22'
            }
          }
        }
      })
    )

    expect(matchMeta('/* @loader x module a?q=22 */  \n' + '\tcode here')).toEqual(
      expect.objectContaining({
        content: '\tcode here',
        meta: {
          loader: {
            name: 'x module a',
            query: {
              q: '22'
            }
          }
        }
      })
    )

    expect(matchMeta(' /* @loader x module a?q=22 */  \n' + '\tcode here')).toEqual(
      expect.objectContaining({
        content: '\tcode here',
        meta: {
          loader: {
            name: 'x module a',
            query: {
              q: '22'
            }
          }
        }
      })
    )

    expect(matchMeta(' <!-- @loader x module a?q=22 -->  \n' + '\tcode here')).toEqual(
      expect.objectContaining({
        content: '\tcode here',
        meta: {
          loader: {
            name: 'x module a',
            query: {
              q: '22'
            }
          }
        }
      })
    )
  })
})
