/**
 * @file Variables
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */
import VariablesStore from '../../core/Compiler/Variables'

function spy(fn) {
  function beSpied() {
    beSpied.callCount++
    return fn.apply(this, arguments)
  }
  beSpied.callCount = 0
  return beSpied
}

describe('Variables', function() {
  const store = new VariablesStore()

  afterEach(function() {
    store.clear()
  })
  it('should Variables empty', async () => {
    expect(await store.get()).toEqual({})
    expect(await store.get('404')).toBeUndefined()
  })

  it('should Variables setting well', async () => {
    store.set('val', { a: { v: 'v' } })
    expect(await store.get('val')).toEqual({ a: { v: 'v' } })
    store.set('val', 'abc')
    expect(await store.get('val')).toEqual('abc')
  })

  it('should Variables run well about `setStore` api', async function() {
    store.setStore({
      a: {},
      f: 'f'
    })

    expect(await store.get()).toEqual({ a: {}, f: 'f' })
  })

  it('should Variables run well about `assign` api', async function() {
    store.assign({
      a: { a: 'xx' },
      f: 'f'
    })

    expect(await store.get()).toEqual({ a: { a: 'xx' }, f: 'f' })

    const fn = () => 'fff'
    store.assign({
      a: { b: '' },
      f: fn
    })
    expect(await store.get()).toEqual({ a: { b: '' }, f: fn })
  })

  it('should Variables run well about `merge` api', async function() {
    store.merge({
      a: { a: 'xx' },
      f: 'f'
    })

    expect(await store.get()).toEqual({ a: { a: 'xx' }, f: 'f' })

    const fn = () => 'fff'
    store.merge({
      a: { b: '' },
      f: fn
    })
    expect(await store.get()).toEqual({ a: { b: '', a: 'xx' }, f: fn })
  })
})
