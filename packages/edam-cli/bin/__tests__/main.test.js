/**
 * @file main.spec
 * @date 2018/3/31
 * @description
 */
process.env.DEBUG = 'edam:*'
const spawn = require('cross-spawn')
const { join } = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const gCwd = join(__dirname, '..')

const exec = function(argString, { cwd = gCwd } = {}) {
  const sp = spawn.sync(join(__dirname, '../edam.js'), argString.split(' '), {
    cwd
  })
  console.log('arguments', argString)
  console.log('sp.stderr', sp.stderr && sp.stderr.toString())
  console.log('sp.error', sp.error)
  return sp
}

describe('main.spec', function() {
  beforeEach(function () {
    rimraf.sync(join(__dirname, 'fixture/output'))
  })

  it('should `--help` flag works', async () => {
    const sp = exec('--help')
    expect(sp.stdout.toString()).toEqual(expect.stringContaining('Usage'))
  })

  it('should `-h` flag works', async () => {
    const sp = exec('-h')
    expect(sp.stdout.toString()).toEqual(expect.stringContaining('Usage'))
  })

  it('should `--cache-dir` flag works', async () => {
    const sp = exec(
      './__tests__/fixture -o ./__tests__/fixture/output -y -w --cache-dir=' +
        join(__dirname, '.cache')
    )

    expect(
      fs
        .readFileSync(join(gCwd, './__tests__/fixture/output/template.txt'))
        .toString()
    ).toBe(['user: edam-user\n' + 'pass: edam-user\n' + 'age: null\n'].join(''))
  })

  it('should works fine when source is setting in parent', async () => {
    const sp = exec('-o ../fixture/output -y -w', {
      cwd: join(__dirname, 'cwd')
    })

    expect(
      fs
        .readFileSync(join(gCwd, './__tests__/fixture/output/template.txt'))
        .toString()
    ).toBe(['user: edam-user\n' + 'pass: edam-user\n' + 'age: null\n'].join(''))
  })
})
