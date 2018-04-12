/**
 * @file standalone
 * @author Cuttle Cong
 * @date 2018/4/12
 * @description
 */

const edam = require('../../src/index').default
const { join } = require('path')
const { readFileSync } = require('fs')

describe('standalone', function() {
  it('should standalone', done => {
    const em = edam(
      {
        source: './edam.js',
        userc: false,
        output: './output',
        yes: true
      },
      { cwd: join(__dirname, 'standalone') }
    )

    em
      .run()
      .then(fp => {
        return fp.writeToFile(void 0, { overwrite: true }).then(() => {
          expect(
            readFileSync(
              join(__dirname, 'standalone', 'output', 'a')
            ).toString()
          ).toEqual(expect.stringMatching(/^yc/))
        })
      })
      .catch(console.error)
      .then(done)
  })

  it('should stringMacthcing', function() {
    expect('abc').toEqual(expect.stringMatching('bc'))
  })
})
