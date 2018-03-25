/**
 * @file extendsMerge
 * @author Cuttle Cong
 * @date 2018/3/23
 * @description
 */
import _extends from '../core/extendsMerge'

describe('extendsMerge', function() {
  let source
  beforeEach(function() {
    source = {}
  })
  it('should extends works on simple case', function() {
    const extended = _extends(
      source,
      {
        v: 'v',
        a: 'a',
        c: 'c'
      },
      {
        v: 'vv',
        a: 'aa',
        b: 'bb'
      }
    )
    expect(source).toBe(extended)
    expect(source).toEqual({
      v: 'vv',
      a: 'aa',
      b: 'bb',
      c: 'c'
    })
  })

  it('should extends works on spec config', function() {
    const extended = _extends(source, {
      extends: ['./a', './b', 'p'],
      source: 'react',
      alias: {
        react: 'github.com/facebook/react',
        jest: 'facebook/jest/master'
      },
      cacheDir: '../.cache'
    }, {
      extends: ['./d', './a', './b', '../c'],
      source: 'babel',
      alias: {
        react: 'github.com/facebook/react/master',
        babel: 'babel/babel'
      },
      logLevel: 'warn'
    }, {
      extends: ['e']
    })

    expect(extended).toEqual({
      extends: ['e', './d', './a', './b', '../c', 'p'],
      logLevel: 'warn',
      cacheDir: '../.cache',
      alias: {
        react: 'github.com/facebook/react/master',
        jest: 'facebook/jest/master',
        babel: 'babel/babel'
      },
      source: 'babel'
    })
  })

  it('should works for concat array', function () {
    const f = () => {}
    expect(
      _extends({}, { extends: [1, 2, {}, f] }, { extends: [f, 3, 2] })
    ).toEqual({
      extends: [f, 3, 2, 1, {}]
    })
  })
})
