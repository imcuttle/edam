/**
 * @file main.spec
 * @author Cuttle Cong
 * @date 2018/3/31
 * @description
 */
const spawn = require('cross-spawn')
const { join } = require('path')
const fs = require('fs')

const cwd = join(__dirname, '..')

const exec = function(argString) {
  const sp = spawn.sync('./edam.js', argString.split(' '), { cwd })
  console.log('arguments', argString)
  console.log('sp.stderr', sp.stderr.toString())
  console.log('sp.error', sp.error)
  return sp
}

describe('main.spec', function() {
  it('should `--help` flag works', async () => {
    const sp = exec('--help')
    expect(sp.stdout.toString()).toEqual(expect.stringContaining('Usage'))
  })

  it('should `-h` flag works', async () => {
    const sp = exec('-h')
    expect(sp.stdout.toString()).toEqual(expect.stringContaining('Usage'))
  })

  it('should `--cache-dir` flag works', async () => {
    const sp = exec('./__tests__/fixture -o ./__tests__/fixture/output -y -w --cache-dir=' + join(__dirname, '.cache'))

    expect(
      fs.readFileSync(join(cwd, './__tests__/fixture/output/template.txt')).toString()
    ).toBe([
      'user: edam-user\n' +
      'pass: edam-user\n' +
      'age: null\n'
    ].join(''))
  })

})
