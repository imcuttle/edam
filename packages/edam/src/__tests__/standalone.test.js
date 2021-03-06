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
    jest.setTimeout(14000)
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
      .finally(done)
  })

  it('should stringMatching', function() {
    expect('abc').toEqual(expect.stringMatching('bc'))
  })
})
