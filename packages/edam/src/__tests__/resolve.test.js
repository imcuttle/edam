/**
 * @file standalone
 * @author Cuttle Cong
 * @date 2018/4/12
 * @description
 */

const edam = require('../../src/index').default
const nps = require('path')
const { readFileSync } = require('fs')

const join = (path) => {
  return nps.join(__dirname, 'fixture/edam/', path)
}

describe('edam.resolve', function() {
  it('should resolve normally', async (done) => {
    let em = edam({
      source: join('resolve'),
      userc: false
    })
    await em.normalizeConfig()

    em.on('pull:after', path => {
      expect(path).toBe(join('resolve/index.js'))
      done()
    })
    await em.pull()
  })

  it('should resolve-main normally', async (done) => {
    let em = edam({
      source: join('resolve-main'),
      userc: false
    })
    await em.normalizeConfig()

    em.on('pull:after', path => {
      expect(path).toBe(join('resolve-main/main.js'))
      done()
    })
    await em.pull()
  })

  it('should resolve-edam:main normally', async (done) => {
    let em = edam({
      source: join('resolve-edam:main'),
      userc: false
    })
    await em.normalizeConfig()

    em.on('pull:after', path => {
      expect(path).toBe(join('resolve-edam:main/edam.js'))
      done()
    })
    await em.pull()
  })
})
