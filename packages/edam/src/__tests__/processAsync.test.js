/**
 * @file processAsync
 * @author Cuttle Cong
 * @date 2018/3/27
 * @description
 */

import processAsync from '../lib/processAsync'

const spawn = require('cross-spawn')
const pify = require('pify')

describe('processAsync', function() {
  it('should processAsync', async () => {
    expect(await pify(processAsync)(spawn('echo', ['aasd']))).toBe('aasd\n')
  })
})
