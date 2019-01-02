/**
 * @file edam
 * @author Cuttle Cong
 * @date 2018/10/22
 * @description
 */
const edam = require('../../').default
const dbg = require('debug')

describe('edam', function() {
  describe('edam.setConfig', () => {
    it('should edam.setConfig works', () => {
      const config = {}
      const em = edam(config)
      expect(em.config).not.toBe(config)

      em.setConfig({})
      expect(em.config).not.toBe(config)
      expect(em.config).toEqual(config)
    })

    it('should edam.setConfig works on debug mode', () => {
      const config = { debug: true }
      const em = edam(config)
      expect(dbg('edam:foooo').enabled).toBeTruthy()

      // disable
      em.setConfig({ debug: true, silent: true })
      expect(dbg('edam:foooo').enabled).toBeFalsy()
      // enable
      em.setConfig({ debug: true })
      expect(dbg('edam:foooo').enabled).toBeTruthy()
      // disable
      em.setConfig({ debug: false })
      expect(dbg('edam:foooo').enabled).toBeFalsy()
    })
  })
})
