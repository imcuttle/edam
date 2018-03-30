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

  it('should Variables run in dynamic val sync once', async function() {
    function dynamic() {
      return 'abc'
    }
    const spied = spy(dynamic)
    store.set('val', spied)
    expect(await spied.callCount).toBe(0)
    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(1)
    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(1)
  })

  it('should Variables run in dynamic val async once', async function() {
    async function dynamic() {
      return new Promise(resolve => setTimeout(resolve, 1000, 'abc'))
    }
    const spied = spy(dynamic)
    store.set('val', spied)
    expect(await spied.callCount).toBe(0)
    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(1)
    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(1)
  })

  it('should Variables run in dynamic val async always', async function() {
    let spied
    async function dynamic(vc) {
      if (spied.callCount === 3) {
        vc.once()
      } else {
        vc.always()
      }
      return new Promise(resolve => setTimeout(resolve, 1000, 'abc'))
    }
    spied = spy(dynamic)
    store.set('val', spied)
    expect(await spied.callCount).toBe(0)
    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(1)
    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(2)

    expect(await store.get()).toEqual({ val: 'abc' })

    expect(await store.get('val')).toBe('abc')
    expect(await spied.callCount).toBe(3)
  })

  it('should Variables run well about `setStore` api', async function() {
    store.setStore({
      a: {},
      f: () => 'f'
    })

    expect(await store.get()).toEqual({ a: {}, f: 'f' })
  })

  it('should Variables run well about `assign` api', async function() {
    store.assign({
      a: { a: 'xx' },
      f: () => 'f'
    })

    expect(await store.get()).toEqual({ a: { a: 'xx' }, f: 'f' })

    store.assign({
      a: { b: '' },
      f: () => 'fff'
    })
    expect(await store.get()).toEqual({ a: { b: '' }, f: 'fff' })
  })

  it('should Variables run well about `merge` api', async function() {
    store.merge({
      a: { a: 'xx' },
      f: () => 'f'
    })

    expect(await store.get()).toEqual({ a: { a: 'xx' }, f: 'f' })

    store.merge({
      a: { b: '' },
      f: () => 'fff'
    })
    expect(await store.get()).toEqual({ a: { b: '', a: 'xx' }, f: 'fff' })
  })
})
